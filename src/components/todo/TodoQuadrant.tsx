import { Todo, PriorityType } from '@/types/todo';
import { useTodoStore } from '@/store/todoStore';
import TodoList from './TodoList';

interface TodoQuadrantProps {
  title: string; // 페이지에서 한글 제목을 받음
  priority: PriorityType; // 현재 사분면의 우선순위
}

export default function TodoQuadrant({ title, priority }: TodoQuadrantProps) {
  const todos = useTodoStore((state) => state.processedTodos[priority]);

  return (
    <div>
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
