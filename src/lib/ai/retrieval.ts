import type { Chunk } from "./corpus";

const STOPWORDS = new Set(
  "a an and are as at be by for from has have in is it its of on or that the this to was were will with".split(
    " ",
  ),
);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

type IndexedChunk = Chunk & {
  tf: Map<string, number>;
  len: number;
};

export type RetrievalHit = Chunk & { score: number };

export class BM25Index {
  private docs: IndexedChunk[] = [];
  private df = new Map<string, number>();
  private avgLen = 0;

  private readonly k1 = 1.5;
  private readonly b = 0.75;

  constructor(chunks: Chunk[]) {
    for (const chunk of chunks) {
      const tokens = tokenize(`${chunk.title} ${chunk.text}`);
      const tf = new Map<string, number>();
      for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
      for (const t of tf.keys()) this.df.set(t, (this.df.get(t) ?? 0) + 1);
      this.docs.push({ ...chunk, tf, len: tokens.length });
    }
    this.avgLen =
      this.docs.reduce((acc, d) => acc + d.len, 0) / Math.max(this.docs.length, 1);
  }

  get size(): number {
    return this.docs.length;
  }

  search(query: string, topK = 5): RetrievalHit[] {
    const qTokens = tokenize(query);
    if (qTokens.length === 0 || this.docs.length === 0) return [];

    const N = this.docs.length;
    const scores = new Map<number, number>();

    for (const q of new Set(qTokens)) {
      const df = this.df.get(q) ?? 0;
      if (df === 0) continue;
      const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
      for (let i = 0; i < this.docs.length; i++) {
        const d = this.docs[i];
        const tf = d.tf.get(q);
        if (!tf) continue;
        const norm = this.k1 * (1 - this.b + (this.b * d.len) / this.avgLen);
        const s = idf * ((tf * (this.k1 + 1)) / (tf + norm));
        scores.set(i, (scores.get(i) ?? 0) + s);
      }
    }

    return [...scores.entries()]
      .sort((a, b2) => b2[1] - a[1])
      .slice(0, topK)
      .map(([i, score]) => ({ ...this.docs[i], score }));
  }
}
