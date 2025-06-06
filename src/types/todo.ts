export const Priorities = ['high', 'medium', 'low', 'someday'] as const;
export type PriorityType = (typeof Priorities)[number];
// export type TagType = 'work' | 'dev' | 'personal';

export interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
  dueDate: string;
  priority: PriorityType;
  // tag?: TagType | null;
  // order: number;
  // createdAt: string;
  // updatedAt: string;
}
