'use client'; // 클라이언트 컴포넌트로 전환 (useEffect, useState, Zustand 사용을 위해)

import React, { useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import TodoQuadrant from '@/components/todo/TodoQuadrant';
import { useTodoStore } from '@/store/todo/todoStore';
import '@/styles/todo.css';

export default function TodoPage() {
  // 필요한 상태와 핸들러들
  const isLoading = useTodoStore((state) => state.isLoading);
  const error = useTodoStore((state) => state.error);
  const handleDragStart = useTodoStore((state) => state.handleDragStart);
  const handleDragOver = useTodoStore((state) => state.handleDragOver);
  const handleDragEnd = useTodoStore((state) => state.handleDragEnd);
  const handleDragCancel = useTodoStore((state) => state.handleDragCancel);

  useEffect(() => {
    useTodoStore.getState().fetchAllTodos();
  }, []);

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
            <div className="todo-quadrant">
              <TodoQuadrant title="중요한 일" priority="high" />
            </div>

            {/* 덜 중요한 일 */}
            <div className="todo-quadrant">
              <TodoQuadrant title="덜 중요한 일" priority="medium" />
            </div>

            {/* 안 중요한 일 */}
            <div className="todo-quadrant">
              <TodoQuadrant title="안 중요한 일" priority="low" />
            </div>

            {/* 미뤄둔 일 */}
            <div className="todo-quadrant">
              <TodoQuadrant title="미뤄둔 일" priority="someday" />
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
