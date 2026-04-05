import { NextResponse } from "next/server";

const TRELLO_API_KEY = process.env.TRELLO_API_KEY!;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN!;
const TRELLO_BOARD_ID = process.env.TRELLO_BOARD_ID!;
const TRELLO_COMPLETED_LABEL_ID = process.env.TRELLO_COMPLETED_LABEL_ID!;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;

const BASE_COUNT = 24;
// Snapshot of completed deliverables at the time the counter was set to 24
// Any new completions beyond this baseline will increment the counter
const BASELINE_COMPLETED = 24;

interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  labels: { id: string; name: string }[];
}

// In-memory cache
let cachedResult: { count: number; timestamp: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function classifyCards(cards: TrelloCard[]): Promise<number> {
  if (cards.length === 0) return 0;

  const cardList = cards
    .map((c, i) => `${i + 1}. "${c.name}"${c.desc ? ` — ${c.desc.slice(0, 100)}` : ""}`)
    .join("\n");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: `You are classifying Trello cards from a Business Consulting board. A "deliverable" is a completed client project or engagement (e.g., a client name, project name, or organization). It is NOT an internal task, meeting, or administrative item. Respond ONLY with a JSON array of booleans, one per card, where true means it IS a deliverable. Example: [true, true, false, true]`,
        },
        {
          role: "user",
          content: `Classify each card as a deliverable (true) or not (false):\n\n${cardList}`,
        },
      ],
      temperature: 0,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    console.error("OpenRouter API error:", response.status, await response.text());
    // Fallback: count all completed cards as deliverables
    return cards.length;
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim() || "[]";

  try {
    // Extract JSON array from response
    const match = content.match(/\[[\s\S]*?\]/);
    if (!match) return cards.length;

    const classifications: boolean[] = JSON.parse(match[0]);
    return classifications.filter(Boolean).length;
  } catch {
    console.error("Failed to parse AI classification:", content);
    return cards.length;
  }
}

export async function GET() {
  try {
    // Check cache
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
      return NextResponse.json({
        count: cachedResult.count,
        cached: true,
      });
    }

    // Fetch all cards from the board
    const trelloUrl = `https://api.trello.com/1/boards/${TRELLO_BOARD_ID}/cards?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}&fields=name,desc,labels&limit=1000`;

    const trelloResponse = await fetch(trelloUrl, { cache: "no-store" });

    if (!trelloResponse.ok) {
      throw new Error(`Trello API error: ${trelloResponse.status}`);
    }

    const allCards: TrelloCard[] = await trelloResponse.json();

    // Filter for cards with the "Completed" label
    const completedCards = allCards.filter((card) =>
      card.labels.some((label) => label.id === TRELLO_COMPLETED_LABEL_ID)
    );

    // Use AI to classify which completed cards are actual deliverables
    const deliverableCount = await classifyCards(completedCards);

    // Start from 6, add only NEW deliverables beyond the baseline
    const newDeliverables = Math.max(0, deliverableCount - BASELINE_COMPLETED);
    const totalCount = BASE_COUNT + newDeliverables;

    // Update cache
    cachedResult = { count: totalCount, timestamp: Date.now() };

    return NextResponse.json({
      count: totalCount,
      cached: false,
    });
  } catch (error) {
    console.error("Deliverables API error:", error);

    // Return cached result if available, otherwise fallback
    if (cachedResult) {
      return NextResponse.json({
        count: cachedResult.count,
        cached: true,
        stale: true,
      });
    }

    return NextResponse.json(
      { count: BASE_COUNT, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
