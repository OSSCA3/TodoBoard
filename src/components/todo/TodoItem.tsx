import { useRef } from 'react';
import { Todo } from '@/types/todo';
import { formatDate, useTodoStore } from '@/store/todoStore';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useDropdownPosition } from '@/hooks/useDropdownPosition';

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
  // store 액션들 가져오기
  const toggleTodoComplete = useTodoStore((state) => state.toggleTodoComplete);
  const editTodo = useTodoStore((state) => state.editTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  const menuRef = useRef<HTMLDivElement>(null);

  // 커스텀 훅 사용
  useClickOutside({ ref: menuRef, isOpen: isMenuOpen, onClose: onMenuClose });
  const dropdownUp = useDropdownPosition({ ref: menuRef, isOpen: isMenuOpen });

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

        {/* 우측: 3점 메뉴 버튼 */}
        <div className="todo-menu-container" ref={menuRef}>
          <button onClick={onMenuToggle} className="todo-menu-button">
            <div className="todo-menu-dots"></div>
          </button>

          {/* 드롭다운 메뉴 */}
          {isMenuOpen && (
            <div
              className={`todo-menu-dropdown ${dropdownUp ? 'dropdown-up' : ''}`}
            >
              <button
                onClick={() => editTodo(todo.id)}
                className="todo-menu-item"
              >
                <svg
                  className="todo-menu-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="todo-menu-item delete"
              >
                <svg
                  className="todo-menu-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
