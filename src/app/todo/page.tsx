'use client'; // 클라이언트 컴포넌트로 전환 (useEffect, useState, Zustand 사용을 위해)

import React, { useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import TodoQuadrant from '@/components/todo/TodoQuadrant';
import { useTodoStore } from '@/store/todo/todoStore';
import { DragData, DropData } from '@/types/dnd';
import { PriorityType } from '@/types/todo';
import '@/styles/todo.css';

export default function TodoPage() {
  // 로딩과 에러 상태만 필요
  const isLoading = useTodoStore((state) => state.isLoading);
  const error = useTodoStore((state) => state.error);
  const dragState = useTodoStore((state) => state.dragState);
  const setDragState = useTodoStore((state) => state.setDragState);
  const moveTodo = useTodoStore((state) => state.moveTodo);

  useEffect(() => {
    useTodoStore.getState().fetchAllTodos();
  }, []);

  // 드래그 시작 핸들러
  const handleDragStart = (event: DragStartEvent) => {
    const dragData = event.active.data.current as DragData;
    if (dragData) {
      setDragState({
        isDragging: true,
        draggedTodoId: dragData.id,
        targetPriority: dragData.currentPriority,
      });
    }
  };

  // 드래그 오버 핸들러 (다른 사분면 위에 있을 때)
  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      const dropData = over.data.current as DropData;
      if (dropData) {
        setDragState({
          targetPriority: dropData.priority,
        });
      }
    }
  };

  // 드래그 종료 핸들러
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    // 드래그 상태 초기화
    setDragState({
      isDragging: false,
      draggedTodoId: null,
      targetPriority: null,
    });

    if (!over) return;

    const dragData = active.data.current as DragData;
    const dropData = over.data.current as DropData;

    if (dragData && dropData) {
      // 다른 우선순위로 이동한 경우에만 실행
      if (dragData.currentPriority !== dropData.priority) {
        await moveTodo(dragData.id, dropData.priority);
      }
    }
  };

  // 드래그 취소 핸들러 (ESC 키)
  const handleDragCancel = () => {
    setDragState({
      isDragging: false,
      draggedTodoId: null,
      targetPriority: null,
    });
  };

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
