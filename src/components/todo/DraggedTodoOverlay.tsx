import { Todo } from '@/types/todo';
import TodoBody from './TodoBody';

interface DraggedTodoOverlayProps {
  todo: Todo;
}

export default function DraggedTodoOverlay({ todo }: DraggedTodoOverlayProps) {
  return (
    <div className="todo-item todo-item-drag-overlay">
      <div className="todo-item-content">
        <input
          type="checkbox"
          checked={todo.isCompleted}
          className="todo-item-checkbox"
          readOnly
        />

        <div className="todo-item-text">
          <TodoBody todo={todo} />
        </div>
      </div>
    </div>
  );
}
