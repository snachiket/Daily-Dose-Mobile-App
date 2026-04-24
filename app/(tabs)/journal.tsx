import { SectionList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategory } from '@/data/content';
import { useJournal } from '@/data/JournalStore';
import { colors, radii, spacing } from '@/theme';

function prettyDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export default function JournalScreen() {
  const { entriesByDate } = useJournal();
  const groups = entriesByDate();

  if (groups.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="book-outline" size={56} color={colors.textSecondary} />
        <Text style={styles.emptyTitle}>No journal entries yet</Text>
        <Text style={styles.emptyBody}>
          Your reflections will appear here once you start writing in the Today tab.
        </Text>
      </View>
    );
  }

  return (
    <SectionList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      sections={groups.map((g) => ({ title: prettyDate(g.dateKey), data: g.items }))}
      keyExtractor={(item) => `${item.dateKey}-${item.categoryId}`}
      renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
      renderItem={({ item }) => {
        const category = getCategory(item.categoryId);
        return (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              {category ? (
                <>
                  <Ionicons name={category.iconName} size={16} color={colors.accent} />
                  <Text style={styles.categoryLabel}>{category.name}</Text>
                </>
              ) : (
                <Text style={styles.categoryLabel}>{item.categoryId}</Text>
              )}
            </View>
            <Text style={styles.body}>{item.text}</Text>
          </View>
        );
      }}
      stickySectionHeadersEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  body: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  empty: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
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
  },
});
