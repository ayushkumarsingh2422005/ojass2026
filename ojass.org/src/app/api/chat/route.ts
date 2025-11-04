// /app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Collection } from "mongodb";
import clientPromise from "@/lib/mongodb_chatbot";
import * as cheerio from "cheerio";
import { findBestMatch } from "string-similarity";
import { unstable_cache as cache } from "next/cache";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

// =========================================================
// CONFIG
// =========================================================
const DB_NAME = process.env.DB_NAME!;
const COLLECTION_NAME = process.env.COLLECTION_NAME!;
const BASE_URL = process.env.BASE_URL!;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

// =========================================================
// DB + LLM + SESSION Setup
// =========================================================
let dbClient: MongoClient;
let collection: Collection;

async function getDb() {
  if (!dbClient) {
    dbClient = await clientPromise;
  }
  const db = dbClient.db(DB_NAME);
  return db.collection(COLLECTION_NAME);
}

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite", // or gemini-2.5-flash
  apiKey: GEMINI_API_KEY,
});

const session = {
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; OjassBot/1.0; +https://ojass.org)",
  },
};

// =========================================================
// SCRAPER (Cached + Safe)
// =========================================================
async function get_all_links(baseUrl: string): Promise<string[]> {
  try {
    const res = await fetch(baseUrl, {
      ...session,
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const text = await res.text();
    const $ = cheerio.load(text);
    const links = new Set<string>();

    $("a[href]").each((i, el) => {
      let href = $(el).attr("href")?.trim();
      if (!href) return;

      if (href.startsWith("http") && href.includes(baseUrl)) {
        links.add(href);
      } else if (href.startsWith("/")) {
        links.add(baseUrl.replace(/\/$/, "") + href);
      }
    });
    return Array.from(links);
  } catch (e) {
    console.warn(`Error fetching links: ${e}`);
    return [];
  }
}

const cached_scrape = cache(
  async (keyword_hash: "about" | "contact" | "event") => {
    console.log(`SCRAPING (cache key: ${keyword_hash})`);
    const keyword_map = {
      about: ["about", "ojass", "fest", "home", "theme", "history"],
      contact: ["contact", "team", "organizer", "email"],
      event: ["event", "competition", "register", "participate"],
    };
    const keywords = keyword_map[keyword_hash] || keyword_map.event;
    return scrape_relevant_pages(BASE_URL, keywords);
  },
  ["ojass-scraper"],
  { revalidate: 3600 }
);

async function scrape_relevant_pages(
  baseUrl: string,
  keywords: string[]
): Promise<string> {
  const all_links = await get_all_links(baseUrl);
  let relevant_links = all_links.filter((link) =>
    keywords.some((kw) => link.toLowerCase().includes(kw))
  );

  if (relevant_links.length === 0) {
    relevant_links = [baseUrl];
  }

  let scraped_text = "";
  for (const link of relevant_links.slice(0, 3)) {
    try {
      const res = await fetch(link, { ...session, next: { revalidate: 3600 } });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const text = await res.text();
      const $ = cheerio.load(text);

      const text_blocks: string[] = [];
      $("p, li, h1, h2, h3").each((i, el) => {
        text_blocks.push($(el).text().trim());
      });

      const joined_text = text_blocks.join(" ");
      const page_snippet = joined_text.substring(0, 1200);
      if (page_snippet) {
        scraped_text += `\n\n--- ${link} ---\n${page_snippet}`;
      }
    } catch (e) {
      console.warn(`Skipping ${link}: ${e}`);
      continue;
    }
  }
  return scraped_text.trim() || "No relevant info found on website.";
}

// =========================================================
// DATABASE HELPERS
// =========================================================
function extract_keywords(query: string): string[] {
  const stop_words = new Set([
    "tell", "me", "about", "related", "the", "and", "or", "in", "for",
    "what", "is", "are", "how", "to", "of", "all", "list",
  ]);
  const words = query.toLowerCase().match(/\b[a-zA-Z]{4,}\b/g) || [];
  return words.filter((w) => !stop_words.has(w));
}

function find_best_event_match(
  query: string,
  all_events: any[],
  threshold = 0.28
) {
  const query_lower = query.toLowerCase();
  const event_strings = all_events.map((ev) => {
    const fields = [
      ev.event_name || "",
      ev.category || "",
      ev.description || "",
      (ev.tags || []).join(" "),
      ev.rules || "",
    ];
    return fields.join(" ").toLowerCase();
  });

  const valid_events = all_events.filter((ev, i) => event_strings[i].length > 5);
  const valid_strings = event_strings.filter((s) => s.length > 5);

  if (valid_strings.length === 0) return null;

  const { bestMatch, bestMatchIndex } = findBestMatch(query_lower, valid_strings);

  if (bestMatch.rating > threshold) {
    return valid_events[bestMatchIndex];
  }
  return null;
}

function format_event(ev: any): string {
  const contact = ev.contact || {};
  const rules = ev.rules || "Not specified";
  const team_size = ev.max_team_size;
  const eligibility = ev.eligibility || "Not specified";

  let duration: string | null = null;
  if (rules !== "Not specified") {
    const match = rules.match(/(\d+)\s*hour/i);
    if (match) duration = `${match[1]} hours`;
  }

  const team_text =
    team_size != null
      ? `Up to ${team_size} member${team_size !== 1 ? "s" : ""}`
      : "";

  let lines = [
    `**Name:** ${ev.event_name || "N/A"} (${ev.category || "N/A"})`,
    `**Location:** ${ev.venue || "N/A"} | **Date:** ${ev.date || "N/A"}`,
    `**Fee:** ${ev.fee || "N/A"} | **Prize:** ${ev.prize_money || "N/A"}`,
    `**Contact:** ${contact.name || "N/A"} (${contact.phone || "N/A"})`,
    `**Description:** ${ev.description || "N/A"}`,
    `**Rules:** ${rules}`,
  ];

  if (duration) lines.push(`**Duration:** ${duration}`);
  if (team_text) lines.push(`**Team:** ${team_text}`);
  if (eligibility !== "Not specified") lines.push(`**Eligibility:** ${eligibility}`);

  return lines.join("\n");
}

async function event_info_tool(query: string): Promise<string> {
  const collection = await getDb();
  const keywords = extract_keywords(query);

  const synonymMap: Record<string, string[]> = {
    contest: ["event", "competition"],
    competition: ["event", "contest"],
    contests: ["events", "competitions"],
  };
  const expanded = keywords.flatMap((k) =>
    [k, ...(synonymMap[k.toLowerCase()] ?? [])]
  );
  const uniqKeywords = Array.from(new Set(expanded));

  const regexPattern = uniqKeywords.length
    ? uniqKeywords.map((k) => `\\b${k}\\b`).join("|")
    : query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const primaryQuery = {
    $or: [
      { event_name: { $regex: regexPattern, $options: "i" } },
      { category: { $regex: regexPattern, $options: "i" } },
      ...(uniqKeywords.length ? [{ tags: { $in: uniqKeywords } }] : []),
    ],
  };

  const results = await collection
    .find(primaryQuery, { projection: { _id: 0 } })
    .toArray();

  if (results.length > 0) {
    return results.map(format_event).join("\n\n");
  }

  const all_events = await collection.find({}, { projection: { _id: 0 } }).toArray();
  const match = find_best_event_match(query, all_events, 0.28);
  if (match) return format_event(match);

  if (query.toLowerCase().match(/event|competition|contest|list|all/)) {
    if (all_events.length > 0) {
      return (
        "**Here are the first 10 events:**\n\n" +
        all_events
          .slice(0, 10)
          .map((ev: any, i: number) => `${i + 1}. ${ev.event_name} (${ev.category})`)
          .join("\n")
      );
    }
  }

  return "No matching event found in the database.";
}

async function website_info_tool(query: string): Promise<string> {
  const query_lower = query.toLowerCase();
  let cache_key: "about" | "contact" | "event" = "event";

  if (query_lower.match(/about|ojass|fest|theme|history/)) cache_key = "about";
  else if (query_lower.match(/contact|email|team|organizer/)) cache_key = "contact";

  return cached_scrape(cache_key);
}

async function hybrid_tool(query: string) {
  const [db_data, web_data] = await Promise.all([
    event_info_tool(query),
    website_info_tool(query),
  ]);
  return { db_data, web_data };
}

// =========================================================
// RESPONSE CLEANER (Removes bad markdown)
// =========================================================
function cleanResponse(text: string): string {
  return text
    .replace(/\*\*/g, "")           // Remove **bold**
    .replace(/\*/g, " ")            // Replace * with space
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`[^`]*`/g, "")        // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links → text
    .replace(/\n{3,}/g, "\n\n")     // Collapse blank lines
    .trim();
}

// =========================================================
// PROMPTS WITH STRICT FORMATTING RULES
// =========================================================
const event_prompt = PromptTemplate.fromTemplate(
  `You are given verified event data from Ojass database.
Answer using ONLY this data. NO external knowledge. NEVER USE THE WORD DATABASE.

Event Data:
{context}

Question: {input}

**FORMAT RULES:**
- Use numbered bullets: 1., 2., 3.
- Use **Bold** only for field names like **Name:**, **Date:**
- NO * or ** anywhere else
- Keep it clean and conversational

If info missing: say "Not specified in database."`
);

const website_prompt = PromptTemplate.fromTemplate(
  `You have scraped content from website pages:
{context}

Question: {input}

**FORMAT RULES:**
- Extract facts: names, emails, teams
- Quote directly: "John Doe" <john@ojass.org>
- Use numbered list: 1., 2.
- Add: Source: https://ojass.org/contact
- NO *, NO ** except for **Source:**
- If nothing found: give short common-sense reply

Answer naturally.`
);

const hybrid_prompt = PromptTemplate.fromTemplate(
  `You have two sources:

## DATABASE (Events only)
{db_context}

## WEBSITE (Teams, contacts, themes)
{web_context}

Question: {input}

**FORMAT RULES:**
- Event details → from DATABASE only
- Team/contact → from WEBSITE only, quote directly
- Use numbered bullets: 1., 2.
- Use **Bold** for labels: **Name:**, **Contact:**
- Add Source: <url> only if relevant
- NO *, NO ** except labels
- Be concise and friendly

If nothing matches: short common-sense reply.`
);

const smalltalk_prompt = PromptTemplate.fromTemplate(
  `You are a friendly Ojass chatbot.
Respond warmly and briefly.

User: {input}

**FORMAT RULES:**
- NO *, NO **
- Use numbered bullets if listing
- End with: How can I help you today?

Bot:`
);

const event_chain = event_prompt.pipe(llm);
const website_chain = website_prompt.pipe(llm);
const hybrid_chain = hybrid_prompt.pipe(llm);
const smalltalk_chain = smalltalk_prompt.pipe(llm);

// =========================================================
// ROUTER
// =========================================================
const RouteDecision = z.object({
  route: z.enum(["event", "website", "hybrid", "smalltalk"]),
});

const router_prompt = PromptTemplate.fromTemplate(
  `Decide tool:
- event → event, contest, coding, robotics
- website → about, contact, team, registration
- hybrid → mix (e.g. "register for CodeRush")
- smalltalk → hi, bye, thanks, anything unrelated to events/contests or ojass.

Query: {input}

Reply JSON: {{"route": "event"}}`
);

const router_chain = router_prompt.pipe(llm.withStructuredOutput(RouteDecision));

// =========================================================
// API HANDLER
// =========================================================
const SMALLTALK_TRIGGERS = [
  "hello", "hi", "hey", "good morning", "good evening",
  "bye", "goodbye", "see you", "tata", "take care",
  "thanks", "thank you", "awesome", "cool", "nice",
  "how are you", "what's up", "sup", "yo",
];

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string")
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });

    const user_input = message.trim();

    // AI DECIDES EVERYTHING — NO HARDCODED LOGIC
    const { route } = await router_chain.invoke({ input: user_input });
    console.log("AI Route:", route);

    let responseText = "";

    switch (route) {
      case "smalltalk":
        const res = await smalltalk_chain.invoke({ input: user_input });
        responseText = cleanResponse(res.content.toString());
        break;

      case "event":
        const event_context = await event_info_tool(user_input);
        const ev = await event_chain.invoke({ context: event_context, input: user_input });
        responseText = cleanResponse(ev.content.toString());
        break;

      case "website":
        const web_context = await website_info_tool(user_input);
        const wb = await website_chain.invoke({ context: web_context, input: user_input });
        responseText = cleanResponse(wb.content.toString());
        break;

      case "hybrid":
      default:
        const { db_data, web_data } = await hybrid_tool(user_input);
        const hy = await hybrid_chain.invoke({
          db_context: db_data,
          web_context: web_data,
          input: user_input,
        });
        responseText = cleanResponse(hy.content.toString());
        break;
    }

    return NextResponse.json({ reply: responseText });

  } catch (e: any) {
    console.error("Error:", e.message);
    return NextResponse.json(
      { error: "Sorry, something went wrong. Try again." },
      { status: 500 }
    );
  }
}