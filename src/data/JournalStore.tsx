import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { JournalEntry } from '@/models/types';
import { dateKey as computeDateKey } from '@/data/content';

const STORAGE_KEY = 'DailyDose.journal.v1';

type JournalMap = Record<string, JournalEntry>;

function entryKey(categoryId: string, dateKey: string) {
  return `${categoryId}|${dateKey}`;
}

type JournalContextValue = {
  ready: boolean;
  getText: (categoryId: string, date: Date) => string;
  setText: (categoryId: string, date: Date, text: string) => void;
  entriesByDate: (categoryId?: string) => { dateKey: string; items: JournalEntry[] }[];
};

const JournalContext = createContext<JournalContextValue | null>(null);

export function JournalProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [entries, setEntries] = useState<JournalMap>({});
  const loaded = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setEntries(JSON.parse(raw) as JournalMap);
      } catch {
        // ignore; start empty
      } finally {
        loaded.current = true;
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries)).catch(() => {});
  }, [entries]);

  const getText = useCallback(
    (categoryId: string, date: Date) => entries[entryKey(categoryId, computeDateKey(date))]?.text ?? '',
    [entries]
  );

  const setText = useCallback((categoryId: string, date: Date, text: string) => {
    const dk = computeDateKey(date);
    const k = entryKey(categoryId, dk);
    setEntries((prev) => {
      const next = { ...prev };
      const trimmed = text.trim();
      if (trimmed.length === 0) {
        delete next[k];
      } else {
        next[k] = {
          categoryId,
          dateKey: dk,
          text,
          updatedAt: new Date().toISOString(),
        };
      }
      return next;
    });
  }, []);

  const entriesByDate = useCallback(
    (categoryId?: string) => {
      const values = Object.values(entries).filter((e) => !categoryId || e.categoryId === categoryId);
      const groups = new Map<string, JournalEntry[]>();
      for (const e of values) {
        const arr = groups.get(e.dateKey) ?? [];
        arr.push(e);
        groups.set(e.dateKey, arr);
      }
      return Array.from(groups.entries())
        .map(([dateKey, items]) => ({
          dateKey,
          items: items.slice().sort((a, b) => a.categoryId.localeCompare(b.categoryId)),
        }))
        .sort((a, b) => (a.dateKey < b.dateKey ? 1 : -1));
    },
    [entries]
  );

  const value = useMemo<JournalContextValue>(
    () => ({ ready, getText, setText, entriesByDate }),
    [ready, getText, setText, entriesByDate]
  );

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}

export function useJournal(): JournalContextValue {
  const ctx = useContext(JournalContext);
  if (!ctx) throw new Error('useJournal must be used inside JournalProvider');
  return ctx;
}
