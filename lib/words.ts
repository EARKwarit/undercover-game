import type { WordPair } from "./types";

// Word pairs for Undercover — English (Latin script), chosen to be viral /
// well-known on Thai social media. Pairs are intentionally HARD: two members of
// the same group, the same franchise/universe, or the same food/brand family,
// so clues are highly ambiguous. The gloss is a short private hint for whoever
// holds that word. The app picks one pair per game at random and randomly swaps
// which side is the Civilians' word.
export const WORD_PAIRS: WordPair[] = [
  // ---- Influencers (TikTokers / YouTubers), matched by gender / age / niche ----
  { civilian: "Charli D'Amelio", civilianGloss: "US TikTok dance superstar", undercover: "Addison Rae", undercoverGloss: "US TikTok dance superstar (same era)" },
  { civilian: "IShowSpeed", civilianGloss: "young US livestreamer (chaotic IRL)", undercover: "Kai Cenat", undercoverGloss: "young US livestreamer (chaotic IRL)" },
  { civilian: "KSI", civilianGloss: "YouTuber-boxer, Prime co-founder", undercover: "Logan Paul", undercoverGloss: "YouTuber-boxer, Prime co-founder" },
  { civilian: "Markiplier", civilianGloss: "US let's-play gaming YouTuber", undercover: "Jacksepticeye", undercoverGloss: "let's-play gaming YouTuber (loud, funny)" },
  { civilian: "zbing z.", civilianGloss: "Thailand's #1 gaming YouTuber (female)", undercover: "Heart Rocker", undercoverGloss: "top Thai gaming YouTuber (male)" },
  { civilian: "My Mate Nate", civilianGloss: "foreigner prank/variety YouTuber in TH", undercover: "Bie The Ska", undercoverGloss: "Thai comedy/variety YouTuber (male)" },
  { civilian: "KaykaiSalaider", civilianGloss: "young Thai comedy YouTuber (female)", undercover: "Point of View", undercoverGloss: "young Thai storytelling YouTuber (female)" },
  { civilian: "Pimtha", civilianGloss: "Thai fashion/beauty influencer (female)", undercover: "Pearypie", undercoverGloss: "Thai makeup-artist influencer (female)" },

  // ---- K-pop: SAME-GROUP members ----
  { civilian: "Lisa", civilianGloss: "BLACKPINK — Thai rapper-dancer", undercover: "Rosé", undercoverGloss: "BLACKPINK — main vocalist" },
  { civilian: "Jennie", civilianGloss: "BLACKPINK — rapper/vocalist", undercover: "Jisoo", undercoverGloss: "BLACKPINK — visual/vocalist" },
  { civilian: "Lisa", civilianGloss: "BLACKPINK — Thai rapper-dancer", undercover: "Jennie", undercoverGloss: "BLACKPINK — rapper/vocalist" },
  { civilian: "Rosé", civilianGloss: "BLACKPINK — main vocalist", undercover: "Jisoo", undercoverGloss: "BLACKPINK — visual/vocalist" },
  { civilian: "Jungkook", civilianGloss: "BTS — maknae, main vocalist", undercover: "Jimin", undercoverGloss: "BTS — vocalist/dancer" },
  { civilian: "V", civilianGloss: "BTS — vocalist (Taehyung)", undercover: "Jin", undercoverGloss: "BTS — eldest, vocalist" },
  { civilian: "RM", civilianGloss: "BTS — leader, rapper", undercover: "Suga", undercoverGloss: "BTS — rapper/producer" },
  { civilian: "J-Hope", civilianGloss: "BTS — rapper/dancer", undercover: "Jimin", undercoverGloss: "BTS — vocalist/dancer" },
  { civilian: "Nayeon", civilianGloss: "TWICE — lead vocalist", undercover: "Tzuyu", undercoverGloss: "TWICE — Taiwanese visual" },
  { civilian: "Sana", civilianGloss: "TWICE — Japanese member", undercover: "Momo", undercoverGloss: "TWICE — Japanese main dancer" },
  { civilian: "Mina", civilianGloss: "TWICE — Japanese member", undercover: "Dahyun", undercoverGloss: "TWICE — rapper/vocalist" },
  { civilian: "Minji", civilianGloss: "NewJeans — leader", undercover: "Hanni", undercoverGloss: "NewJeans — Vietnamese-Australian member" },
  { civilian: "Haerin", civilianGloss: "NewJeans — vocalist (cat-like)", undercover: "Hyein", undercoverGloss: "NewJeans — youngest member" },
  { civilian: "Danielle", civilianGloss: "NewJeans — Korean-Australian member", undercover: "Hanni", undercoverGloss: "NewJeans — Vietnamese-Australian member" },
  { civilian: "Karina", civilianGloss: "aespa — leader, visual", undercover: "Winter", undercoverGloss: "aespa — main vocalist" },
  { civilian: "Giselle", civilianGloss: "aespa — rapper", undercover: "Ningning", undercoverGloss: "aespa — Chinese main vocalist" },
  { civilian: "Sakura", civilianGloss: "LE SSERAFIM — Japanese member", undercover: "Kim Chaewon", undercoverGloss: "LE SSERAFIM — leader" },
  { civilian: "Huh Yunjin", civilianGloss: "LE SSERAFIM — vocalist", undercover: "Hong Eunchae", undercoverGloss: "LE SSERAFIM — youngest" },
  { civilian: "Mingyu", civilianGloss: "SEVENTEEN — tall visual/rapper", undercover: "Wonwoo", undercoverGloss: "SEVENTEEN — deep-voiced rapper" },
  { civilian: "S.Coups", civilianGloss: "SEVENTEEN — leader", undercover: "Hoshi", undercoverGloss: "SEVENTEEN — performance leader" },
  { civilian: "Woozi", civilianGloss: "SEVENTEEN — producer", undercover: "Vernon", undercoverGloss: "SEVENTEEN — Korean-American rapper" },
  { civilian: "Bang Chan", civilianGloss: "Stray Kids — leader", undercover: "Felix", undercoverGloss: "Stray Kids — deep-voiced Aussie" },
  { civilian: "Hyunjin", civilianGloss: "Stray Kids — dancer/visual", undercover: "Lee Know", undercoverGloss: "Stray Kids — main dancer" },
  { civilian: "Han", civilianGloss: "Stray Kids — rapper/producer", undercover: "Changbin", undercoverGloss: "Stray Kids — rapper" },
  { civilian: "Heeseung", civilianGloss: "ENHYPEN — main vocalist", undercover: "Jay", undercoverGloss: "ENHYPEN — rapper" },
  { civilian: "Sunghoon", civilianGloss: "ENHYPEN — ex-figure-skater", undercover: "Jungwon", undercoverGloss: "ENHYPEN — leader" },
  { civilian: "Soobin", civilianGloss: "TXT — leader, tall", undercover: "Yeonjun", undercoverGloss: "TXT — eldest, rapper-dancer" },
  { civilian: "Beomgyu", civilianGloss: "TXT — guitarist member", undercover: "Taehyun", undercoverGloss: "TXT — vocalist" },

  // ---- T-pop / Thai idols: same group or duo ----
  { civilian: "Cherprang", civilianGloss: "BNK48 — gen-1 captain", undercover: "Music", undercoverGloss: "BNK48 — gen-1 member" },
  { civilian: "Mobile", civilianGloss: "BNK48 — gen-1 member", undercover: "Pun", undercoverGloss: "BNK48 — gen-1 member" },
  { civilian: "Billkin", civilianGloss: "half of the Billkin × PP duo (singer-actor)", undercover: "PP Krit", undercoverGloss: "half of the Billkin × PP duo (singer-actor)" },

  // ---- Movies / franchises: same universe ----
  { civilian: "Iron Man", civilianGloss: "Marvel — armored genius", undercover: "Captain America", undercoverGloss: "Marvel — shield super-soldier" },
  { civilian: "Thor", civilianGloss: "Marvel — god of thunder", undercover: "Hulk", undercoverGloss: "Marvel — green rage giant" },
  { civilian: "Spider-Man", civilianGloss: "Marvel — web-slinger", undercover: "Doctor Strange", undercoverGloss: "Marvel — sorcerer supreme" },
  { civilian: "Batman", civilianGloss: "DC — the caped crusader", undercover: "Superman", undercoverGloss: "DC — the man of steel" },
  { civilian: "Wonder Woman", civilianGloss: "DC — Amazon warrior", undercover: "Aquaman", undercoverGloss: "DC — king of Atlantis" },
  { civilian: "Joker", civilianGloss: "DC — clown prince of crime", undercover: "Harley Quinn", undercoverGloss: "DC — his chaotic partner" },
  { civilian: "Harry", civilianGloss: "Harry Potter — the boy who lived", undercover: "Ron", undercoverGloss: "Harry Potter — loyal best friend" },
  { civilian: "Hermione", civilianGloss: "Harry Potter — brilliant witch", undercover: "Ginny", undercoverGloss: "Harry Potter — Ron's sister" },
  { civilian: "Dumbledore", civilianGloss: "Harry Potter — Hogwarts headmaster", undercover: "Snape", undercoverGloss: "Harry Potter — potions master" },
  { civilian: "Voldemort", civilianGloss: "Harry Potter — the dark lord", undercover: "Bellatrix", undercoverGloss: "Harry Potter — his fiercest follower" },
  { civilian: "Elsa", civilianGloss: "Frozen — the ice queen", undercover: "Anna", undercoverGloss: "Frozen — her younger sister" },
  { civilian: "Rapunzel", civilianGloss: "Disney — long-haired princess (Tangled)", undercover: "Moana", undercoverGloss: "Disney — ocean-voyaging heroine" },
  { civilian: "Ariel", civilianGloss: "Disney — the little mermaid", undercover: "Belle", undercoverGloss: "Disney — Beauty and the Beast" },
  { civilian: "Woody", civilianGloss: "Toy Story — cowboy doll", undercover: "Buzz", undercoverGloss: "Toy Story — space-ranger toy" },

  // ---- Anime: same series ----
  { civilian: "Luffy", civilianGloss: "One Piece — straw-hat captain", undercover: "Zoro", undercoverGloss: "One Piece — three-sword swordsman" },
  { civilian: "Naruto", civilianGloss: "Naruto — orange ninja hero", undercover: "Sasuke", undercoverGloss: "Naruto — rival Uchiha" },
  { civilian: "Tanjiro", civilianGloss: "Demon Slayer — kind protagonist", undercover: "Zenitsu", undercoverGloss: "Demon Slayer — cowardly lightning user" },
  { civilian: "Eren", civilianGloss: "Attack on Titan — protagonist", undercover: "Levi", undercoverGloss: "Attack on Titan — strongest soldier" },
  { civilian: "Goku", civilianGloss: "Dragon Ball — Saiyan hero", undercover: "Vegeta", undercoverGloss: "Dragon Ball — prince rival" },
  { civilian: "Doraemon", civilianGloss: "Doraemon — robot cat", undercover: "Nobita", undercoverGloss: "Doraemon — lazy schoolboy" },
  { civilian: "Pikachu", civilianGloss: "Pokémon — electric mascot", undercover: "Eevee", undercoverGloss: "Pokémon — the evolving one" },
  { civilian: "Charizard", civilianGloss: "Pokémon — fire/flying dragon", undercover: "Blastoise", undercoverGloss: "Pokémon — water cannon turtle" },

  // ---- Thai films & series: same genre/lane ----
  { civilian: "Pee Mak", civilianGloss: "Thai ghost-wife film", undercover: "Nang Nak", undercoverGloss: "classic Thai ghost-wife film" },
  { civilian: "Bad Genius", civilianGloss: "Thai exam-cheating thriller", undercover: "The Gifted", undercoverGloss: "Thai gifted-students series" },
  { civilian: "Girl from Nowhere", civilianGloss: "Thai dark school series (Netflix)", undercover: "Hormones", undercoverGloss: "Thai teen drama series" },
  { civilian: "KinnPorsche", civilianGloss: "Thai mafia BL series", undercover: "2gether", undercoverGloss: "Thai school BL series" },

  // ---- K-content: same lane ----
  { civilian: "Squid Game", civilianGloss: "Korean deadly-games Netflix hit", undercover: "All of Us Are Dead", undercoverGloss: "Korean zombie-school Netflix hit" },
  { civilian: "Crash Landing on You", civilianGloss: "K-drama fantasy romance", undercover: "Goblin", undercoverGloss: "K-drama fantasy romance" },

  // ---- Characters / Sanrio / toys: same family ----
  { civilian: "Hello Kitty", civilianGloss: "Sanrio — iconic white cat", undercover: "My Melody", undercoverGloss: "Sanrio — bunny in a hood" },
  { civilian: "Cinnamoroll", civilianGloss: "Sanrio — flying white puppy", undercover: "Kuromi", undercoverGloss: "Sanrio — mischievous rabbit" },
  { civilian: "Pompompurin", civilianGloss: "Sanrio — pudding dog", undercover: "Pochacco", undercoverGloss: "Sanrio — sporty puppy" },
  { civilian: "Kuromi", civilianGloss: "Sanrio — punk rabbit", undercover: "My Melody", undercoverGloss: "Sanrio — sweet hooded bunny" },
  { civilian: "Mario", civilianGloss: "Nintendo — red-cap plumber", undercover: "Luigi", undercoverGloss: "Nintendo — green-cap brother" },
  { civilian: "Peach", civilianGloss: "Mario world — pink princess", undercover: "Daisy", undercoverGloss: "Mario world — orange princess" },
  { civilian: "Bowser", civilianGloss: "Mario world — turtle villain", undercover: "Wario", undercoverGloss: "Mario world — greedy rival" },
  { civilian: "Labubu", civilianGloss: "Pop Mart — toothy elf blind-box toy", undercover: "Crybaby", undercoverGloss: "Pop Mart — teary art toy (Molly)" },
  { civilian: "Labubu", civilianGloss: "Pop Mart — toothy elf blind-box toy", undercover: "Skullpanda", undercoverGloss: "Pop Mart — edgy art-toy series" },
  { civilian: "Moo Deng", civilianGloss: "viral baby pygmy hippo (Thailand)", undercover: "Moo Toon", undercoverGloss: "Moo Deng's hippo sibling" },

  // ---- Food & drink: same family ----
  { civilian: "Pad Thai", civilianGloss: "stir-fried thin rice noodles", undercover: "Pad See Ew", undercoverGloss: "soy stir-fried flat noodles" },
  { civilian: "Tom Yum", civilianGloss: "spicy-sour Thai soup", undercover: "Tom Kha", undercoverGloss: "coconut Thai soup" },
  { civilian: "Green Curry", civilianGloss: "spicy Thai green curry", undercover: "Red Curry", undercoverGloss: "Thai red curry" },
  { civilian: "Massaman", civilianGloss: "mild peanut Thai curry", undercover: "Panang", undercoverGloss: "thick, mild Thai curry" },
  { civilian: "Som Tam", civilianGloss: "spicy green-papaya salad", undercover: "Larb", undercoverGloss: "spicy Isan minced-meat salad" },
  { civilian: "Moo Ping", civilianGloss: "grilled pork skewers", undercover: "Moo Krata", undercoverGloss: "Thai BBQ-hotpot pork" },
  { civilian: "Shabu", civilianGloss: "Japanese-style hotpot", undercover: "Mookata", undercoverGloss: "Thai grill-and-hotpot combo" },
  { civilian: "Cha Yen", civilianGloss: "Thai iced milk tea (orange)", undercover: "Oliang", undercoverGloss: "Thai iced black coffee" },
  { civilian: "Pang Cha", civilianGloss: "viral Thai-tea shaved ice", undercover: "Cha Yen", undercoverGloss: "Thai iced milk tea" },
  { civilian: "Mango Sticky Rice", civilianGloss: "mango + sweet sticky rice", undercover: "Bua Loy", undercoverGloss: "rice balls in warm coconut milk" },
  { civilian: "Khao Soi", civilianGloss: "northern Thai curry noodles", undercover: "Boat Noodles", undercoverGloss: "rich Thai 'boat' noodle soup" },
  { civilian: "Durian", civilianGloss: "king of fruits (smelly)", undercover: "Mangosteen", undercoverGloss: "queen of fruits" },
  { civilian: "Boba", civilianGloss: "bubble / pearl milk tea", undercover: "Cha Yen", undercoverGloss: "Thai iced milk tea" },

  // ---- Apps / brands: same category ----
  { civilian: "Shopee", civilianGloss: "orange shopping app", undercover: "Lazada", undercoverGloss: "blue shopping app" },
  { civilian: "Grab", civilianGloss: "ride & food delivery app", undercover: "LINE MAN", undercoverGloss: "Thai food delivery app" },
  { civilian: "TikTok", civilianGloss: "short-video app", undercover: "Reels", undercoverGloss: "Instagram's short videos" },
  { civilian: "Facebook", civilianGloss: "the OG social network", undercover: "Instagram", undercoverGloss: "photo-sharing social app" },
  { civilian: "7-Eleven", civilianGloss: "everywhere convenience store", undercover: "Lotus's", undercoverGloss: "Thai supermarket chain" },
  { civilian: "iPhone", civilianGloss: "Apple's phone", undercover: "Samsung", undercoverGloss: "Android phone giant" },
  { civilian: "ChatGPT", civilianGloss: "OpenAI's AI chatbot", undercover: "Gemini", undercoverGloss: "Google's AI chatbot" },
  { civilian: "LINE", civilianGloss: "Thailand's main chat app", undercover: "WhatsApp", undercoverGloss: "global messaging app" },
  { civilian: "Netflix", civilianGloss: "red streaming giant", undercover: "Disney+", undercoverGloss: "Disney's streaming service" },
  { civilian: "Starbucks", civilianGloss: "global coffee chain", undercover: "Café Amazon", undercoverGloss: "Thai PTT coffee chain" },
  { civilian: "Coke", civilianGloss: "the classic red cola", undercover: "Pepsi", undercoverGloss: "the blue cola rival" },
  { civilian: "Tesla", civilianGloss: "American EV brand", undercover: "BYD", undercoverGloss: "Chinese EV brand (big in TH)" },

  // ---- Sports / icons / misc ----
  { civilian: "Messi", civilianGloss: "Argentine football GOAT", undercover: "Ronaldo", undercoverGloss: "Portuguese football GOAT" },
  { civilian: "Bitcoin", civilianGloss: "the #1 cryptocurrency", undercover: "Ethereum", undercoverGloss: "the #2 cryptocurrency" },
  { civilian: "Mario", civilianGloss: "Nintendo's mascot plumber", undercover: "Sonic", undercoverGloss: "SEGA's speedy blue hedgehog" },
];
