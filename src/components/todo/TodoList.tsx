import { useState } from 'react';
import { Todo, PriorityType } from '@/types/todo';
import { useTodoStore } from '@/store/todo/todoStore';
import { useDragStore } from '@/store/todo/dragStore';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  priority: PriorityType;
}

export default function TodoList({ todos, priority }: TodoListProps) {
  // 로컬 메뉴 상태 관리 (전역에서 로컬로 개선)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // Todo 데이터 관련 - useTodoStore
  const allTodos = useTodoStore((state) => state.todos);

  // 드래그 관련 - useDragStore
  const dropHintState = useDragStore((state) => state.dropHintState);
  const dragState = useDragStore((state) => state.dragState);

  // 현재 드래그 중인 Todo 찾기
  const draggedTodo = dragState.draggedTodoId
    ? allTodos.find((todo) => todo.id === Number(dragState.draggedTodoId))
    : null;

  // 현재 사분면이 드롭 타겟인지 확인
  const isCurrentQuadrantTarget =
    dropHintState.isVisible && dropHintState.targetPriority === priority;

  const toggleMenu = (id: number) => {
    setOpenMenuId((currentId) => (currentId === id ? null : id));
  };
  const closeMenu = () => {
    setOpenMenuId(null);
  };

  if (!todos || todos.length === 0) {
    return (
      <div className="todo-list">
        <p className="todo-text-muted todo-list-empty-message">
          이 섹션에는 할 일이 없습니다.
        </p>
        {/* 빈 섹션에서도 현재 사분면이 타겟일 때만 드롭 힌트 표시 */}
        {isCurrentQuadrantTarget && (
          <div className="todo-drop-hint">
            <div className="todo-drop-hint-line"></div>
            <div className="todo-drop-hint-text">여기에 추가됩니다</div>
          </div>
        )}
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

  // 드롭 힌트를 표시할 위치 결정 (현재 사분면이 타겟일 때만)
  const shouldShowHintAfterIncomplete =
    isCurrentQuadrantTarget && (!draggedTodo || !draggedTodo.isCompleted); // 드래그 중인 항목이 미완료이거나 항목을 찾을 수 없는 경우

  const shouldShowHintAfterComplete =
    isCurrentQuadrantTarget && draggedTodo && draggedTodo.isCompleted;

  return (
    <div className="todo-list">
      {renderTodoSection(incompleteTodos, '미완료')}

      {/* 미완료 항목을 드래그하는 경우 미완료 섹션 아래에 드롭 힌트 표시 */}
      {shouldShowHintAfterIncomplete && (
        <div className="todo-drop-hint">
          <div className="todo-drop-hint-line"></div>
          <div className="todo-drop-hint-text">여기에 추가됩니다</div>
        </div>
      )}

      {renderTodoSection(completedTodos, '완료')}

      {/* 완료된 항목을 드래그하는 경우 완료 섹션 아래에 드롭 힌트 표시 */}
      {shouldShowHintAfterComplete && (
        <div className="todo-drop-hint">
          <div className="todo-drop-hint-line"></div>
          <div className="todo-drop-hint-text">여기에 추가됩니다</div>
        </div>
      )}
    </div>
  );
}
