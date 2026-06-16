import { NextRequest, NextResponse } from "next/server";
import { getRoom, setRoom, withLock } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { code, name, playerId } = await req.json().catch(() => ({}));
  const C = String(code || "").toUpperCase().trim();
  if (!C || !name || !playerId) {
    return NextResponse.json({ error: "Missing info" }, { status: 400 });
  }

  const err = await withLock(C, async () => {
    const room = await getRoom(C);
    if (!room) return "Room not found";

    const existing = room.players.find((p) => p.id === playerId);
    if (existing) {
      // Reconnect / rename.
      existing.name = String(name).slice(0, 20);
      await setRoom(room);
      return null;
    }

    if (room.phase !== "lobby") return "That game is already in progress";
    if (room.players.length >= 12) return "Room is full (max 12)";

    room.players.push({
      id: playerId,
      name: String(name).slice(0, 20),
      isHost: false,
      alive: true,
      role: null,
      word: null,
      gloss: null,
    });
    await setRoom(room);
    return null;
  });

  if (err) return NextResponse.json({ error: err }, { status: 400 });
  return NextResponse.json({ code: C });
}
