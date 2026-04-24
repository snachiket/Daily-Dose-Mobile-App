import type { Category, ContentLibraryFile, DailyEntry } from '@/models/types';
import libraryJson from '../../assets/content.json';

const library = libraryJson as unknown as ContentLibraryFile;

export const categories: Category[] = library.categories;

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % 1000;
}

function dayIndex(date: Date): number {
  const start = Date.UTC(1970, 0, 1);
  const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((today - start) / 86_400_000);
}

export function entryFor(category: Category, date: Date): DailyEntry | undefined {
  if (category.entries.length === 0) return undefined;
  const index = (dayIndex(date) + hashSeed(category.id)) % category.entries.length;
  return category.entries[index];
}
