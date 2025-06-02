'use client'; // 클라이언트 컴포넌트로 전환 (useEffect, useState, Zustand 사용을 위해)

import { useEffect } from 'react';
import TodoQuadrant from '@/components/todo/TodoQuadrant';
import { useTodoStore } from '@/store/todoStore';
import '@/styles/todo.css';

export default function TodoPage() {
  // 개별적으로 상태를 가져와서 안정성 확보
  const isLoading = useTodoStore((state) => state.isLoading);
  const error = useTodoStore((state) => state.error);
  const processedTodos = useTodoStore((state) => state.processedTodos);

  useEffect(() => {
    useTodoStore.getState().fetchAllTodos();
  }, []);

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="todo-page">
        <div className="todo-container">
          <div className="todo-status-container">
            <p className="todo-text todo-status-message">
              데이터를 불러오는 중입니다...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 발생 시 UI
  if (error) {
    return (
      <div className="todo-page">
        <div className="todo-container">
          <div
            className="todo-status-container"
            style={{ flexDirection: 'column' }}
          >
            <p className="todo-text todo-status-message">
              데이터를 불러오는 데 실패했습니다.
            </p>
            <p className="todo-text-muted todo-error-message-margin">
              에러: {error.message}
            </p>
            <button
              onClick={() => useTodoStore.getState().fetchAllTodos()}
              className="todo-retry-button"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-page">
      <div className="todo-container">
        <h1 className="todo-main-title">TODO</h1>
        <div className="todo-grid">
          {/* 중요한 일 */}
          <div className="todo-quadrant">
            <TodoQuadrant
              title="중요한 일"
              todos={processedTodos.high}
              priority="high"
            />
          </div>

          {/* 덜 중요한 일 */}
          <div className="todo-quadrant">
            <TodoQuadrant
              title="덜 중요한 일"
              todos={processedTodos.medium}
              priority="medium"
            />
          </div>

          {/* 안 중요한 일 */}
          <div className="todo-quadrant">
            <TodoQuadrant
              title="안 중요한 일"
              todos={processedTodos.low}
              priority="low"
            />
          </div>

          {/* 미뤄둔 일 */}
          <div className="todo-quadrant">
            <TodoQuadrant
              title="미뤄둔 일"
              todos={processedTodos.someday}
              priority="someday"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
