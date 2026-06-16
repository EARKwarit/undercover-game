# 🕵️ Undercover — Thai Trends Edition

An online, play-from-your-phone version of the social-deduction party game
**Undercover**, with secret words drawn from trending **Thai internet slang &
memes**. UI is in English; the words are Thai (with small English hints shown
only to you).

Built with **Next.js (App Router)** + **Upstash Redis**, ready to deploy on **Vercel**.

## How the game works

- Everyone gets a secret word. Most players (**Civilians**) share the same word;
  one or more **Undercover** players get a *similar but different* word — and they
  don't know they're the impostor.
- Each round players take turns giving a short clue about their word (without
  saying it), then everyone votes to eliminate someone.
- **Civilians win** when all impostors are out. **Undercover wins** if they
  survive until they equal the civilians.
- Optional **Mr. White** gets no word at all. If voted out, they get one guess at
  the civilians' word to steal the win.

## Run it locally

> ⚠️ Requires **Node.js 18.17+** (you currently have Node 14 — install the
> latest LTS from https://nodejs.org first).

```bash
npm install
npm run dev
```

Open http://localhost:3000. With no Redis configured it uses an in-memory store,
which is fine for local testing on one machine.

To test the multiplayer feel locally, open the room in several browser tabs /
windows (each tab is a separate "device"/player).

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **New Project → import the repo**.
3. Add an Upstash Redis database (free):
   - In the Vercel project, go to **Storage → Create → Upstash (Redis)**, or
     create one at https://upstash.com.
   - The Vercel integration auto-injects `KV_REST_API_URL` and
     `KV_REST_API_TOKEN`. (If you created it on upstash.com instead, copy its
     REST URL + token into those env vars — see `.env.example`.)
4. **Deploy.** Share the URL with your friends — one person creates a room, the
   rest join with the 4-letter code (or the copied invite link).

> Redis is required on Vercel: serverless functions don't share memory, so the
> in-memory fallback won't work there. The game state lives in Redis and expires
> after 8 hours of inactivity.

## Customising the words

Edit `lib/words.ts`. Each entry is a pair of related Thai words; the app randomly
picks one pair per game and randomly decides which side is the civilians' word.
Add as many pairs as you like.

## Project layout

```
app/
  page.tsx                 # home: create / join a room
  room/[code]/page.tsx     # the game room (all phases)
  api/room/create          # create a room
  api/room/join            # join a room
  api/room/[code]          # GET state (per-player) + POST actions
lib/
  game.ts                  # all game rules (roles, clues, votes, win logic)
  words.ts                 # Thai slang/meme word pairs
  store.ts                 # Redis (or in-memory) storage + locking
  types.ts                 # shared types
```
