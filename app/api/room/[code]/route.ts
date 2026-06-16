import { NextRequest, NextResponse } from "next/server";
import { getRoom, setRoom, withLock } from "@/lib/store";
import {
  publicView,
  startGame,
  submitClue,
  submitVote,
  submitGuess,
  nextRound,
  restart,
  leave,
  sanitizeSettings,
} from "@/lib/game";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code.toUpperCase();
  const playerId = req.nextUrl.searchParams.get("playerId") || "";
  const room = await getRoom(code);
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
  return NextResponse.json(publicView(room, playerId), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code.toUpperCase();
  const { playerId, action, payload } = await req.json().catch(() => ({}));
  if (!playerId || !action) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const result = await withLock(code, async () => {
    const room = await getRoom(code);
    if (!room) return { error: "Room not found", status: 404 };

    let err: string | null = null;
    switch (action) {
      case "settings":
        if (playerId !== room.hostId) err = "Only the host can change settings";
        else if (room.phase !== "lobby") err = "Can't change settings now";
        else room.settings = sanitizeSettings(payload, room.players.length);
        break;
      case "start":
        if (playerId !== room.hostId) err = "Only the host can start";
        else err = startGame(room);
        break;
      case "clue":
        err = submitClue(room, playerId, String(payload?.text || ""));
        break;
      case "vote":
        err = submitVote(room, playerId, String(payload?.targetId || ""));
        break;
      case "guess":
        err = submitGuess(room, playerId, String(payload?.guess || ""));
        break;
      case "next":
        err = nextRound(room, playerId);
        break;
      case "restart":
        err = restart(room, playerId);
        break;
      case "leave":
        leave(room, playerId);
        break;
      default:
        err = "Unknown action";
    }

    if (err) return { error: err, status: 400 };
    await setRoom(room);
    return { ok: true as const };
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status || 400 });
  }
  return NextResponse.json({ ok: true });
}
