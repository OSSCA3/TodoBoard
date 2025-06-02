import { useDroppable } from '@dnd-kit/core';
import { PriorityType } from '@/types/todo';
import { useTodoStore } from '@/store/todo/todoStore';
import { useDragStore } from '@/store/todo/dragStore';
import TodoList from './TodoList';

interface TodoQuadrantProps {
  title: string;
  priority: PriorityType;
}

export default function TodoQuadrant({ title, priority }: TodoQuadrantProps) {
  // Todo 관련
  const addTodo = useTodoStore((state) => state.addTodo);

  // 드래그 관련
  const createDropData = useDragStore((state) => state.createDropData);
  const dropData = createDropData(priority);

  // Droppable 설정
  const { setNodeRef } = useDroppable({
    id: `quadrant-${priority}`,
    data: dropData,
  });

  return (
    <div ref={setNodeRef} className="todo-quadrant-content">
      <div className="todo-quadrant-header">
        <h2 className="todo-title">{title}</h2>
        <button onClick={() => addTodo(priority)} className="todo-add-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="todo-add-icon"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="todo-content">
        <div className="todo-scroll-inner">
          <TodoList priority={priority} />
        </div>
      </div>
    </div>
  );
}
