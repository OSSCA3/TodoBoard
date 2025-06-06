export type PriorityType = 'high' | 'medium' | 'low' | 'someday';
// export type TagType = 'work' | 'dev' | 'personal';

export interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
  dueDate: string | null;
  priority: PriorityType;
  // tag?: TagType | null;
  // order: number;
  // createdAt: string;
  // updatedAt: string;
}
