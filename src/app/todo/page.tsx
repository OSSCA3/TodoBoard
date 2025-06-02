'use client'; // 클라이언트 컴포넌트로 전환 (useEffect, useState, Zustand 사용을 위해)

import { useEffect } from 'react';
import TodoQuadrant from '@/components/todo/TodoQuadrant';
import { useTodoStore } from '@/store/todoStore';
import '@/styles/todo.css';

export default function TodoPage() {
  // 개별적으로 상태를 가져와서 selector 안정성 확보
  const todos = useTodoStore((state) => state.todos);
  const isLoading = useTodoStore((state) => state.isLoading);
  const error = useTodoStore((state) => state.error);
  const fetchAllTodos = useTodoStore((state) => state.fetchAllTodos);

  useEffect(() => {
    fetchAllTodos();
  }, []);

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="todo-page">
        <div className="todo-container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
            }}
          >
            <p className="todo-text" style={{ fontSize: '1.25rem' }}>
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
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
            }}
          >
            <p className="todo-text" style={{ fontSize: '1.25rem' }}>
              데이터를 불러오는 데 실패했습니다.
            </p>
            <p className="todo-text-muted" style={{ marginTop: '0.5rem' }}>
              에러: {error.message}
            </p>
            <button
              onClick={fetchAllTodos}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
              }}
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
              todos={todos.filter((todo) => todo.priority === 'high')}
              priority="high"
            />
          </div>

          {/* 덜 중요한 일 */}
          <div className="todo-quadrant">
            <TodoQuadrant
              title="덜 중요한 일"
              todos={todos.filter((todo) => todo.priority === 'medium')}
              priority="medium"
            />
          </div>

          {/* 안 중요한 일 */}
          <div className="todo-quadrant">
            <TodoQuadrant
              title="안 중요한 일"
              todos={todos.filter((todo) => todo.priority === 'low')}
              priority="low"
            />
          </div>

          {/* 미뤄둔 일 */}
          <div className="todo-quadrant">
            <TodoQuadrant
              title="미뤄둔 일"
              todos={todos.filter((todo) => todo.priority === 'someday')}
              priority="someday"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
