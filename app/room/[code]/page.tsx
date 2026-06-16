"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { getPlayerId, getStoredName, setStoredName } from "../../lib-client";
import { CATEGORIES } from "@/lib/categories";

const ALL_CATEGORY_KEYS = CATEGORIES.map((c) => c.key);

type PlayerView = {
  id: string;
  name: string;
  isHost: boolean;
  alive: boolean;
  role: "civilian" | "undercover" | "mrwhite" | null;
  gaveClue: boolean;
  voted: boolean;
};

type RoomView = {
  code: string;
  phase: "lobby" | "clue" | "vote" | "reveal" | "guess" | "ended";
  round: number;
  hostId: string;
  settings: { numUndercover: number; mrWhite: boolean; categories: string[]; faceToFace: boolean };
  winner: "civilians" | "infiltrators" | "mrwhite" | null;
  players: PlayerView[];
  currentTurnId: string | null;
  pendingGuessId: string | null;
  clues: { round: number; playerId: string; name: string; text: string }[];
  votes: { voter: string; target: string }[];
  lastResult: {
    eliminatedId: string | null;
    name: string;
    role: "civilian" | "undercover" | "mrwhite" | null;
    word: string | null;
    tie?: boolean;
    skipped?: boolean;
    mrWhiteGuess?: string;
    mrWhiteCorrect?: boolean;
  } | null;
  pair: { civilian: string; civilianGloss: string; undercover: string; undercoverGloss: string } | null;
  you: {
    id: string;
    name: string;
    isHost: boolean;
    alive: boolean;
    word: string | null;
    gloss: string | null;
    role: "civilian" | "undercover" | "mrwhite" | null;
  } | null;
};

const ROLE_LABEL: Record<string, string> = {
  civilian: "Civilian",
  undercover: "Undercover",
  mrwhite: "Mr. White",
};

export default function RoomPage() {
  const params = useParams<{ code: string }>();
  const code = String(params.code || "").toUpperCase();
  const router = useRouter();

  const [pid, setPid] = useState("");
  const [joined, setJoined] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [state, setState] = useState<RoomView | null>(null);
  const [error, setError] = useState("");
  const [fatal, setFatal] = useState("");

  useEffect(() => {
    setPid(getPlayerId());
    setNameInput(getStoredName());
  }, []);

  const poll = useCallback(async () => {
    if (!pid) return;
    try {
      const r = await fetch(`/api/room/${code}?playerId=${pid}`, { cache: "no-store" });
      if (r.status === 404) {
        setFatal("This room doesn't exist (it may have expired).");
        return;
      }
      if (r.ok) setState(await r.json());
    } catch {
      /* transient network error — keep polling */
    }
  }, [code, pid]);

  const join = useCallback(
    async (nm: string) => {
      const r = await fetch("/api/room/join", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code, name: nm, playerId: getPlayerId() }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        setFatal(d.error || "Couldn't join this room.");
        return;
      }
      setStoredName(nm);
      setJoined(true);
      poll();
    },
    [code, poll]
  );

  // Auto-join if we already have a stored name.
  useEffect(() => {
    if (!pid || joined) return;
    const nm = getStoredName();
    if (nm) join(nm);
  }, [pid, joined, join]);

  // Poll for state while in the room.
  useEffect(() => {
    if (!joined) return;
    poll();
    const t = setInterval(poll, 1500);
    return () => clearInterval(t);
  }, [joined, poll]);

  const act = useCallback(
    async (action: string, payload?: any) => {
      setError("");
      const r = await fetch(`/api/room/${code}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ playerId: pid, action, payload }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) setError(d.error || "Something went wrong");
      poll();
    },
    [code, pid, poll]
  );

  if (fatal) {
    return (
      <Centered>
        <p className="mb-4 text-lg">{fatal}</p>
        <button className="btn" onClick={() => router.push("/")}>
          Back home
        </button>
      </Centered>
    );
  }

  if (!joined) {
    return (
      <Centered>
        <div className="card w-full max-w-sm">
          <h1 className="mb-1 text-2xl font-bold">Join room {code}</h1>
          <p className="mb-4 text-sm text-zinc-400">Enter your name to join the game.</p>
          <input
            className="input"
            value={nameInput}
            maxLength={20}
            placeholder="Your name"
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && nameInput.trim() && join(nameInput.trim())}
          />
          <button className="btn mt-3 w-full" disabled={!nameInput.trim()} onClick={() => join(nameInput.trim())}>
            Join
          </button>
        </div>
      </Centered>
    );
  }

  if (!state || !state.you) {
    return <Centered>Loading…</Centered>;
  }

  return (
    <main className="flex flex-1 flex-col gap-4">
      <TopBar state={state} onLeave={() => act("leave").then(() => router.push("/"))} />
      <YourWord state={state} />
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <PhasePanel state={state} pid={pid} act={act} />
      <Players state={state} />
      {state.clues.length > 0 && <CluesLog state={state} />}
      <HostControls state={state} act={act} />
    </main>
  );
}

function HostControls({ state, act }: { state: RoomView; act: (a: string, p?: any) => void }) {
  const active = ["clue", "vote", "reveal", "guess"].includes(state.phase);
  if (!state.you!.isHost || !active) return null;
  return (
    <details className="card text-sm">
      <summary className="cursor-pointer text-xs uppercase tracking-wide text-zinc-500">Host controls 👑</summary>
      <div className="mt-3 flex flex-col gap-2">
        <button
          className="btn btn-ghost"
          onClick={() => {
            if (confirm("Re-deal a new word pair and restart this round? Roles will be reshuffled."))
              act("redeal");
          }}
        >
          ↻ New words (re-deal)
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => {
            if (confirm("End this game and send everyone back to the lobby?")) act("restart");
          }}
        >
          ⤺ End game · back to lobby
        </button>
      </div>
    </details>
  );
}

/* ---------- pieces ---------- */

function Centered({ children }: { children: React.ReactNode }) {
  return <main className="flex flex-1 flex-col items-center justify-center text-center">{children}</main>;
}

function TopBar({ state, onLeave }: { state: RoomView; onLeave: () => void }) {
  const [copied, setCopied] = useState(false);
  const copyLink = () => {
    const url = `${location.origin}/room/${state.code}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-center justify-between">
      <div>
        <button onClick={copyLink} className="chip font-mono text-base tracking-widest">
          {state.code} {copied ? "✓" : "📋"}
        </button>
        {state.phase !== "lobby" && state.phase !== "ended" && (
          <span className="ml-2 text-sm text-zinc-400">Round {state.round}</span>
        )}
      </div>
      <button className="text-xs text-zinc-500 hover:text-rose-400" onClick={onLeave}>
        Leave
      </button>
    </div>
  );
}

function YourWord({ state }: { state: RoomView }) {
  const you = state.you!;
  if (!you.alive && state.phase !== "ended") {
    return (
      <div className="card border-rose-900/60 bg-rose-950/30 text-center">
        <p className="text-sm uppercase tracking-wide text-rose-300">You were eliminated</p>
        {you.role && <p className="mt-1 font-semibold">You were the {ROLE_LABEL[you.role]}</p>}
        <p className="mt-1 text-sm text-zinc-400">Sit back and watch how it unfolds 🍿</p>
      </div>
    );
  }
  if (you.role === "mrwhite") {
    return (
      <div className="card border-amber-700/50 bg-amber-950/20 text-center">
        <p className="text-sm uppercase tracking-wide text-amber-300">You are Mr. White 🤍</p>
        <p className="mt-1 text-zinc-300">You have NO word.</p>
        <p className="mt-1 text-sm text-zinc-400">
          Listen carefully, bluff a clue, and figure out the civilians' word. If you're voted out you get one guess to steal the win.
        </p>
      </div>
    );
  }
  return (
    <div className="card text-center">
      <p className="text-xs uppercase tracking-wide text-zinc-500">Your secret word</p>
      <p className="thai mt-1 text-4xl font-black text-indigo-300">{you.word}</p>
      {you.gloss && <p className="mt-1 text-sm text-zinc-400">({you.gloss})</p>}
      <p className="mt-2 text-xs text-zinc-500">Describe it — don't say it. Someone here has a different word…</p>
    </div>
  );
}

function PhasePanel({ state, pid, act }: { state: RoomView; pid: string; act: (a: string, p?: any) => void }) {
  switch (state.phase) {
    case "lobby":
      return <Lobby state={state} pid={pid} act={act} />;
    case "clue":
      return <CluePhase state={state} pid={pid} act={act} />;
    case "vote":
      return <VotePhase state={state} pid={pid} act={act} />;
    case "guess":
      return <GuessPhase state={state} pid={pid} act={act} />;
    case "reveal":
      return <RevealPhase state={state} pid={pid} act={act} />;
    case "ended":
      return <EndedPhase state={state} pid={pid} act={act} />;
    default:
      return null;
  }
}

function JoinQR({ code }: { code: string }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(`${location.origin}/room/${code}`);
  }, [code]);
  if (!url) return null;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-2xl bg-white p-3">
        <QRCodeSVG value={url} size={168} includeMargin />
      </div>
      <span className="text-xs text-zinc-500">Scan to join room {code}</span>
    </div>
  );
}

function Lobby({ state, pid, act }: { state: RoomView; pid: string; act: (a: string, p?: any) => void }) {
  const isHost = state.you!.isHost;
  const n = state.players.length;
  const s = state.settings;
  const maxUc = Math.max(1, n - 1 - (s.mrWhite ? 1 : 0));
  const allOn = !s.categories || s.categories.length === 0;
  const catOn = (key: string) => allOn || s.categories.includes(key);

  // Always send the full settings object so one change doesn't reset the others.
  const save = (partial: Partial<RoomView["settings"]>) =>
    act("settings", { numUndercover: s.numUndercover, mrWhite: s.mrWhite, categories: s.categories, ...partial });

  const toggleCat = (key: string) => {
    const base = allOn ? [...ALL_CATEGORY_KEYS] : [...s.categories];
    const i = base.indexOf(key);
    if (i >= 0) base.splice(i, 1);
    else base.push(key);
    if (base.length === 0) return; // keep at least one category in play
    save({ categories: base.length === ALL_CATEGORY_KEYS.length ? [] : base });
  };

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-bold">Lobby · {n} player{n !== 1 ? "s" : ""}</h2>
      <p className="text-sm text-zinc-400">Scan the QR, share the code, or tap it up top to copy an invite link. Need at least 3 players.</p>
      <JoinQR code={state.code} />

      {isHost ? (
        <>
          <div className="space-y-3 rounded-xl bg-zinc-800/50 p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Undercover players</span>
              <div className="flex items-center gap-3">
                <button className="btn btn-ghost h-9 w-9 !p-0 text-lg" onClick={() => save({ numUndercover: s.numUndercover - 1 })} disabled={s.numUndercover <= 1}>
                  −
                </button>
                <span className="w-6 text-center text-lg font-bold">{s.numUndercover}</span>
                <button className="btn btn-ghost h-9 w-9 !p-0 text-lg" onClick={() => save({ numUndercover: s.numUndercover + 1 })} disabled={s.numUndercover >= maxUc}>
                  +
                </button>
              </div>
            </div>
            <label className="flex items-center justify-between">
              <span className="font-medium">Add a Mr. White 🤍</span>
              <input type="checkbox" className="h-5 w-5 accent-indigo-500" checked={s.mrWhite} onChange={(e) => save({ mrWhite: e.target.checked })} />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>
                <span className="font-medium">Face-to-face mode 🪑</span>
                <span className="block text-xs text-zinc-400">Vote out loud; host taps who's eliminated.</span>
              </span>
              <input type="checkbox" className="h-5 w-5 shrink-0 accent-indigo-500" checked={!!s.faceToFace} onChange={(e) => save({ faceToFace: e.target.checked })} />
            </label>
          </div>

          <div className="space-y-2 rounded-xl bg-zinc-800/50 p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Categories in play</span>
              <button className="text-xs text-zinc-400 hover:text-zinc-100" onClick={() => save({ categories: [] })}>
                Select all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => toggleCat(c.key)}
                  className={`chip ${catOn(c.key) ? "!bg-indigo-500 !text-white" : "opacity-40"}`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-500">
              {allOn ? "All categories in play." : `${s.categories.length} selected — tap to toggle.`}
            </p>
          </div>
        </>
      ) : (
        <div className="rounded-xl bg-zinc-800/50 p-4 text-sm text-zinc-300">
          {s.numUndercover} undercover{s.mrWhite ? " + Mr. White" : ""}
          {s.faceToFace ? " · Face-to-face 🪑" : ""}.
          <div className="mt-1 text-zinc-400">
            Categories: {allOn ? "All" : CATEGORIES.filter((c) => s.categories.includes(c.key)).map((c) => c.label).join(", ")}
          </div>
          <div className="mt-2">Waiting for the host to start…</div>
        </div>
      )}

      {isHost && (
        <button className="btn w-full" disabled={n < 3} onClick={() => act("start")}>
          {n < 3 ? "Need 3+ players" : "Start game"}
        </button>
      )}
    </div>
  );
}

function CluePhase({ state, pid, act }: { state: RoomView; pid: string; act: (a: string, p?: any) => void }) {
  const [text, setText] = useState("");
  const myTurn = state.currentTurnId === pid && state.you!.alive;
  const current = state.players.find((p) => p.id === state.currentTurnId);

  return (
    <div className="card space-y-3">
      <h2 className="text-lg font-bold">🗣️ Clue phase</h2>
      {myTurn ? (
        <>
          <p className="text-sm text-zinc-400">Your turn! Give a one-word or short clue about your word.</p>
          <div className="flex gap-2">
            <input
              className="input"
              value={text}
              maxLength={40}
              placeholder="Your clue…"
              autoFocus
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && text.trim() && (act("clue", { text }), setText(""))}
            />
            <button className="btn shrink-0" disabled={!text.trim()} onClick={() => { act("clue", { text }); setText(""); }}>
              Send
            </button>
          </div>
        </>
      ) : (
        <p className="text-sm text-zinc-400">
          Waiting for <b className="text-zinc-100">{current?.name || "…"}</b> to give a clue…
        </p>
      )}
    </div>
  );
}

function VotePhase({ state, pid, act }: { state: RoomView; pid: string; act: (a: string, p?: any) => void }) {
  const me = state.players.find((p) => p.id === pid);
  const candidates = state.players.filter((p) => p.alive && p.id !== pid);
  const votedCount = state.players.filter((p) => p.voted).length;
  const aliveCount = state.players.filter((p) => p.alive).length;

  // Face-to-face mode: vote out loud, host taps who's eliminated.
  if (state.settings.faceToFace) {
    if (state.you!.isHost) {
      const aliveAll = state.players.filter((p) => p.alive);
      return (
        <div className="card space-y-3">
          <h2 className="text-lg font-bold">🪑 Face-to-face vote</h2>
          <p className="text-sm text-zinc-400">Discuss & vote out loud, then tap who gets eliminated.</p>
          <div className="grid grid-cols-2 gap-2">
            {aliveAll.map((p) => (
              <button key={p.id} className="btn btn-ghost" onClick={() => act("eliminate", { targetId: p.id })}>
                {p.name}
                {p.id === state.you!.id ? " (you)" : ""}
              </button>
            ))}
          </div>
          <button className="btn btn-ghost w-full !bg-zinc-800/60 text-zinc-400" onClick={() => act("eliminate", { targetId: "skip" })}>
            🙈 No elimination this round
          </button>
        </div>
      );
    }
    return (
      <div className="card">
        <h2 className="text-lg font-bold">🗣️ Vote out loud!</h2>
        <p className="mt-1 text-sm text-zinc-400">Discuss as a group and decide who to eliminate. The host will tap the result.</p>
      </div>
    );
  }

  if (!state.you!.alive) {
    return (
      <div className="card">
        <h2 className="text-lg font-bold">🗳️ Voting</h2>
        <p className="mt-1 text-sm text-zinc-400">You're out — waiting for the living to vote ({votedCount}/{aliveCount}).</p>
      </div>
    );
  }

  if (me?.voted) {
    return (
      <div className="card">
        <h2 className="text-lg font-bold">🗳️ Voting</h2>
        <p className="mt-1 text-sm text-zinc-400">Vote locked in. Waiting for others… ({votedCount}/{aliveCount})</p>
      </div>
    );
  }

  return (
    <div className="card space-y-3">
      <h2 className="text-lg font-bold">🗳️ Who's the impostor?</h2>
      <p className="text-sm text-zinc-400">Tap a player to vote them out.</p>
      <div className="grid grid-cols-2 gap-2">
        {candidates.map((p) => (
          <button key={p.id} className="btn btn-ghost" onClick={() => act("vote", { targetId: p.id })}>
            {p.name}
          </button>
        ))}
      </div>
      <button className="btn btn-ghost w-full !bg-zinc-800/60 text-zinc-400" onClick={() => act("vote", { targetId: "skip" })}>
        🙈 Skip — eliminate no one
      </button>
    </div>
  );
}

function GuessPhase({ state, pid, act }: { state: RoomView; pid: string; act: (a: string, p?: any) => void }) {
  const [guess, setGuess] = useState("");
  const isMe = state.pendingGuessId === pid;
  const mw = state.players.find((p) => p.id === state.pendingGuessId);

  return (
    <div className="card space-y-3 border-amber-700/50 bg-amber-950/20">
      <h2 className="text-lg font-bold">🤍 Mr. White's last chance</h2>
      {state.lastResult && (
        <p className="text-sm text-zinc-300">
          <b>{state.lastResult.name}</b> was voted out — and they were Mr. White!
        </p>
      )}
      {isMe ? (
        <>
          <p className="text-sm text-zinc-300">Guess the civilians' word. Get it right and you win the whole game.</p>
          <div className="flex gap-2">
            <input className="input thai" value={guess} maxLength={40} placeholder="The civilians' word…" autoFocus onChange={(e) => setGuess(e.target.value)} onKeyDown={(e) => e.key === "Enter" && guess.trim() && act("guess", { guess })} />
            <button className="btn shrink-0" disabled={!guess.trim()} onClick={() => act("guess", { guess })}>
              Guess
            </button>
          </div>
        </>
      ) : (
        <p className="text-sm text-zinc-400">
          <b className="text-zinc-100">{mw?.name || "Mr. White"}</b> is guessing the civilians' word…
        </p>
      )}
    </div>
  );
}

function RevealPhase({ state, pid, act }: { state: RoomView; pid: string; act: (a: string, p?: any) => void }) {
  const r = state.lastResult;
  return (
    <div className="card space-y-3">
      <h2 className="text-lg font-bold">📣 Round {state.round} result</h2>
      {r ? (
        <div className="rounded-xl bg-zinc-800/50 p-4">
          {r.tie && <p className="mb-1 text-xs text-amber-300">It was a tie — broken randomly.</p>}
          {r.skipped ? (
            <p>The group voted to <b>skip</b> — no one was eliminated this round.</p>
          ) : (
            <>
              <p>
                <b>{r.name}</b> was eliminated.
              </p>
              <p className="mt-1">
                They were the <b className={roleColor(r.role!)}>{ROLE_LABEL[r.role!]}</b>.
              </p>
            </>
          )}
          {r.mrWhiteGuess !== undefined && (
            <p className="mt-1 text-sm">
              Mr. White guessed <span className="thai font-semibold">{r.mrWhiteGuess}</span> —{" "}
              {r.mrWhiteCorrect ? "correct!" : "wrong."}
            </p>
          )}
        </div>
      ) : null}
      {state.votes.length > 0 && <VoteTally votes={state.votes} />}
      {state.you!.isHost ? (
        <button className="btn w-full" onClick={() => act("next")}>
          Next round →
        </button>
      ) : (
        <p className="text-center text-sm text-zinc-400">Waiting for the host to continue…</p>
      )}
    </div>
  );
}

function EndedPhase({ state, pid, act }: { state: RoomView; pid: string; act: (a: string, p?: any) => void }) {
  const w = state.winner;
  const banner =
    w === "civilians"
      ? { t: "🎉 Civilians win!", c: "text-emerald-300" }
      : w === "mrwhite"
      ? { t: "🤍 Mr. White wins!", c: "text-amber-300" }
      : { t: "🕵️ Undercover wins!", c: "text-rose-300" };

  return (
    <div className="card space-y-4 text-center">
      <h2 className={`text-2xl font-black ${banner.c}`}>{banner.t}</h2>

      {state.pair && (
        <div className="flex justify-center gap-3 text-sm">
          <div className="rounded-xl bg-emerald-950/40 px-4 py-2">
            <p className="text-xs text-emerald-300">Civilians' word</p>
            <p className="thai text-lg font-bold">{state.pair.civilian}</p>
            <p className="text-xs text-zinc-400">{state.pair.civilianGloss}</p>
          </div>
          <div className="rounded-xl bg-rose-950/40 px-4 py-2">
            <p className="text-xs text-rose-300">Undercover word</p>
            <p className="thai text-lg font-bold">{state.pair.undercover}</p>
            <p className="text-xs text-zinc-400">{state.pair.undercoverGloss}</p>
          </div>
        </div>
      )}

      {state.you!.isHost ? (
        <button className="btn w-full" onClick={() => act("restart")}>
          Play again (back to lobby)
        </button>
      ) : (
        <p className="text-sm text-zinc-400">Waiting for the host to start a new game…</p>
      )}
    </div>
  );
}

function VoteTally({ votes }: { votes: { voter: string; target: string }[] }) {
  const byTarget = new Map<string, string[]>();
  for (const v of votes) {
    if (!byTarget.has(v.target)) byTarget.set(v.target, []);
    byTarget.get(v.target)!.push(v.voter);
  }
  return (
    <div className="rounded-xl bg-zinc-800/40 p-3 text-sm">
      <p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">Votes</p>
      {[...byTarget.entries()].map(([target, voters]) => (
        <p key={target} className="text-zinc-300">
          <b>{target}</b> ({voters.length}) <span className="text-zinc-500">← {voters.join(", ")}</span>
        </p>
      ))}
    </div>
  );
}

function Players({ state }: { state: RoomView }) {
  return (
    <div className="card">
      <p className="mb-2 text-xs uppercase tracking-wide text-zinc-500">Players</p>
      <div className="space-y-1.5">
        {state.players.map((p) => (
          <div key={p.id} className={`flex items-center justify-between rounded-lg px-2 py-1.5 ${p.alive ? "" : "opacity-50"}`}>
            <span className="flex items-center gap-2">
              <span className={p.alive ? "" : "line-through"}>{p.name}</span>
              {p.isHost && <span title="Host">👑</span>}
              {p.id === state.you!.id && <span className="text-xs text-zinc-500">(you)</span>}
            </span>
            <span className="flex items-center gap-2 text-xs">
              {p.role && <span className={`chip ${roleColor(p.role)}`}>{ROLE_LABEL[p.role]}</span>}
              {state.phase === "clue" && p.alive && (p.gaveClue ? <span className="text-emerald-400">✓ clue</span> : state.currentTurnId === p.id ? <span className="text-indigo-300">…turn</span> : <span className="text-zinc-600">waiting</span>)}
              {state.phase === "vote" && p.alive && (p.voted ? <span className="text-emerald-400">✓ voted</span> : <span className="text-zinc-600">…</span>)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CluesLog({ state }: { state: RoomView }) {
  const rounds = useMemo(() => {
    const map = new Map<number, { name: string; text: string }[]>();
    for (const c of state.clues) {
      if (!map.has(c.round)) map.set(c.round, []);
      map.get(c.round)!.push({ name: c.name, text: c.text });
    }
    return [...map.entries()].sort((a, b) => b[0] - a[0]);
  }, [state.clues]);

  return (
    <details className="card text-sm" open>
      <summary className="cursor-pointer text-xs uppercase tracking-wide text-zinc-500">Clues</summary>
      <div className="mt-2 space-y-3">
        {rounds.map(([round, clues]) => (
          <div key={round}>
            <p className="mb-1 text-xs text-zinc-500">Round {round}</p>
            <div className="space-y-1">
              {clues.map((c, i) => (
                <p key={i} className="text-zinc-300">
                  <b className="text-zinc-100">{c.name}:</b> <span className="thai">{c.text}</span>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}

function roleColor(role: string) {
  if (role === "undercover") return "text-rose-300";
  if (role === "mrwhite") return "text-amber-300";
  return "text-emerald-300";
}
