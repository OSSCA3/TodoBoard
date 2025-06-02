import { useState } from 'react';
import { Todo } from '@/types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
}

export default function TodoList({ todos }: TodoListProps) {
  // 현재 열린 메뉴의 ID를 관리
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleMenuToggle = (todoId: number) => {
    setOpenMenuId(openMenuId === todoId ? null : todoId);
  };

  const handleMenuClose = () => {
    setOpenMenuId(null);
  };

  if (!todos || todos.length === 0) {
    return (
      <div className="todo-list">
        <p className="todo-text-muted todo-list-empty-message">
          이 섹션에는 할 일이 없습니다.
        </p>
      </div>
    );
  }

  // 완료/미완료로 분리
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
              onMenuToggle={() => handleMenuToggle(todo.id)}
              onMenuClose={handleMenuClose}
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
