export type PriorityType = 'high' | 'medium' | 'low' | 'someday';
export type TagType = 'work' | 'dev' | 'personal';

export interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
  dueDate: string | null;
  tag?: TagType | null;
  order: number;
  priority: PriorityType;
  createdAt: string;
  updatedAt: string;
}
