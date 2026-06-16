import { NextRequest, NextResponse } from "next/server";
import { getRoom, setRoom } from "@/lib/store";
import type { Room } from "@/lib/types";

export const dynamic = "force-dynamic";

// Avoids ambiguous characters (0/O, 1/I).
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function genCode() {
  let s = "";
  for (let i = 0; i < 4; i++) s += CHARS[Math.floor(Math.random() * CHARS.length)];
  return s;
}

export async function POST(req: NextRequest) {
  const { name, playerId } = await req.json().catch(() => ({}));
  if (!name || !playerId) {
    return NextResponse.json({ error: "Missing name" }, { status: 400 });
  }

  let code = genCode();
  for (let i = 0; i < 5 && (await getRoom(code)); i++) code = genCode();

  const room: Room = {
    code,
    hostId: playerId,
    phase: "lobby",
    round: 0,
    settings: { numUndercover: 1, mrWhite: false },
    players: [
      { id: playerId, name: String(name).slice(0, 20), isHost: true, alive: true, role: null, word: null, gloss: null },
    ],
    turnOrder: [],
    turnIndex: 0,
    clues: [],
    votes: [],
    winner: null,
    pair: null,
    createdAt: Date.now(),
  };

  await setRoom(room);
  return NextResponse.json({ code });
}
