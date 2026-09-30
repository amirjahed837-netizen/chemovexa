/**
 * Task B: UI strings for saved mechanisms (EN/FA).
 * Kept in a separate module on purpose, so adding them did not require
 * rewriting en.ts / fa.ts. Interface text only: no chemical content.
 * Placeholders are filled with fmt() from useI18n().
 */

export type BookmarkStrings = {
  save: string;
  saved: string;
  saveAria: string;
  unsaveAria: string;
  tab: string;
  tabAria: string;
  toastSaved: string;
  toastRemoved: string;
  viewSaved: string;
  sectionTitle: string;
  storedLocally: string;
  emptyTitle: string;
  emptyHint: string;
  showAll: string;
};

export const BOOKMARK_STRINGS: Record<"en" | "fa", BookmarkStrings> = {
  en: {
    save: "Save",
    saved: "Saved",
    saveAria: "Save {title}",
    unsaveAria: "Remove {title} from saved",
    tab: "Saved",
    tabAria: "Show saved mechanisms ({count})",
    toastSaved: "Saved. {count} in your list.",
    toastRemoved: "Removed from saved. {count} left.",
    viewSaved: "View saved",
    sectionTitle: "Your saved mechanisms",
    storedLocally: "Stored only in this browser.",
    emptyTitle: "Nothing saved yet",
    emptyHint: "Tap “Save” on any mechanism card and it will appear here.",
    showAll: "Show all mechanisms",
  },
  fa: {
    save: "ذخیره",
    saved: "ذخیره‌شده",
    saveAria: "ذخیرهٔ {title}",
    unsaveAria: "برداشتن {title} از ذخیره‌شده‌ها",
    tab: "ذخیره‌شده‌ها",
    tabAria: "نمایش مکانیزم‌های ذخیره‌شده ({count})",
    toastSaved: "ذخیره شد. {count} مورد در فهرست شما.",
    toastRemoved: "از ذخیره‌شده‌ها برداشته شد. {count} مورد مانده.",
    viewSaved: "دیدن ذخیره‌شده‌ها",
    sectionTitle: "مکانیزم‌های ذخیره‌شدهٔ شما",
    storedLocally: "فقط در همین مرورگر نگه داشته می‌شود.",
    emptyTitle: "هنوز چیزی ذخیره نکرده‌اید",
    emptyHint: "روی «ذخیره» در هر کارت مکانیزم بزنید تا اینجا نمایش داده شود.",
    showAll: "نمایش همهٔ مکانیزم‌ها",
  },
};
