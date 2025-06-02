import { Todo } from '@/types/todo';
import { formatDate } from '@/utils/todoFormatter';
import { useTodoStore } from '@/store/todoStore';
import TodoMenu from './TodoMenu';

interface TodoItemProps {
  todo: Todo;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
}

export default function TodoItem({
  todo,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
}: TodoItemProps) {
  // store 액션 가져오기
  const toggleTodoComplete = useTodoStore((state) => state.toggleTodoComplete);

  return (
    <div className="todo-item">
      <div className="todo-item-content">
        {/* 좌측: 체크박스 */}
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => toggleTodoComplete(todo.id)}
          className="todo-item-checkbox"
        />

        {/* 중앙: 제목과 마감일 */}
        <div className="todo-item-text">
          {/* 상단: 제목 */}
          <div
            className={`todo-item-title ${
              todo.isCompleted
                ? 'todo-text-completed todo-item-title-completed'
                : 'todo-text'
            }`}
          >
            {todo.title}
          </div>

          {/* 하단: 마감일 */}
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

        {/* 우측: 메뉴 */}
        <TodoMenu
          todoId={todo.id}
          isOpen={isMenuOpen}
          onToggle={onMenuToggle}
          onClose={onMenuClose}
        />
      </div>
    </div>
  );
}
