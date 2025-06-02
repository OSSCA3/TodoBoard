import { create } from 'zustand';
import { Todo, PriorityType } from '@/types/todo';
import { fetchAllTodosFromApi } from '@/libs/api/todoApi'; // API 호출 함수 임포트

// ===== 1. 데이터 처리 헬퍼 함수들 =====
// 모든 todos를 날짜별로 정렬하는 함수
const sortTodosByDate = (todos: Todo[]): Todo[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return [...todos].sort((a, b) => {
    // dueDate가 없는 경우 맨 뒤로
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;

    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    dateA.setHours(0, 0, 0, 0);
    dateB.setHours(0, 0, 0, 0);

    // 현재 날짜와의 거리 계산 (절댓값)
    const diffA = Math.abs(dateA.getTime() - today.getTime());
    const diffB = Math.abs(dateB.getTime() - today.getTime());

    return diffA - diffB;
  });
};

// 정렬된 todos를 priority별로 분류하는 함수
const filterTodosByPriority = (
  sortedTodos: Todo[],
  priority: PriorityType,
): Todo[] => {
  return sortedTodos.filter((todo) => todo.priority === priority);
};

// 모든 데이터를 한 번에 처리하는 함수
const processAllTodos = (todos: Todo[]) => {
  const sortedTodos = sortTodosByDate(todos);

  return {
    high: filterTodosByPriority(sortedTodos, 'high'),
    medium: filterTodosByPriority(sortedTodos, 'medium'),
    low: filterTodosByPriority(sortedTodos, 'low'),
    someday: filterTodosByPriority(sortedTodos, 'someday'),
  };
};

// ===== 2. 스토어 타입 정의 =====
interface TodoState {
  // 원본 데이터
  todos: Todo[];
  isLoading: boolean;
  error: Error | null;

  // 처리된 데이터들 (하나의 객체로 묶음)
  processedTodos: {
    high: Todo[];
    medium: Todo[];
    low: Todo[];
    someday: Todo[];
  };

  // 액션
  fetchAllTodos: () => Promise<void>;
}

// ===== 3. 스토어 생성 =====
export const useTodoStore = create<TodoState>((set, get) => ({
  // 초기 상태
  todos: [],
  isLoading: false,
  error: null,
  // 초기 처리된 데이터들
  processedTodos: {
    high: [],
    medium: [],
    low: [],
    someday: [],
  },
  // 액션: 데이터 가져오기 및 한 번에 처리
  fetchAllTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const fetchedTodos = await fetchAllTodosFromApi();
      // 한 번만 정렬/분류 처리
      const processedData = processAllTodos(fetchedTodos);

      set({
        todos: fetchedTodos,
        isLoading: false,
        processedTodos: processedData,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err : new Error('Failed to fetch todos'),
        isLoading: false,
      });
      console.error('Error fetching todos in store:', err);
    }
  },
}));
