import { FlatList, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categories } from '@/data/content';
import { useSubscriptions } from '@/data/SubscriptionStore';
import { colors, radii, spacing } from '@/theme';

export default function CategoriesScreen() {
  const { isSubscribed, toggle } = useSubscriptions();

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={categories}
      keyExtractor={(c) => c.id}
      ListHeaderComponent={
        <Text style={styles.intro}>
          Subscribe to the virtues you want to practice daily. Each category will show a quote, a task, and a
          journal prompt every day.
        </Text>
      }
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={styles.iconBadge}>
            <Ionicons name={item.iconName} size={18} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.summary}>{item.summary}</Text>
          </View>
          <Switch
            value={isSubscribed(item.id)}
            onValueChange={() => toggle(item.id)}
            trackColor={{ true: colors.accent, false: colors.separator }}
          />
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  intro: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.md,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  summary: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  separator: {
    height: spacing.sm,
  },
});
