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
    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-4">
        {/* 좌측: 체크박스 */}
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleToggleComplete}
          className="w-6 h-6 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer flex-shrink-0"
        />

        {/* 중앙: 제목과 마감일 */}
        <div className="flex-grow">
          {/* 상단: 제목 */}
          <div
            className={`text-base font-medium ${
              isCompleted ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
          >
            {todo.title}
          </div>

          {/* 하단: 마감일 */}
          {todo.dueDate && (
            <div
              className={`text-sm mt-1 ${
                isCompleted ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {formatDate(todo.dueDate)}
            </div>
          )}
        </div>

        {/* 우측: 3점 메뉴 버튼 */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={handleMenuClick}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200 flex-shrink-0 group"
          >
            <svg
              className="w-5 h-5 text-gray-600 group-hover:text-gray-800"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {/* 드롭다운 메뉴 */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-20">
              <button
                onClick={handleEdit}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
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
                <span>편집</span>
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 whitespace-nowrap"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
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
                <span>삭제</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
