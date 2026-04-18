import { NextResponse } from "next/server";

const TRELLO_API_KEY = process.env.TRELLO_API_KEY!;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN!;
const TRELLO_BOARD_ID = process.env.TRELLO_BOARD_ID!;

const BASE_COUNT = 55;

const AUTOMATION_LABEL = "automation";
const DONE_LIST_NAME = "done";

interface TrelloCard {
  id: string;
  name: string;
  idList: string;
  labels: { id: string; name: string }[];
}

interface TrelloList {
  id: string;
  name: string;
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

    const authParams = `key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;

    // Fetch lists and cards in parallel
    const [listsResponse, cardsResponse] = await Promise.all([
      fetch(
        `https://api.trello.com/1/boards/${TRELLO_BOARD_ID}/lists?${authParams}&fields=name`,
        { cache: "no-store" }
      ),
      fetch(
        `https://api.trello.com/1/boards/${TRELLO_BOARD_ID}/cards?${authParams}&fields=name,labels,idList&limit=1000`,
        { cache: "no-store" }
      ),
    ]);

    if (!listsResponse.ok || !cardsResponse.ok) {
      throw new Error(
        `Trello API error: lists=${listsResponse.status} cards=${cardsResponse.status}`
      );
    }

    const allLists: TrelloList[] = await listsResponse.json();
    const allCards: TrelloCard[] = await cardsResponse.json();

    // Find the Done list (case-insensitive)
    const doneList = allLists.find(
      (list) => list.name.toLowerCase() === DONE_LIST_NAME
    );

    if (!doneList) {
      throw new Error(
        `No "${DONE_LIST_NAME}" list found. Available: ${allLists.map((l) => l.name).join(", ")}`
      );
    }

    // Count cards in Done list with the "automation" label
    const automationDoneCards = allCards.filter(
      (card) =>
        card.idList === doneList.id &&
        card.labels.some(
          (label) => label.name.toLowerCase() === AUTOMATION_LABEL
        )
    );

    const totalCount = BASE_COUNT + automationDoneCards.length;

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
