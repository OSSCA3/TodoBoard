'use client'; // 클라이언트 컴포넌트로 전환 (useEffect, useState, Zustand 사용을 위해)

import React, { useEffect } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import TodoQuadrant from '@/components/todo/TodoQuadrant';
import { useTodoStore } from '@/store/todo/todoStore';
import { formatDate } from '@/utils/todoFormatter';
import '@/styles/todo.css';

export default function TodoPage() {
  // 필요한 상태와 핸들러들
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

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="todo-page">
        <div className="todo-loading">
          <div className="loading-spinner"></div>
          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
          <p className="todo-text">데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  // 에러 발생 시 UI
  if (error) {
    return (
      <div className="todo-page">
        <div className="todo-error">
          <div className="todo-error-icon">⚠️</div>
          <p className="todo-text todo-status-message">
            데이터를 불러오는 데 실패했습니다.
          </p>
          <p className="todo-text-muted">에러: {error.message}</p>
          <button
            onClick={() => useTodoStore.getState().fetchAllTodos()}
            className="todo-retry-button"
          >
            🔄 다시 시도
          </button>
        </div>
      </div>
    );
  }

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
            {/* 중요한 일 */}
            <div className={`todo-quadrant ${getQuadrantClass('high')}`}>
              <TodoQuadrant title="중요한 일" priority="high" />
            </div>

            {/* 덜 중요한 일 */}
            <div className={`todo-quadrant ${getQuadrantClass('medium')}`}>
              <TodoQuadrant title="덜 중요한 일" priority="medium" />
            </div>

            {/* 안 중요한 일 */}
            <div className={`todo-quadrant ${getQuadrantClass('low')}`}>
              <TodoQuadrant title="안 중요한 일" priority="low" />
            </div>

            {/* 미뤄둔 일 */}
            <div className={`todo-quadrant ${getQuadrantClass('someday')}`}>
              <TodoQuadrant title="미뤄둔 일" priority="someday" />
            </div>
          </div>
        </div>
      </div>

      {/* 드래그 오버레이 - 커스텀 드래그 프리뷰 */}
      <DragOverlay>
        {draggedTodo ? (
          <div className="todo-item todo-item-drag-overlay">
            <div className="todo-item-content">
              {/* 좌측: 체크박스 */}
              <input
                type="checkbox"
                checked={draggedTodo.isCompleted}
                className="todo-item-checkbox"
                readOnly
              />

              {/* 중앙: 제목과 마감일 */}
              <div className="todo-item-text">
                {/* 상단: 제목 */}
                <div
                  className={`todo-item-title ${
                    draggedTodo.isCompleted
                      ? 'todo-text-completed todo-item-title-completed'
                      : 'todo-text'
                  }`}
                >
                  {draggedTodo.title}
                </div>

                {/* 하단: 마감일 */}
                {draggedTodo.dueDate && (
                  <div
                    className={`todo-item-date ${
                      draggedTodo.isCompleted
                        ? 'todo-text-completed'
                        : 'todo-text-muted'
                    }`}
                  >
                    {formatDate(draggedTodo.dueDate)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
