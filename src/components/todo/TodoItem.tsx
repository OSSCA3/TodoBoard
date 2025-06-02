import { useDraggable } from '@dnd-kit/core';
import { Todo } from '@/types/todo';
import { formatDate } from '@/utils/todoFormatter';
import { useTodoStore } from '@/store/todo/todoStore';
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
  // store 액션 및 utility 메서드 가져오기
  const toggleTodoComplete = useTodoStore((state) => state.toggleTodoComplete);
  const isDragDisabled = useTodoStore((state) => state.isDragDisabled);
  const isBeingDragged = useTodoStore((state) => state.isBeingDragged);
  const getTodoItemClass = useTodoStore((state) => state.getTodoItemClass);
  const createDragData = useTodoStore((state) => state.createDragData);

  // store 메서드 사용으로 로직 단순화
  const dragData = createDragData(todo);
  const itemClass = getTodoItemClass(todo.id);
  const disabled = isDragDisabled(todo.id);
  const beingDragged = isBeingDragged(todo.id);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `todo-${todo.id}`,
      data: dragData,
      disabled: disabled,
    });

  // 드래그 변환 스타일
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={itemClass}
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
        {!beingDragged && (
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
