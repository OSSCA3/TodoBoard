import { useRef } from 'react';
import { useTodoStore } from '@/store/todo/todoStore';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useDropdownPosition } from '@/hooks/useDropdownPosition';

interface TodoMenuProps {
  todoId: number;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function TodoMenu({
  todoId,
  isOpen,
  onToggle,
  onClose,
}: TodoMenuProps) {
  // store 액션들 가져오기
  const editTodo = useTodoStore((state) => state.editTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  const menuRef = useRef<HTMLDivElement>(null);

  // 커스텀 훅 사용
  useClickOutside({ ref: menuRef, isOpen, onClose });
  const dropdownUp = useDropdownPosition({ ref: menuRef, isOpen });

  return (
    <div className="todo-menu-container" ref={menuRef}>
      <button onClick={onToggle} className="todo-menu-button">
        <div className="todo-menu-dots"></div>
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div
          className={`todo-menu-dropdown ${dropdownUp ? 'dropdown-up' : ''}`}
        >
          <button onClick={() => editTodo(todoId)} className="todo-menu-item">
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
            onClick={() => deleteTodo(todoId)}
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
  );
}
