import { Todo } from '@/types/todo';
import { formatDate } from '@/utils/todoProcessor';

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
          <div
            className={`todo-item-title ${
              todo.isCompleted
                ? 'todo-text-completed todo-item-title-completed'
                : 'todo-text'
            }`}
          >
            {todo.title}
          </div>

          {todo.dueDate && (
            <div
              className={`todo-item-date ${
                todo.isCompleted ? 'todo-text-completed' : 'todo-text-muted'
              }`}
            >
              {formatDate(todo.dueDate)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
