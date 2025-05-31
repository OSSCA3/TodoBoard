export interface TodoItem {
  id: number;
  content: string;
  date: string;
  isCompleted: boolean;
  dueDate: string;
  tag?: string;
  order: number;
  priority: string;
  createdAt: string;
  updatedAt: string;
}
