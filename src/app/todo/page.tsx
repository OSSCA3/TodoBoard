'use client';

import React, { useEffect } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import TodoQuadrant from '@/components/todo/TodoQuadrant';
import StatusUI from '@/components/todo/StatusUI';
import DraggedTodoOverlay from '@/components/todo/DraggedTodoOverlay';
import { useTodoStore } from '@/store/todo/todoStore';
import '@/styles/todo.css';

const TODO_QUADRANTS = [
  { title: '중요한 일', priority: 'high' },
  { title: '덜 중요한 일', priority: 'medium' },
  { title: '안 중요한 일', priority: 'low' },
  { title: '미뤄둔 일', priority: 'someday' },
] as const;

export default function TodoPage() {
  const isLoading = useTodoStore((state) => state.isLoading);
  const error = useTodoStore((state) => state.error);
  const dragState = useTodoStore((state) => state.dragState);
  const todos = useTodoStore((state) => state.todos);
  const handleDragStart = useTodoStore((state) => state.handleDragStart);
  const handleDragOver = useTodoStore((state) => state.handleDragOver);
  const handleDragEnd = useTodoStore((state) => state.handleDragEnd);
  const handleDragCancel = useTodoStore((state) => state.handleDragCancel);
  const getQuadrantClass = useTodoStore((state) => state.getQuadrantClass);

  useEffect(() => {
    useTodoStore.getState().fetchAllTodos();
  }, []);

  // 드래그 중인 Todo 찾기
  const draggedTodo = dragState.draggedTodoId
    ? todos.find((todo) => todo.id === Number(dragState.draggedTodoId))
    : null;

  if (isLoading || error)
    return <StatusUI type={isLoading ? 'loading' : 'error'} />;

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="todo-page">
        <div className="todo-container">
          <h1 className="todo-main-title">TODO</h1>
          <div className="todo-grid">
            {TODO_QUADRANTS.map(({ title, priority }) => (
              <div
                key={priority}
                className={`todo-quadrant ${getQuadrantClass(priority)}`}
              >
                <TodoQuadrant title={title} priority={priority} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <DragOverlay>
        {draggedTodo && <DraggedTodoOverlay todo={draggedTodo} />}
      </DragOverlay>
    </DndContext>
  );
}
