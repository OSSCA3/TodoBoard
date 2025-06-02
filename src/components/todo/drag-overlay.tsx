import { Todo } from '@/types/todo';
import TodoBody from './todo-body';

interface DragOverlayProps {
  todo: Todo;
}

const DragOverlay = ({ todo }: DragOverlayProps) => {
  return (
    <div className="todo-item drag-overlay">
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
};

export default DragOverlay;
