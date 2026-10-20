import { buildCorpus } from "./corpus";
import { BM25Index } from "./retrieval";

/**
 * Shared self-healing BM25 index over the site corpus. Used by the assistant
 * route and the /api/search endpoint. A failed corpus build resets the cache
 * so the next request retries instead of serving a poisoned promise forever.
 */
let indexPromise: Promise<BM25Index> | null = null;

export function getSearchIndex(): Promise<BM25Index> {
  indexPromise ??= buildCorpus()
    .then((chunks) => new BM25Index(chunks))
    .catch((e) => {
      indexPromise = null;
      throw e;
    });
  return indexPromise;
}
