import { NextResponse } from "next/server";
import { getSearchIndex } from "@/lib/ai/search-index";

export async function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get("q") ?? "").trim();
  if (q.length < 2 || q.length > 100) {
    return NextResponse.json({ results: [] });
  }

  try {
    const index = await getSearchIndex();
    const hits = index.search(q, 8);
    return NextResponse.json({
      results: hits.map((h) => ({
        title: h.title,
        url: h.url,
        kind: h.kind,
        snippet: h.text.length > 160 ? `${h.text.slice(0, 160)}…` : h.text,
      })),
    });
  } catch (e) {
    console.error("[search] index failed:", e);
    return NextResponse.json({ error: "Search unavailable." }, { status: 503 });
  }
}
