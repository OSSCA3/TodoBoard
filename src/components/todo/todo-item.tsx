import { useDraggable } from '@dnd-kit/core';
import { Todo } from '@/types/todo';
import { useTodoStore } from '@/store/todo/todo-store';
import { useDragStore } from '@/store/todo/drag-store';
import TodoMenu from './todo-menu';
import TodoBody from './todo-body';

interface TodoItemProps {
  todo: Todo;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
}

const TodoItem = ({
  todo,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
}: TodoItemProps) => {
  // Todo 데이터 관련 - useTodoStore
  const toggleComplete = useTodoStore((state) => state.toggleComplete);

  // 드래그 관련 - useDragStore
  const isDisabled = useDragStore((state) => state.isDisabled);
  const isDragging = useDragStore((state) => state.isDragging);
  const getItemClass = useDragStore((state) => state.getItemClass);
  const createDragProps = useDragStore((state) => state.createDragProps);

  // store 메서드 사용으로 로직 단순화
  const dragData = createDragProps(todo);
  const itemClass = getItemClass(todo.id);
  const disabled = isDisabled(todo.id);
  const beingDragged = isDragging(todo.id);

  // 드래그 설정
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
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
          onChange={() => toggleComplete(todo.id)}
          className="todo-item-checkbox"
        />

        <div
          ref={setNodeRef}
          style={style}
          className="todo-item-text todo-item-drag-handle"
          {...listeners}
          {...attributes}
        >
          <TodoBody todo={todo} />
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
};

export default TodoItem;
