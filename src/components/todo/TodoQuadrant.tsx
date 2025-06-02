import { Todo, PriorityType } from '@/types/todo';
import { useTodoStore } from '@/store/todoStore';
import TodoList from './TodoList';

interface TodoQuadrantProps {
  title: string; // 페이지에서 한글 제목을 받음
  priority: PriorityType; // 현재 사분면의 우선순위
}

export default function TodoQuadrant({ title, priority }: TodoQuadrantProps) {
  // store에서 해당 priority의 데이터 직접 가져오기
  const todos = useTodoStore((state) => state.processedTodos[priority]);
  // 더 이상 목업 데이터나 자체적인 API 호출 로직이 필요 없음
  // 모든 데이터는 props를 통해 TodoPage로부터 전달받음

  const handleAddTodo = () => {
    console.log('할 일 추가 버튼 클릭!', priority);
    // 나중에 할 일 추가 모달/폼 구현 예정
  };

  return (
    <div>
      <div className="todo-quadrant-header">
        <h2 className="todo-title">{title}</h2>
        <button onClick={handleAddTodo} className="todo-add-button">
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
