import { useDraggable } from '@dnd-kit/core';
import { Todo } from '@/types/todo';
import { formatDate } from '@/utils/todoProcessor';
import { useTodoStore } from '@/store/todo/todoStore';
import { useDragStore } from '@/store/todo/dragStore';
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
  // Todo 데이터 관련 - useTodoStore
  const toggleTodoComplete = useTodoStore((state) => state.toggleTodoComplete);

  // 드래그 관련 - useDragStore
  const isDragDisabled = useDragStore((state) => state.isDragDisabled);
  const isBeingDragged = useDragStore((state) => state.isBeingDragged);
  const getTodoItemClass = useDragStore((state) => state.getTodoItemClass);
  const createDragData = useDragStore((state) => state.createDragData);

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

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div className={itemClass}>
      <div className="todo-item-content">
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => toggleTodoComplete(todo.id)}
          className="todo-item-checkbox"
        />

        <div
          ref={setNodeRef}
          style={style}
          className="todo-item-text todo-item-drag-handle"
          {...listeners}
          {...attributes}
        >
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
