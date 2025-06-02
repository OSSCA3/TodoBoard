'use client'; // 클라이언트 컴포넌트로 전환 (useEffect, useState, Zustand 사용을 위해)

import { useEffect } from 'react';
import TodoQuadrant from '@/components/todo/TodoQuadrant';
import { useTodoStore } from '@/store/todoStore';
import { Todo, PriorityType } from '@/types/todo';

// PriorityType에 해당하는 한글 제목을 반환하는 헬퍼 함수
const getQuadrantTitle = (priority: PriorityType): string => {
  switch (priority) {
    case 'high':
      return '중요한 일';
    case 'medium':
      return '덜 중요한 일';
    case 'low':
      return '안 중요한 일';
    case 'someday':
      return '미뤄둔 일';
    default:
      return '알 수 없는 우선순위';
  }
};

// category 문자열을 PriorityType으로 변환하는 함수
// (TodoQuadrant에서 사용하던 category를 PriorityType으로 매핑하기 위함)
const mapCategoryToPriority = (
  category: 'important' | 'urgent' | 'not-urgent' | 'someday',
): PriorityType => {
  const mapping = {
    important: 'high' as const,
    urgent: 'medium' as const, // 'urgent'를 'medium'으로 매핑 (기존 TodoQuadrant의 category와 일치시키기 위해)
    'not-urgent': 'low' as const, // 'not-urgent'를 'low'로 매핑
    someday: 'someday' as const,
  };
  return mapping[category];
};

export default function TodoPage() {
  // 개별적으로 상태를 가져와서 selector 안정성 확보
  const todos = useTodoStore((state) => state.todos);
  const isLoading = useTodoStore((state) => state.isLoading);
  const error = useTodoStore((state) => state.error);
  const fetchAllTodos = useTodoStore((state) => state.fetchAllTodos);

  useEffect(() => {
    fetchAllTodos(); // 페이지 로드 시 모든 할 일 데이터 가져오기
  }, []); // fetchAllTodos를 의존성에서 제거

  // 각 사분면에 해당하는 priority 배열
  const priorities: PriorityType[] = ['high', 'medium', 'low', 'someday'];

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <p className="text-xl text-gray-700">데이터를 불러오는 중입니다...</p>
        {/* 여기에 좀 더 멋진 로딩 스피너를 추가할 수 있습니다 */}
      </div>
    );
  }

  // 에러 발생 시 UI
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col justify-center items-center">
        <p className="text-xl text-red-600">
          데이터를 불러오는 데 실패했습니다.
        </p>
        <p className="text-md text-gray-700 mt-2">에러: {error.message}</p>
        <button
          onClick={fetchAllTodos}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 배경색과 테두리색을 위한 클래스 매핑
  const quadrantStyles: Record<PriorityType, string> = {
    high: 'bg-red-50 border-red-200',
    medium: 'bg-yellow-50 border-yellow-200',
    low: 'bg-blue-50 border-blue-200',
    someday: 'bg-gray-100 border-gray-200',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">TODO</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {priorities.map((priority) => {
            // 해당 priority에 맞는 할 일들만 필터링
            const filteredTodos = todos.filter(
              (todo) => todo.priority === priority,
            );
            return (
              <TodoQuadrant
                key={priority} // key는 고유해야 함
                title={getQuadrantTitle(priority)} // Priority에 맞는 한글 제목 사용
                // category 대신 todos와 priority를 직접 전달 (또는 category를 priority로 변환)
                todos={filteredTodos} // 필터링된 할 일 목록 전달
                priority={priority} // 현재 사분면의 priority 전달
                className={quadrantStyles[priority]} // 스타일에 priority 사용
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
