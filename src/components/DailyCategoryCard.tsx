import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Category } from '@/models/types';
import { entryFor } from '@/data/content';
import { useJournal } from '@/data/JournalStore';
import { colors, radii, spacing } from '@/theme';

type Props = {
  category: Category;
  date: Date;
};

export function DailyCategoryCard({ category, date }: Props) {
  const { getText, setText } = useJournal();
  const entry = entryFor(category, date);

  const [journalText, setJournalText] = useState('');
  const [taskDone, setTaskDone] = useState(false);

  useEffect(() => {
    setJournalText(getText(category.id, date));
  }, [category.id, date, getText]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <Ionicons name={category.iconName} size={18} color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{category.name}</Text>
          <Text style={styles.subtitle}>{category.summary}</Text>
        </View>
      </View>

      {entry ? (
        <>
          <Section label="Quote" icon="chatbox-ellipses-outline">
            <Text style={styles.quoteText}>&ldquo;{entry.quote}&rdquo;</Text>
            <Text style={styles.author}>- {entry.author}</Text>
          </Section>

          <Section label="Today's task" icon="checkmark-circle-outline">
            <Pressable
              onPress={() => setTaskDone((v) => !v)}
              style={styles.taskRow}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: taskDone }}
            >
              <Ionicons
                name={taskDone ? 'checkbox' : 'square-outline'}
                size={22}
                color={taskDone ? colors.accent : colors.textSecondary}
              />
              <Text
                style={[
                  styles.taskText,
                  taskDone && { color: colors.textSecondary, textDecorationLine: 'line-through' },
                ]}
              >
                {entry.task}
              </Text>
            </Pressable>
          </Section>

          <Section label="Journal" icon="create-outline">
            <TextInput
              value={journalText}
              onChangeText={(t) => {
                setJournalText(t);
                setText(category.id, date, t);
              }}
              placeholder={`What does ${category.name.toLowerCase()} mean to you today?`}
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
              style={styles.journalInput}
            />
          </Section>
        </>
      ) : (
        <Text style={styles.subtitle}>No content available for this category yet.</Text>
      )}
    </View>
  );
}

function Section({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginTop: spacing.md }}>
      <View style={styles.sectionLabelRow}>
        <Ionicons name={icon} size={14} color={colors.textSecondary} />
        <Text style={styles.sectionLabel}>{label}</Text>
      </View>
      <View style={{ marginTop: spacing.xs }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sectionLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quoteText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  author: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  taskText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  journalInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.separator,
    borderRadius: radii.md,
    padding: spacing.sm,
    fontSize: 15,
    color: colors.textPrimary,
  },
});
