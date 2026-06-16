import type { WordPair } from "./types";
import type { CategoryKey } from "./categories";

type Pair = Omit<WordPair, "category">;

// Word pairs grouped by category. English (Latin script), chosen to be viral /
// well-known on Thai social media. Pairs are intentionally HARD: two things from
// the same family/category, so clues are highly ambiguous. The gloss is a short
// private hint for whoever holds that word. The app picks one pair per game at
// random (from the categories in play) and randomly swaps which side is the
// Civilians' word.
const BY_CATEGORY: Record<CategoryKey, Pair[]> = {
  // ---- Thai influencers (TikTokers / YouTubers), matched by niche ----
  influencer: [
    { civilian: "zbing z.", civilianGloss: "Thailand's #1 gaming YouTuber (female)", undercover: "Heart Rocker", undercoverGloss: "top Thai gaming YouTuber (male)" },
    { civilian: "KaykaiSalaider", civilianGloss: "young Thai comedy YouTuber (female)", undercover: "Point of View", undercoverGloss: "young Thai storytelling YouTuber (female)" },
    { civilian: "My Mate Nate", civilianGloss: "foreigner prank/variety YouTuber in TH", undercover: "Bie The Ska", undercoverGloss: "Thai comedy/variety YouTuber (male)" },
    { civilian: "Pimtha", civilianGloss: "Thai fashion/beauty influencer (female)", undercover: "Pearypie", undercoverGloss: "Thai makeup-artist influencer (female)" },
  ],

  // ---- Movies / franchises: same universe ----
  movie: [
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
  ],

  // ---- Anime: same series ----
  anime: [
    { civilian: "Luffy", civilianGloss: "One Piece — straw-hat captain", undercover: "Zoro", undercoverGloss: "One Piece — three-sword swordsman" },
    { civilian: "Naruto", civilianGloss: "Naruto — orange ninja hero", undercover: "Sasuke", undercoverGloss: "Naruto — rival Uchiha" },
    { civilian: "Tanjiro", civilianGloss: "Demon Slayer — kind protagonist", undercover: "Zenitsu", undercoverGloss: "Demon Slayer — cowardly lightning user" },
    { civilian: "Eren", civilianGloss: "Attack on Titan — protagonist", undercover: "Levi", undercoverGloss: "Attack on Titan — strongest soldier" },
    { civilian: "Goku", civilianGloss: "Dragon Ball — Saiyan hero", undercover: "Vegeta", undercoverGloss: "Dragon Ball — prince rival" },
    { civilian: "Doraemon", civilianGloss: "Doraemon — robot cat", undercover: "Nobita", undercoverGloss: "Doraemon — lazy schoolboy" },
    { civilian: "Pikachu", civilianGloss: "Pokémon — electric mascot", undercover: "Eevee", undercoverGloss: "Pokémon — the evolving one" },
    { civilian: "Charizard", civilianGloss: "Pokémon — fire/flying dragon", undercover: "Blastoise", undercoverGloss: "Pokémon — water cannon turtle" },
  ],

  // ---- Thai films & K-content ----
  series: [
    { civilian: "Pee Mak", civilianGloss: "Thai ghost-wife film", undercover: "Nang Nak", undercoverGloss: "classic Thai ghost-wife film" },
    { civilian: "Bad Genius", civilianGloss: "Thai exam-cheating thriller", undercover: "The Gifted", undercoverGloss: "Thai gifted-students series" },
    { civilian: "Girl from Nowhere", civilianGloss: "Thai dark school series (Netflix)", undercover: "Hormones", undercoverGloss: "Thai teen drama series" },
    { civilian: "KinnPorsche", civilianGloss: "Thai mafia BL series", undercover: "2gether", undercoverGloss: "Thai school BL series" },
    { civilian: "Squid Game", civilianGloss: "Korean deadly-games Netflix hit", undercover: "All of Us Are Dead", undercoverGloss: "Korean zombie-school Netflix hit" },
    { civilian: "Crash Landing on You", civilianGloss: "K-drama fantasy romance", undercover: "Goblin", undercoverGloss: "K-drama fantasy romance" },
  ],

  // ---- Characters / Sanrio / toys: same family ----
  character: [
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
  ],

  // ---- Food & drink: same family ----
  food: [
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
  ],

  // ---- Apps / platforms ----
  app: [
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
  ],

  // ---- Brands ----
  brand: [
    { civilian: "Nike", civilianGloss: "sportswear — the swoosh", undercover: "Adidas", undercoverGloss: "sportswear — three stripes" },
    { civilian: "Gucci", civilianGloss: "Italian luxury fashion house", undercover: "Prada", undercoverGloss: "Italian luxury fashion house" },
    { civilian: "Louis Vuitton", civilianGloss: "luxury bags & fashion (LV)", undercover: "Chanel", undercoverGloss: "luxury fashion & perfume" },
    { civilian: "McDonald's", civilianGloss: "fast food — golden arches", undercover: "KFC", undercoverGloss: "fast food — fried chicken" },
    { civilian: "Pizza Hut", civilianGloss: "pizza chain (red roof)", undercover: "Domino's", undercoverGloss: "pizza delivery chain" },
    { civilian: "Uniqlo", civilianGloss: "Japanese basics fast-fashion", undercover: "H&M", undercoverGloss: "Swedish fast-fashion chain" },
    { civilian: "Rolex", civilianGloss: "luxury Swiss watch (crown)", undercover: "Omega", undercoverGloss: "luxury Swiss watch" },
    { civilian: "Visa", civilianGloss: "payment card network", undercover: "Mastercard", undercoverGloss: "payment card network" },
    { civilian: "Coke", civilianGloss: "the classic red cola", undercover: "Pepsi", undercoverGloss: "the blue cola rival" },
    { civilian: "Lay's", civilianGloss: "potato chips in a bag", undercover: "Pringles", undercoverGloss: "stacked chips in a tube" },
  ],

  // ---- Cars / vehicles ----
  car: [
    { civilian: "Toyota", civilianGloss: "Japanese car giant", undercover: "Honda", undercoverGloss: "Japanese car giant" },
    { civilian: "BMW", civilianGloss: "German luxury car", undercover: "Mercedes-Benz", undercoverGloss: "German luxury car" },
    { civilian: "Ferrari", civilianGloss: "Italian supercar (prancing horse)", undercover: "Lamborghini", undercoverGloss: "Italian supercar (raging bull)" },
    { civilian: "Honda", civilianGloss: "motorbike brand", undercover: "Yamaha", undercoverGloss: "motorbike brand" },
    { civilian: "Toyota Vios", civilianGloss: "popular Thai eco-sedan", undercover: "Honda City", undercoverGloss: "popular Thai eco-sedan" },
    { civilian: "Tesla", civilianGloss: "American EV brand", undercover: "BYD", undercoverGloss: "Chinese EV brand (big in TH)" },
    { civilian: "Mazda", civilianGloss: "Japanese car brand (in TH)", undercover: "Mitsubishi", undercoverGloss: "Japanese car brand (in TH)" },
    { civilian: "Isuzu D-Max", civilianGloss: "Thai pickup-truck king", undercover: "Toyota Hilux", undercoverGloss: "Thai pickup-truck king" },
  ],

  // ---- Math operators / concepts (high-school -> university) ----
  math: [
    { civilian: "Plus", civilianGloss: "addition ( + )", undercover: "Minus", undercoverGloss: "subtraction ( − )" },
    { civilian: "Multiply", civilianGloss: "multiplication ( × )", undercover: "Divide", undercoverGloss: "division ( ÷ )" },
    { civilian: "Sine", civilianGloss: "trig ratio: sin", undercover: "Cosine", undercoverGloss: "trig ratio: cos" },
    { civilian: "Tangent", civilianGloss: "trig ratio: tan", undercover: "Cotangent", undercoverGloss: "trig ratio: cot" },
    { civilian: "Square", civilianGloss: "raise to power 2 ( x² )", undercover: "Square Root", undercoverGloss: "the inverse ( √x )" },
    { civilian: "Logarithm", civilianGloss: "log of a number", undercover: "Exponential", undercoverGloss: "e to the power x ( eˣ )" },
    { civilian: "Greater Than", civilianGloss: "the symbol ( > )", undercover: "Less Than", undercoverGloss: "the symbol ( < )" },
    { civilian: "Factorial", civilianGloss: "n! = n×(n−1)×…", undercover: "Power", undercoverGloss: "exponent ( xⁿ )" },
    { civilian: "Pi", civilianGloss: "π ≈ 3.14159", undercover: "Euler's Number", undercoverGloss: "e ≈ 2.71828" },
    { civilian: "Derivative", civilianGloss: "rate of change ( d/dx )", undercover: "Integral", undercoverGloss: "area under the curve ( ∫ )" },
    { civilian: "Summation", civilianGloss: "add a series ( Σ )", undercover: "Product", undercoverGloss: "multiply a series ( Π )" },
    { civilian: "Limit", civilianGloss: "value approached ( lim )", undercover: "Infinity", undercoverGloss: "unbounded ( ∞ )" },
    { civilian: "Matrix", civilianGloss: "grid of numbers", undercover: "Vector", undercoverGloss: "quantity with direction" },
    { civilian: "Dot Product", civilianGloss: "a·b → a scalar", undercover: "Cross Product", undercoverGloss: "a×b → a vector" },
    { civilian: "Permutation", civilianGloss: "nPr — order matters", undercover: "Combination", undercoverGloss: "nCr — order doesn't" },
  ],

  // ---- Sports / icons / misc ----
  misc: [
    { civilian: "Messi", civilianGloss: "Argentine football GOAT", undercover: "Ronaldo", undercoverGloss: "Portuguese football GOAT" },
    { civilian: "Bitcoin", civilianGloss: "the #1 cryptocurrency", undercover: "Ethereum", undercoverGloss: "the #2 cryptocurrency" },
    { civilian: "Mario", civilianGloss: "Nintendo's mascot plumber", undercover: "Sonic", undercoverGloss: "SEGA's speedy blue hedgehog" },
  ],
};

export const WORD_PAIRS: WordPair[] = (Object.keys(BY_CATEGORY) as CategoryKey[]).flatMap((cat) =>
  BY_CATEGORY[cat].map((p) => ({ ...p, category: cat }))
);
