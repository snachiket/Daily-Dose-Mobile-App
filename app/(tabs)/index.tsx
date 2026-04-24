import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSubscriptions } from '@/data/SubscriptionStore';
import { categories } from '@/data/content';
import { DailyCategoryCard } from '@/components/DailyCategoryCard';
import { colors, spacing } from '@/theme';

export default function TodayScreen() {
  const { ready, isSubscribed } = useSubscriptions();
  const today = useMemo(() => new Date(), []);
  const subscribed = categories.filter((c) => isSubscribed(c.id));

  const formatter = useMemo(
    () => new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'short', day: 'numeric' }),
    []
  );

  if (!ready) return <View style={styles.container} />;

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>{formatter.format(today)}</Text>
      {subscribed.length === 0 ? (
        <EmptyState />
      ) : (
        subscribed.map((category) => (
          <DailyCategoryCard key={category.id} category={category} date={today} />
        ))
      )}
    </ScrollView>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Ionicons name="sunny-outline" size={56} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No subscriptions yet</Text>
      <Text style={styles.emptyBody}>
        Open the Categories tab and subscribe to the virtues you want to practice daily.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emptyBody: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
