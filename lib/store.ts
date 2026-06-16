import { Redis } from "@upstash/redis";
import type { Room } from "./types";

// Resolve the Upstash REST credentials. The Vercel/Upstash integration may
// apply a custom prefix to the env var names (e.g. STORAGE_KV_REST_API_URL),
// so we match by suffix rather than expecting an exact name.
function resolveRedisEnv(): { url?: string; token?: string } {
  const env = process.env;
  let url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL;
  let token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    for (const key of Object.keys(env)) {
      const v = env[key];
      if (!v) continue;
      if (!url && (key.endsWith("KV_REST_API_URL") || key.endsWith("UPSTASH_REDIS_REST_URL"))) url = v;
      if (!token && (key.endsWith("KV_REST_API_TOKEN") || key.endsWith("UPSTASH_REDIS_REST_TOKEN"))) token = v;
    }
  }
  return { url, token };
}

const { url, token } = resolveRedisEnv();

const redis = url && token ? new Redis({ url, token }) : null;

// Rooms expire after 8 hours of inactivity.
const TTL_SECONDS = 60 * 60 * 8;

// In-memory fallback. Works only for a single Node process (`npm run dev`).
// On Vercel each serverless invocation may hit a different instance, so a real
// Redis store is required there.
const mem = new Map<string, Room>();
const memChains = new Map<string, Promise<unknown>>();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const usingRedis = !!redis;

export async function getRoom(code: string): Promise<Room | null> {
  if (redis) return (await redis.get<Room>(`room:${code}`)) ?? null;
  return mem.get(code) ?? null;
}

export async function setRoom(room: Room): Promise<void> {
  if (redis) {
    await redis.set(`room:${room.code}`, room, { ex: TTL_SECONDS });
    return;
  }
  mem.set(room.code, room);
}

/**
 * Serialize all read-modify-write operations on a single room so concurrent
 * requests (votes, clues from different players) don't clobber each other.
 */
export async function withLock<T>(code: string, fn: () => Promise<T>): Promise<T> {
  if (!redis) {
    const prev = memChains.get(code) ?? Promise.resolve();
    const next = prev.catch(() => {}).then(() => fn());
    memChains.set(code, next.catch(() => {}));
    return next;
  }

  const key = `lock:${code}`;
  for (let i = 0; i < 60; i++) {
    const ok = await redis.set(key, "1", { nx: true, px: 5000 });
    if (ok) {
      try {
        return await fn();
      } finally {
        await redis.del(key);
      }
    }
    await sleep(80);
  }
  // Lock contention timed out — proceed anyway rather than hang the request.
  return fn();
}
