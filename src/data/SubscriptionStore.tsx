import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';

const STORAGE_KEY = 'DailyDose.subscribedCategoryIds';

type SubscriptionContextValue = {
  ready: boolean;
  subscribedIds: Set<string>;
  isSubscribed: (id: string) => boolean;
  toggle: (id: string) => void;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [subscribedIds, setSubscribedIds] = useState<Set<string>>(new Set());
  const loaded = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setSubscribedIds(new Set(JSON.parse(raw) as string[]));
      } catch {
        // ignore; start with empty set
      } finally {
        loaded.current = true;
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(subscribedIds))).catch(() => {});
  }, [subscribedIds]);

  const isSubscribed = useCallback((id: string) => subscribedIds.has(id), [subscribedIds]);

  const toggle = useCallback((id: string) => {
    setSubscribedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const value = useMemo<SubscriptionContextValue>(
    () => ({ ready, subscribedIds, isSubscribed, toggle }),
    [ready, subscribedIds, isSubscribed, toggle]
  );

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscriptions(): SubscriptionContextValue {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscriptions must be used inside SubscriptionProvider');
  return ctx;
}
