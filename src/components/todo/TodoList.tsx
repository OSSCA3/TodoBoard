import { Todo } from '@/types/todo';
import { useTodoStore } from '@/store/todoStore';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
}

export default function TodoList({ todos }: TodoListProps) {
  // 전역 메뉴 상태 관리
  const openMenuId = useTodoStore((state) => state.openMenuId);
  const toggleMenu = useTodoStore((state) => state.toggleMenu);
  const closeMenu = useTodoStore((state) => state.closeMenu);

  if (!todos || todos.length === 0) {
    return (
      <div className="todo-list">
        <p className="todo-text-muted todo-list-empty-message">
          이 섹션에는 할 일이 없습니다.
        </p>
      </div>
    );
  }

  // 완료/미완료로 분리 (store에서 이미 정렬된 데이터를 다시 분리)
  const incompleteTodos = todos.filter((todo) => !todo.isCompleted);
  const completedTodos = todos.filter((todo) => todo.isCompleted);

  const renderTodoSection = (sectionTodos: Todo[], sectionTitle: string) => {
    if (sectionTodos.length === 0) return null;

    return (
      <div className="todo-section">
        <div className="todo-section-header">
          <h3 className="todo-section-title">{sectionTitle}</h3>
          <span className="todo-section-count">({sectionTodos.length})</span>
        </div>
        <div className="todo-section-items">
          {sectionTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isMenuOpen={openMenuId === todo.id}
              onMenuToggle={() => toggleMenu(todo.id)}
              onMenuClose={closeMenu}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="todo-list">
      {renderTodoSection(incompleteTodos, '미완료')}
      {renderTodoSection(completedTodos, '완료')}
    </div>
  );
}
