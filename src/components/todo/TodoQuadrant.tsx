import { useDroppable } from '@dnd-kit/core';
import { Todo, PriorityType } from '@/types/todo';
import { useTodoStore } from '@/store/todo/todoStore';
import { DropData } from '@/types/dnd';
import TodoList from './TodoList';

interface TodoQuadrantProps {
  title: string; // 페이지에서 한글 제목을 받음
  priority: PriorityType; // 현재 사분면의 우선순위
}

export default function TodoQuadrant({ title, priority }: TodoQuadrantProps) {
  // store에서 해당 priority의 데이터 직접 가져오기 (완료/미완료 합쳐서)
  const priorityData = useTodoStore((state) => state.processedTodos[priority]);
  const todos = [...priorityData.incomplete, ...priorityData.completed];
  const dragState = useTodoStore((state) => state.dragState);

  // Droppable 설정
  const dropData: DropData = { priority };
  const { isOver, setNodeRef } = useDroppable({
    id: `quadrant-${priority}`,
    data: dropData,
  });

  // 드래그 상태에 따른 스타일 클래스 결정
  const getQuadrantClass = () => {
    if (!dragState.isDragging) return '';

    // 타겟 사분면 (드래그된 아이템이 도착할 곳)
    if (dragState.targetPriority === priority) {
      return 'todo-quadrant-target';
    }

    // 비활성 사분면 (드래그 중이지만 타겟이 아님)
    return 'todo-quadrant-inactive';
  };

  return (
    <div
      ref={setNodeRef}
      className={`todo-quadrant-content ${getQuadrantClass()}`}
    >
      <div className="todo-quadrant-header">
        <h2 className="todo-title">{title}</h2>
        <button
          onClick={() => useTodoStore.getState().addTodo(priority)}
          className="todo-add-button"
        >
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
          <TodoList todos={todos} />
        </div>
      </div>
    </div>
  );
}
