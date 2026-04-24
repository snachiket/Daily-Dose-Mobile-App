import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type DailyEntry = {
  quote: string;
  author: string;
  task: string;
};

export type Category = {
  id: string;
  name: string;
  summary: string;
  iconName: IoniconName;
  entries: DailyEntry[];
};

export type ContentLibraryFile = {
  schemaVersion: number;
  categories: Category[];
};

export type JournalEntry = {
  categoryId: string;
  dateKey: string;
  text: string;
  updatedAt: string;
};
