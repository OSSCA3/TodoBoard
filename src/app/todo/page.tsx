'use client';

import React, { useEffect } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import Quadrant from '@/components/todo/quadrant';
import StatusUI from '@/components/todo/status-ui';
import TodoDragOverlay from '@/components/todo/drag-overlay';
import { useTodoStore } from '@/store/todo/todo-store';
import { useDragStore } from '@/store/todo/drag-store';
import '@/styles/todo.css';

const QUADRANTS = [
  { title: '중요한 일', priority: 'high' },
  { title: '덜 중요한 일', priority: 'medium' },
  { title: '안 중요한 일', priority: 'low' },
  { title: '미뤄둔 일', priority: 'someday' },
] as const;

const TodoPage = () => {
  // Todo 상태 - 개별 selector로 분리
  const isLoading = useTodoStore((state) => state.isLoading);
  const error = useTodoStore((state) => state.error);
  const todos = useTodoStore((state) => state.todos);
  const fetchAll = useTodoStore((state) => state.fetchAll);

  // 드래그 관련 - useDragStore
  const dragState = useDragStore((state) => state.dragState);
  const onDragStart = useDragStore((state) => state.onDragStart);
  const onDragOver = useDragStore((state) => state.onDragOver);
  const onDragEnd = useDragStore((state) => state.onDragEnd);
  const onDragCancel = useDragStore((state) => state.onDragCancel);
  const getQuadrantClass = useDragStore((state) => state.getQuadrantClass);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // 드래그 중인 Todo
  const draggedTodo = dragState.draggedTodoId
    ? todos.find((todo) => todo.id === Number(dragState.draggedTodoId))
    : null;

  if (isLoading || error) {
    return <StatusUI type={isLoading ? 'loading' : 'error'} />;
  }

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div className="todo-page">
        <div className="todo-container">
          <h1 className="todo-main-title">TODO</h1>
          <div className="todo-grid">
            {QUADRANTS.map(({ title, priority }) => (
              <div
                key={priority}
                className={`todo-quadrant ${getQuadrantClass(priority)}`}
              >
                <Quadrant title={title} priority={priority} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <DragOverlay>
        {draggedTodo && <TodoDragOverlay todo={draggedTodo} />}
      </DragOverlay>
    </DndContext>
  );
};

export default TodoPage;
