import { useState } from 'react';
import { Todo, PriorityType } from '@/types/todo';
import { useTodoStore } from '@/store/todo/todoStore';
import { useDragStore } from '@/store/todo/dragStore';
import TodoItem from './TodoItem';

interface TodoListProps {
  priority: PriorityType;
}

export default function TodoList({ priority }: TodoListProps) {
  // 로컬 메뉴 상태 관리
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // 이미 처리된 데이터를 직접 가져오기 (중복 필터링 완전 제거)
  const processedTodos = useTodoStore((state) => state.processedTodos);
  const { incomplete: incompleteTodos, completed: completedTodos } =
    processedTodos[priority];

  // 드래그 관련
  const dropHintState = useDragStore((state) => state.dropHintState);
  const dragState = useDragStore((state) => state.dragState);

  // 드래그 중인 Todo의 완료 상태 확인
  const allTodos = useTodoStore((state) => state.todos);
  const draggedTodo = dragState.draggedTodoId
    ? allTodos.find((todo) => todo.id === Number(dragState.draggedTodoId))
    : null;

  // 드롭 힌트 로직 단순화
  const showDropHint =
    dropHintState.isVisible && dropHintState.targetPriority === priority;
  const draggedIsCompleted = draggedTodo?.isCompleted ?? false;

  const toggleMenu = (id: number) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const closeMenu = () => setOpenMenuId(null);

  // 빈 상태 처리
  if (incompleteTodos.length === 0 && completedTodos.length === 0) {
    return (
      <div className="todo-list">
        <p className="todo-text-muted todo-list-empty-message">
          이 섹션에는 할 일이 없습니다.
        </p>
        {showDropHint && <DropHint />}
      </div>
    );
  }

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
      {showDropHint && !draggedIsCompleted && <DropHint />}

      {renderTodoSection(completedTodos, '완료')}
      {showDropHint && draggedIsCompleted && <DropHint />}
    </div>
  );
}

// 드롭 힌트 컴포넌트 분리로 재사용성 향상
const DropHint = () => (
  <div className="todo-drop-hint">
    <div className="todo-drop-hint-line"></div>
    <div className="todo-drop-hint-text">여기에 추가됩니다</div>
  </div>
);
