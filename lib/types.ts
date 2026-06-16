export type Phase = "lobby" | "clue" | "vote" | "reveal" | "guess" | "ended";
export type Role = "civilian" | "undercover" | "mrwhite";
export type Winner = "civilians" | "infiltrators" | "mrwhite";

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  alive: boolean;
  role: Role | null;
  word: string | null;
  gloss: string | null;
}

export interface Clue {
  round: number;
  playerId: string;
  text: string;
}

export interface Vote {
  round: number;
  voterId: string;
  targetId: string;
}

export interface Settings {
  numUndercover: number;
  mrWhite: boolean;
  // Category keys in play. Empty = all categories.
  categories: string[];
  // Face-to-face mode: skip in-app voting; the host eliminates after an
  // out-loud vote.
  faceToFace: boolean;
}

export interface LastResult {
  eliminatedId: string | null;
  role: Role | null;
  word: string | null;
  tie?: boolean;
  skipped?: boolean;
  mrWhiteGuess?: string;
  mrWhiteCorrect?: boolean;
}

export interface WordPair {
  civilian: string;
  civilianGloss: string;
  undercover: string;
  undercoverGloss: string;
  category: string;
}

export interface Room {
  code: string;
  hostId: string;
  phase: Phase;
  round: number;
  settings: Settings;
  players: Player[];
  turnOrder: string[];
  turnIndex: number;
  clues: Clue[];
  votes: Vote[];
  pendingGuess?: string | null;
  winner?: Winner | null;
  pair?: WordPair | null;
  lastResult?: LastResult;
  createdAt: number;
}
