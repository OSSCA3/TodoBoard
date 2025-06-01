export interface TodoItem {
  id: number;
  title: string;
  date: string;
  isCompleted: boolean;
  dueDate: string;
  tag?: string;
  order: number;
  priority: string;
  createdAt: string;
  updatedAt: string;
}
