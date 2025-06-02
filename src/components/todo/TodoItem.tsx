import { useDraggable } from '@dnd-kit/core';
import { Todo } from '@/types/todo';
import { formatDate } from '@/utils/todoFormatter';
import { useTodoStore } from '@/store/todo/todoStore';
import { DragData } from '@/types/dnd';
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
  const dragState = useTodoStore((state) => state.dragState);
  const isLoading = useTodoStore((state) => state.isLoading);

  // 드래그 가능 여부 판단 (완료된 Todo는 가능, 로딩 중은 불가)
  const isDragDisabled = isLoading;

  // Draggable 설정
  const dragData: DragData = {
    id: todo.id,
    currentPriority: todo.priority,
    todo: todo,
  };

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `todo-${todo.id}`,
      data: dragData,
      disabled: isDragDisabled,
    });

  // 드래그 중인 아이템인지 확인
  const isBeingDragged = dragState.draggedTodoId === todo.id;

  // 드래그 변환 스타일
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  // 드래그 상태에 따른 클래스 결정
  const getItemClass = () => {
    let baseClass = 'todo-item';

    if (isDragDisabled) {
      baseClass += ' todo-item-disabled';
    }

    if (isBeingDragged) {
      baseClass += ' todo-item-dragging';
    }

    return baseClass;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={getItemClass()}
      {...listeners}
      {...attributes}
    >
      <div className="todo-item-content">
        {/* 좌측: 체크박스 */}
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => toggleTodoComplete(todo.id)}
          className="todo-item-checkbox"
          // 드래그 중일 때 체크박스 이벤트 방지
          onClick={(e) => {
            if (isDragging) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
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

        {/* 우측: 메뉴 (드래그 중일 때는 숨김) */}
        {!isBeingDragged && (
          <TodoMenu
            todoId={todo.id}
            isOpen={isMenuOpen}
            onToggle={onMenuToggle}
            onClose={onMenuClose}
          />
        )}
      </div>
    </div>
  );
}
