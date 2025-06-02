import { Todo, PriorityType } from '@/types/todo';
import TodoList from './TodoList';

interface TodoQuadrantProps {
  title: string;
  todos: Todo[];
  priority: PriorityType;
  className?: string;
}

export default function TodoQuadrant({
  title,
  todos,
  priority,
  className = '',
}: TodoQuadrantProps) {
  return (
    <div className={`border-2 rounded-lg p-6 min-h-[400px] ${className}`}>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <TodoList todos={todos} />
    </div>
  );
}
