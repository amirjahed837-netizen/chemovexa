"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Task B: saved (bookmarked) mechanisms, persisted per browser in localStorage.
 *
 * - The server snapshot is always empty, so SSR markup never depends on storage
 *   and hydration cannot mismatch. The stored list is read after hydration.
 * - Same-tab updates notify subscribers directly; other tabs sync through the
 *   `storage` event.
 * - If storage is unavailable (private mode, quota, disabled) the list keeps
 *   working in memory for the current page session.
 * - Ids that no longer exist are ignored by the hook but never deleted from
 *   storage, so renaming data can never silently erase a user's list.
 */

export const BOOKMARKS_STORAGE_KEY = "chemovexa:saved:v1";

const EMPTY: readonly string[] = Object.freeze([]);
let cache: readonly string[] | null = null;
let memory: readonly string[] = EMPTY;
const listeners = new Set<() => void>();

export function parseBookmarks(raw: string | null): readonly string[] {
  if (!raw) return EMPTY;
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return EMPTY;
    const out: string[] = [];
    for (const item of value) {
      if (typeof item === "string" && item.length > 0 && !out.includes(item)) out.push(item);
    }
    return out.length ? Object.freeze(out) : EMPTY;
  } catch {
    return EMPTY;
  }
}

/** Pure toggle: returns the next list and whether `id` is saved afterwards. */
export function toggleBookmark(list: readonly string[], id: string): { next: readonly string[]; saved: boolean } {
  if (list.includes(id)) return { next: list.filter((x) => x !== id), saved: false };
  return { next: [...list, id], saved: true };
}

function readSnapshot(): readonly string[] {
  if (cache) return cache;
  try {
    cache = parseBookmarks(window.localStorage.getItem(BOOKMARKS_STORAGE_KEY));
  } catch {
    cache = memory;
  }
  return cache;
}

function readServerSnapshot(): readonly string[] {
  return EMPTY;
}

function writeSnapshot(next: readonly string[]) {
  const frozen = next.length ? Object.freeze([...next]) : EMPTY;
  cache = frozen;
  memory = frozen;
  try {
    window.localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(frozen));
  } catch {
    /* storage unavailable: keep the in-memory list */
  }
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== null && e.key !== BOOKMARKS_STORAGE_KEY) return;
    cache = null;
    onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function useBookmarks(validIds?: ReadonlySet<string>) {
  const stored = useSyncExternalStore(subscribe, readSnapshot, readServerSnapshot);
  const ids = useMemo(
    () => (validIds ? stored.filter((id) => validIds.has(id)) : stored),
    [stored, validIds],
  );
  const savedSet = useMemo(() => new Set(ids), [ids]);
  const isSaved = useCallback((id: string) => savedSet.has(id), [savedSet]);
  /** Toggles `id` and returns true if it is saved afterwards. */
  const toggle = useCallback((id: string): boolean => {
    const { next, saved } = toggleBookmark(readSnapshot(), id);
    writeSnapshot(next);
    return saved;
  }, []);
  return { ids, savedSet, count: ids.length, isSaved, toggle };
}
