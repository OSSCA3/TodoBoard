import { useDroppable } from '@dnd-kit/core';
import { PriorityType } from '@/types/todo';
import { useTodoStore } from '@/store/todo/todo-store';
import { useDragStore } from '@/store/todo/drag-store';
import TodoList from './todo-list';

interface QuadrantProps {
  title: string;
  priority: PriorityType;
}

const Quadrant = ({ title, priority }: QuadrantProps) => {
  // Todo 관련
  const addTodo = useTodoStore((state) => state.addTodo);

  // 드래그 관련
  const createDropProps = useDragStore((state) => state.createDropProps);
  const dropData = createDropProps(priority);

  // Droppable 설정
  const { setNodeRef } = useDroppable({
    id: `quadrant-${priority}`,
    data: dropData,
  });

  return (
    <div ref={setNodeRef} className="quadrant-content">
      <div className="quadrant-header">
        <h2 className="quadrant-title">{title}</h2>
        <button onClick={() => addTodo(priority)} className="add-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="add-icon"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="content">
        <div className="scroll-inner">
          <TodoList priority={priority} />
        </div>
      </div>
    </div>
  );
};

export default Quadrant;
