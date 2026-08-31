import http from "node:http";
import https from "node:https";

export type LlmConfig = {
  apiKey: string;
  baseUrl: string;
  models: string[];
};

export function getLlmConfig(): LlmConfig | null {
  const apiKey = process.env.AI_API_KEY ?? process.env.OPENAI_API_KEY ?? "";
  if (!apiKey) return null;
  const raw = process.env.AI_MODELS ?? process.env.AI_MODEL ?? "gpt-4o-mini";
  const models = raw
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  return {
    apiKey,
    baseUrl: (process.env.AI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, ""),
    models: models.length > 0 ? models : ["gpt-4o-mini"],
  };
}

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

async function requestModel(
  config: LlmConfig,
  model: string,
  messages: ChatMessage[],
): Promise<http.IncomingMessage> {
  const url = new URL(`${config.baseUrl}/chat/completions`);
  const mod = url.protocol === "https:" ? https : http;
  const payload = JSON.stringify({
    model,
    messages,
    stream: true,
    temperature: 0.3,
    max_tokens: 1000,
  });

  return new Promise<http.IncomingMessage>((resolve, reject) => {
    const req = mod.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      resolve,
    );
    req.on("error", reject);
    req.end(payload);
  });
}

export async function streamChatCompletion(
  config: LlmConfig,
  messages: ChatMessage[],
): Promise<ReadableStream<string>> {
  let lastError: Error | null = null;

  for (const model of config.models) {
    let res: http.IncomingMessage;
    try {
      res = await requestModel(config, model, messages);
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      continue;
    }

    const status = res.statusCode ?? 0;
    if (status < 200 || status >= 300) {
      const chunks: Buffer[] = [];
      for await (const c of res) chunks.push(c as Buffer);
      const detail = Buffer.concat(chunks).toString("utf8");
      lastError = new Error(`LLM request failed (${status}): ${detail.slice(0, 200)}`);
      continue;
    }
    return buildSseStream(res);
  }

  throw lastError ?? new Error("No LLM models configured.");
}

function buildSseStream(res: http.IncomingMessage): ReadableStream<string> {
  let buffer = "";

  const parseSseLine = (
    line: string,
    enqueue: (text: string) => void,
  ): boolean => {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) return false;
    const data = trimmed.slice(5).trim();
    if (data === "[DONE]") return true;
    try {
      const json = JSON.parse(data) as {
        choices?: { delta?: { content?: string } }[];
      };
      const delta = json.choices?.[0]?.delta?.content;
      if (delta) enqueue(delta);
    } catch {
      /* ignore malformed SSE lines */
    }
    return false;
  };

  return new ReadableStream<string>({
    start(controller) {
      let closed = false;
      const finish = () => {
        if (closed) return;
        closed = true;
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };
      res.setEncoding("utf8");
      res.on("data", (chunk: string) => {
        if (closed) return;
        buffer += chunk;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (parseSseLine(line, (t) => controller.enqueue(t))) {
            res.destroy();
            finish();
            return;
          }
        }
      });
      res.on("end", finish);
      res.on("error", finish);
    },
    cancel() {
      res.destroy();
    },
  });
}
