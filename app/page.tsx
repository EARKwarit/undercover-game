"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPlayerId, getStoredName, setStoredName } from "./lib-client";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Prefill the name from a previous session.
  useEffect(() => {
    setName(getStoredName());
  }, []);

  const create = async () => {
    const nm = name.trim();
    if (!nm) return setError("Enter your name first");
    setBusy(true);
    setError("");
    try {
      setStoredName(nm);
      const r = await fetch("/api/room/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: nm, playerId: getPlayerId() }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed to create room");
      router.push(`/room/${d.code}`);
    } catch (e: any) {
      setError(e.message);
      setBusy(false);
    }
  };

  const join = () => {
    const nm = name.trim();
    const c = code.trim().toUpperCase();
    if (!nm) return setError("Enter your name first");
    if (c.length < 4) return setError("Enter a 4-letter room code");
    setStoredName(nm);
    router.push(`/room/${c}`);
  };

  return (
    <main className="flex flex-1 flex-col justify-center">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-black tracking-tight">
          🕵️ Undercover
        </h1>
        <p className="mt-2 text-zinc-400">
          Thai slang & meme edition <span className="thai">· ภาษาไทยสายแทรนด์</span>
        </p>
      </header>

      <div className="card space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-400">Your name</label>
          <input
            className="input"
            value={name}
            maxLength={20}
            placeholder="e.g. Bank"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button className="btn w-full" onClick={create} disabled={busy}>
          {busy ? "Creating…" : "Create a new room"}
        </button>

        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span className="h-px flex-1 bg-zinc-800" />
          OR JOIN A ROOM
          <span className="h-px flex-1 bg-zinc-800" />
        </div>

        <div className="flex gap-2">
          <input
            className="input uppercase tracking-widest"
            value={code}
            maxLength={4}
            placeholder="CODE"
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && join()}
          />
          <button className="btn btn-ghost shrink-0" onClick={join}>
            Join
          </button>
        </div>

        {error && <p className="text-sm text-rose-400">{error}</p>}
      </div>

      <HowToPlay />
    </main>
  );
}

function HowToPlay() {
  return (
    <details className="card mt-5 text-sm text-zinc-300">
      <summary className="cursor-pointer font-semibold text-zinc-100">How to play</summary>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-400">
        <li>Everyone gets a secret Thai word. Most players (Civilians) share the same word; one or more <b>Undercover</b> players get a similar-but-different word — and they don't know they're the impostor!</li>
        <li>Each round, players take turns giving a one-word/short clue describing their word — without saying it outright.</li>
        <li>Then everyone votes to eliminate the player they think is Undercover.</li>
        <li><b>Civilians win</b> when all impostors are eliminated. <b>Undercover wins</b> if they survive until they equal the civilians.</li>
        <li>Optional <b>Mr. White</b> gets no word at all — bluff your way through, and if you're voted out you get one chance to guess the civilians' word to steal the win.</li>
      </ul>
    </details>
  );
}
