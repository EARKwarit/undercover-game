// Shared category definitions used by the word list, game logic, and lobby UI.
export const CATEGORIES = [
  { key: "influencer", label: "Influencers", emoji: "📱" },
  { key: "movie", label: "Movies", emoji: "🎬" },
  { key: "anime", label: "Anime", emoji: "⛩️" },
  { key: "series", label: "TV & Series", emoji: "📺" },
  { key: "character", label: "Characters & Toys", emoji: "🧸" },
  { key: "food", label: "Food & Drink", emoji: "🍜" },
  { key: "app", label: "Apps & Tech", emoji: "📲" },
  { key: "brand", label: "Brands", emoji: "🛍️" },
  { key: "car", label: "Cars", emoji: "🚗" },
  { key: "math", label: "Math", emoji: "➗" },
  { key: "misc", label: "Misc", emoji: "🎲" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

export const CATEGORY_KEYS: CategoryKey[] = CATEGORIES.map((c) => c.key);
