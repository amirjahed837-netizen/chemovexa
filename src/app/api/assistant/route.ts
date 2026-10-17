import { NextResponse } from "next/server";
import { buildCorpus } from "@/lib/ai/corpus";
import { BM25Index } from "@/lib/ai/retrieval";
import { getLlmConfig, streamChatCompletion } from "@/lib/ai/llm";
import { answerFromEngines } from "@/lib/ai/deterministic";
import type { ChatMessage } from "@/lib/ai/llm";

let indexPromise: Promise<BM25Index> | null = null;

function getIndex(): Promise<BM25Index> {
  indexPromise ??= buildCorpus()
    .then((chunks) => new BM25Index(chunks))
    .catch((e) => {
      indexPromise = null;
      throw e;
    });
  return indexPromise;
}

const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 10;

const rateBuckets = new Map<string, { count: number; reset: number }>();

function rateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now >= bucket.reset) {
    if (rateBuckets.size > 1000) {
      for (const [k, v] of rateBuckets) {
        if (now >= v.reset) rateBuckets.delete(k);
      }
    }
    rateBuckets.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  bucket.count += 1;
  if (bucket.count > RATE_MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((bucket.reset - now) / 1000) };
  }
  return { allowed: true, retryAfter: 0 };
}

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function GET() {
  let index: BM25Index;
  try {
    index = await getIndex();
  } catch {
    return NextResponse.json({ error: "Knowledge base unavailable." }, { status: 503 });
  }
  return NextResponse.json({
    chunks: index.size,
    llm: getLlmConfig()?.models.join(" → ") ?? null,
  });
}

const SYSTEM_PROMPT = `You are the AI Chemistry Assistant for a chemistry student's portfolio site. You answer questions about chemistry and about this site's tools (Chemistry Calculator, 3D Molecular Explorer, Reaction Lab) and content (research notes, literature).

Rules:
- Ground every substantive claim in the numbered CONTEXT passages and cite them inline like [1], [2].
- If the context is insufficient, say so honestly and answer only from safe, general chemistry knowledge, clearly marking that part.
- You may mention which site tool could help, with its path.
- Be concise and correct. Use plain text with Unicode subscripts/superscripts and reactions like 2H2 + O2 -> 2H2O. No markdown headers.
- LANGUAGE: Reply in the same language the user's question is written in. If the question is in Persian (Farsi), answer fully in Persian — write chemical formulas, symbols and units in standard Latin notation (H2SO4, g/mol, pH) inside otherwise Persian prose.`;

const MAX_HISTORY = 6;

export async function POST(request: Request) {
  let body: { message?: string; history?: { role: string; content: string }[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }
  if (message.length > 1000) {
    return NextResponse.json({ error: "Message too long (max 1000 chars)." }, { status: 400 });
  }

  const history = (body.history ?? [])
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role as "user" | "assistant", content: String(m.content).slice(0, 2000) }));

  const limit = rateLimit(clientIp(request));
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let index: BM25Index;
  try {
    index = await getIndex();
  } catch {
    return NextResponse.json({ error: "Knowledge base unavailable." }, { status: 503 });
  }
  const hits = index.search(message, 5);

  const sources = hits.map((h, i) => ({
    n: i + 1,
    title: h.title,
    url: h.url,
    kind: h.kind,
    snippet: h.text.length > 180 ? `${h.text.slice(0, 180)}…` : h.text,
  }));

  const engineAnswer = answerFromEngines(message);
  if (engineAnswer) {
    return NextResponse.json({
      mode: "engine",
      answer: engineAnswer.text,
      sources: [
        {
          n: 1,
          title: engineAnswer.tool.title,
          url: engineAnswer.tool.url,
          kind: "tool",
          snippet: "Computed live by this site's own chemistry engines.",
        },
      ],
      sourcesNote: "deterministic engine answer (no LLM involved)",
    });
  }

  const config = getLlmConfig();
  const contextBlock = hits
    .map((h, i) => `[${i + 1}] (${h.title} — ${h.url})\n${h.text}`)
    .join("\n\n");

  if (!config) {
    const extracts = hits.slice(0, 3).map((h) => `${h.text}`);
    return NextResponse.json({
      mode: "retrieval",
      sources,
      answer:
        extracts.length > 0
          ? `No language-model key is configured, so here is what the site's knowledge base retrieved for your question:\n\n${extracts
              .map((t, i) => `[${i + 1}] ${t}`)
              .join("\n\n")}`
          : "No language-model key is configured and nothing in the knowledge base matched that question. Try asking about VSEPR geometry, titration curves, thermodynamics, or how the site's tools work.",
      sourcesNote: "Retrieval-only mode (BM25 over the site corpus).",
    });
  }

  const userContent = `CONTEXT PASSAGES:\n${contextBlock}\n\nQUESTION (may be in English or Persian — reply in the question's language): ${message}`;

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: userContent },
  ];

  try {
    const stream = await streamChatCompletion(config, messages);
    const encoder = new TextEncoder();
    const sse = new ReadableStream<Uint8Array>({
      async start(controller) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ meta: { mode: "llm", sources } })}\n\n`,
          ),
        );
        const reader = stream.getReader();
        try {
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ delta: value })}\n\n`),
            );
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (e) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ delta: `\n\n[generation error: ${e instanceof Error ? e.message : "unknown"}]` })}\n\n`,
            ),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(sse, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    console.error("[assistant] LLM call failed:", e);
    return NextResponse.json({
      mode: "retrieval",
      sources,
      answer: `The language-model call failed. Falling back to retrieval:\n\n${hits
        .slice(0, 3)
        .map((h, i) => `[${i + 1}] ${h.text}`)
        .join("\n\n")}`,
    });
  }
}
