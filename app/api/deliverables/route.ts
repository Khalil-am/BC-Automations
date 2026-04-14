import { NextResponse } from "next/server";

const TRELLO_API_KEY = process.env.TRELLO_API_KEY!;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN!;
const TRELLO_BOARD_ID = process.env.TRELLO_BOARD_ID!;

const BASE_COUNT = 55;

const AUTOMATION_LABEL = "automation";

interface TrelloCard {
  id: string;
  name: string;
  labels: { id: string; name: string }[];
}

// In-memory cache
let cachedResult: { count: number; timestamp: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

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
    const trelloUrl = `https://api.trello.com/1/boards/${TRELLO_BOARD_ID}/cards?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}&fields=name,labels&limit=1000`;

    const trelloResponse = await fetch(trelloUrl, { cache: "no-store" });

    if (!trelloResponse.ok) {
      throw new Error(`Trello API error: ${trelloResponse.status}`);
    }

    const allCards: TrelloCard[] = await trelloResponse.json();

    // Count cards with the "automation" label
    const automationCards = allCards.filter((card) =>
      card.labels.some(
        (label) => label.name.toLowerCase() === AUTOMATION_LABEL
      )
    );

    const totalCount = BASE_COUNT + automationCards.length;

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
