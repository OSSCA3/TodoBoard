import { useState, useEffect, useRef } from 'react';
import { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
}

// 날짜를 yyyy-MM-dd 형식으로 변환하는 헬퍼 함수
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

export default function TodoItem({
  todo,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
}: TodoItemProps) {
  // 로컬 상태로 완료 여부 관리
  const [isCompleted, setIsCompleted] = useState(todo.isCompleted);
  const [dropdownUp, setDropdownUp] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지를 위한 useEffect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        onMenuClose();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, onMenuClose]);

  // 드롭다운 위치 계산
  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;

      // 아래쪽 공간이 100px 미만이면 위쪽으로 표시
      setDropdownUp(spaceBelow < 100);
    }
  }, [isMenuOpen]);

  const handleToggleComplete = () => {
    setIsCompleted(!isCompleted);
    // 나중에 서버 업데이트 로직 추가 예정
  };

  const handleMenuClick = () => {
    onMenuToggle();
  };

  const handleEdit = () => {
    console.log('편집:', todo.id);
    onMenuClose();
    // 나중에 편집 모달/폼 구현 예정
  };

  const handleDelete = () => {
    console.log('삭제:', todo.id);
    onMenuClose();
    // 나중에 삭제 확인 및 실행 구현 예정
  };

  return (
    <div className="todo-item">
      <div className="todo-item-content">
        {/* 좌측: 체크박스 */}
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleToggleComplete}
          className="todo-item-checkbox"
        />

        {/* 중앙: 제목과 마감일 */}
        <div className="todo-item-text">
          {/* 상단: 제목 */}
          <div
            className={`todo-item-title ${
              isCompleted
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
                isCompleted ? 'todo-text-completed' : 'todo-text-muted'
              }`}
            >
              {formatDate(todo.dueDate)}
            </div>
          )}
        </div>

        {/* 우측: 3점 메뉴 버튼 */}
        <div className="todo-menu-container" ref={menuRef}>
          <button onClick={handleMenuClick} className="todo-menu-button">
            <div className="todo-menu-dots"></div>
          </button>

          {/* 드롭다운 메뉴 */}
          {isMenuOpen && (
            <div
              className={`todo-menu-dropdown ${dropdownUp ? 'dropdown-up' : ''}`}
            >
              <button onClick={handleEdit} className="todo-menu-item">
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
              <button onClick={handleDelete} className="todo-menu-item delete">
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
