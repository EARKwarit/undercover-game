import type { Room, Settings, Winner } from "./types";
import { WORD_PAIRS } from "./words";

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "");

export function alivePlayers(room: Room) {
  return room.players.filter((p) => p.alive);
}

export function sanitizeSettings(payload: any, numPlayers: number): Settings {
  const mrWhite = !!payload?.mrWhite;
  let numUndercover = parseInt(payload?.numUndercover, 10);
  if (!Number.isFinite(numUndercover)) numUndercover = 1;
  const maxUc = Math.max(1, numPlayers - 1);
  numUndercover = Math.min(Math.max(1, numUndercover), maxUc);
  return { numUndercover, mrWhite };
}

export function startGame(room: Room): string | null {
  if (room.phase !== "lobby") return "Game already started";
  const n = room.players.length;
  if (n < 3) return "Need at least 3 players to start";

  const uc = room.settings.numUndercover;
  const mw = room.settings.mrWhite ? 1 : 0;
  if (uc < 1) return "Need at least 1 undercover";
  const special = uc + mw;
  if (special >= n) return "Too many special roles for this many players";
  if (n - special <= special) return "There must be more civilians than special roles";

  const pair = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];
  // Randomly decide which side of the pair is the "civilian" word this round.
  const swap = Math.random() < 0.5;
  const civWord = swap ? pair.undercover : pair.civilian;
  const civGloss = swap ? pair.undercoverGloss : pair.civilianGloss;
  const ucWord = swap ? pair.civilian : pair.undercover;
  const ucGloss = swap ? pair.civilianGloss : pair.undercoverGloss;

  const ids = shuffle(room.players.map((p) => p.id));
  const ucSet = new Set(ids.slice(0, uc));
  const mwSet = new Set(ids.slice(uc, uc + mw));

  for (const p of room.players) {
    p.alive = true;
    if (ucSet.has(p.id)) {
      p.role = "undercover";
      p.word = ucWord;
      p.gloss = ucGloss;
    } else if (mwSet.has(p.id)) {
      p.role = "mrwhite";
      p.word = null;
      p.gloss = null;
    } else {
      p.role = "civilian";
      p.word = civWord;
      p.gloss = civGloss;
    }
  }

  room.pair = { civilian: civWord, civilianGloss: civGloss, undercover: ucWord, undercoverGloss: ucGloss };
  room.round = 1;
  room.clues = [];
  room.votes = [];
  room.winner = null;
  room.pendingGuess = null;
  room.lastResult = undefined;
  room.turnOrder = shuffle(alivePlayers(room).map((p) => p.id));
  room.turnIndex = 0;
  room.phase = "clue";
  return null;
}

export function submitClue(room: Room, playerId: string, text: string): string | null {
  if (room.phase !== "clue") return "It's not the clue phase";
  const t = text.trim();
  if (!t) return "Clue can't be empty";
  if (t.length > 40) return "Clue is too long";
  const currentId = room.turnOrder[room.turnIndex];
  if (currentId !== playerId) return "It's not your turn";

  room.clues.push({ round: room.round, playerId, text: t });
  room.turnIndex++;
  if (room.turnIndex >= room.turnOrder.length) {
    room.phase = "vote";
  }
  return null;
}

export function submitVote(room: Room, playerId: string, targetId: string): string | null {
  if (room.phase !== "vote") return "It's not the voting phase";
  const voter = room.players.find((p) => p.id === playerId);
  if (!voter || !voter.alive) return "You can't vote";
  // "skip" is an abstention — a vote to eliminate no one this round.
  if (targetId !== "skip") {
    if (targetId === playerId) return "You can't vote for yourself";
    const target = room.players.find((p) => p.id === targetId);
    if (!target || !target.alive) return "Invalid vote target";
  }

  const existing = room.votes.find((v) => v.round === room.round && v.voterId === playerId);
  if (existing) existing.targetId = targetId;
  else room.votes.push({ round: room.round, voterId: playerId, targetId });

  const alive = alivePlayers(room);
  const roundVotes = room.votes.filter((v) => v.round === room.round);
  if (roundVotes.length >= alive.length) tally(room);
  return null;
}

function tally(room: Room) {
  const roundVotes = room.votes.filter((v) => v.round === room.round);
  const counts = new Map<string, number>();
  for (const v of roundVotes) counts.set(v.targetId, (counts.get(v.targetId) || 0) + 1);

  let max = -1;
  for (const c of counts.values()) if (c > max) max = c;
  const top = [...counts.entries()].filter(([, c]) => c === max).map(([id]) => id);
  const tie = top.length > 1;
  const eliminatedId = top[Math.floor(Math.random() * top.length)];

  // The group voted to skip — no one is eliminated this round.
  if (eliminatedId === "skip") {
    room.lastResult = { eliminatedId: null, role: null, word: null, tie, skipped: true };
    room.phase = "reveal";
    return;
  }

  const p = room.players.find((pl) => pl.id === eliminatedId)!;
  p.alive = false;
  room.lastResult = { eliminatedId, role: p.role!, word: p.word, tie };

  if (p.role === "mrwhite") {
    // Eliminated Mr. White gets one chance to guess the civilians' word.
    room.phase = "guess";
    room.pendingGuess = eliminatedId;
    return;
  }

  const w = evaluateWinner(room);
  room.winner = w;
  room.phase = w ? "ended" : "reveal";
}

export function submitGuess(room: Room, playerId: string, guess: string): string | null {
  if (room.phase !== "guess") return "It's not the guessing phase";
  if (room.pendingGuess !== playerId) return "It's not your guess to make";

  const correct = !!room.pair && norm(guess) === norm(room.pair.civilian);
  room.lastResult = { ...(room.lastResult as any), mrWhiteGuess: guess.trim(), mrWhiteCorrect: correct };
  room.pendingGuess = null;

  if (correct) {
    room.winner = "mrwhite";
    room.phase = "ended";
    return null;
  }
  const w = evaluateWinner(room);
  room.winner = w;
  room.phase = w ? "ended" : "reveal";
  return null;
}

export function evaluateWinner(room: Room): Winner | null {
  const alive = alivePlayers(room);
  const infiltrators = alive.filter((p) => p.role !== "civilian");
  const civilians = alive.filter((p) => p.role === "civilian");
  if (infiltrators.length === 0) return "civilians";
  if (civilians.length <= infiltrators.length) return "infiltrators";
  return null;
}

export function nextRound(room: Room, playerId: string): string | null {
  if (room.phase !== "reveal") return "Can't continue right now";
  if (playerId !== room.hostId) return "Only the host can continue";
  room.round++;
  room.turnOrder = shuffle(alivePlayers(room).map((p) => p.id));
  room.turnIndex = 0;
  room.lastResult = undefined;
  room.phase = "clue";
  return null;
}

export function restart(room: Room, playerId: string): string | null {
  if (playerId !== room.hostId) return "Only the host can start a new game";
  for (const p of room.players) {
    p.alive = true;
    p.role = null;
    p.word = null;
    p.gloss = null;
  }
  room.phase = "lobby";
  room.round = 0;
  room.clues = [];
  room.votes = [];
  room.winner = null;
  room.pendingGuess = null;
  room.lastResult = undefined;
  room.pair = null;
  room.turnOrder = [];
  room.turnIndex = 0;
  return null;
}

export function leave(room: Room, playerId: string) {
  const idx = room.players.findIndex((p) => p.id === playerId);
  if (idx < 0) return;
  const wasHost = room.players[idx].isHost;
  room.players.splice(idx, 1);
  room.turnOrder = room.turnOrder.filter((id) => id !== playerId);
  if (room.turnIndex > room.turnOrder.length) room.turnIndex = room.turnOrder.length;
  if (wasHost && room.players.length) {
    room.players[0].isHost = true;
    room.hostId = room.players[0].id;
  }
}

/** Build the client-safe view of a room for a given viewer (hides secrets). */
export function publicView(room: Room, viewerId: string) {
  const ended = room.phase === "ended";

  const players = room.players.map((p) => {
    const revealRole = ended || !p.alive;
    return {
      id: p.id,
      name: p.name,
      isHost: p.isHost,
      alive: p.alive,
      role: revealRole ? p.role : null,
      gaveClue: room.clues.some((c) => c.round === room.round && c.playerId === p.id),
      voted: room.votes.some((v) => v.round === room.round && v.voterId === p.id),
    };
  });

  const me = room.players.find((p) => p.id === viewerId);

  const clues = room.clues.map((c) => ({
    round: c.round,
    playerId: c.playerId,
    name: room.players.find((p) => p.id === c.playerId)?.name || "?",
    text: c.text,
  }));

  const showVotes = room.phase === "reveal" || room.phase === "guess" || ended;
  const votes = (showVotes ? room.votes.filter((v) => v.round === room.round) : []).map((v) => ({
    voter: room.players.find((p) => p.id === v.voterId)?.name || "?",
    target: v.targetId === "skip" ? "Skip" : room.players.find((p) => p.id === v.targetId)?.name || "?",
  }));

  let lastResult: any = null;
  if (room.lastResult) {
    const ep = room.players.find((p) => p.id === room.lastResult!.eliminatedId);
    // Never expose the eliminated player's word mid-game — only their role.
    // The actual words are revealed on the end screen.
    lastResult = { ...room.lastResult, word: null, name: ep?.name || "?" };
  }

  return {
    code: room.code,
    phase: room.phase,
    round: room.round,
    hostId: room.hostId,
    settings: room.settings,
    winner: room.winner ?? null,
    players,
    currentTurnId: room.phase === "clue" ? room.turnOrder[room.turnIndex] ?? null : null,
    pendingGuessId: room.pendingGuess ?? null,
    clues,
    votes,
    lastResult,
    pair: ended ? room.pair : null,
    you: me
      ? {
          id: me.id,
          name: me.name,
          isHost: me.isHost,
          alive: me.alive,
          word: me.word,
          gloss: me.gloss,
          // Civilians and undercovers must NOT know their role while alive —
          // that's the whole game. Mr. White inherently knows (no word).
          role: me.role === "mrwhite" || !me.alive || ended ? me.role : null,
        }
      : null,
  };
}
