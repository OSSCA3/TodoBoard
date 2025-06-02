import { Todo, PriorityType } from '@/types/todo';

// 처리된 데이터 타입
export interface ProcessedTodos {
  high: { incomplete: Todo[]; completed: Todo[] };
  medium: { incomplete: Todo[]; completed: Todo[] };
  low: { incomplete: Todo[]; completed: Todo[] };
  someday: { incomplete: Todo[]; completed: Todo[] };
}

// Zustand 상태 타입
export interface TodoState {
  // 원본 데이터
  todos: Todo[];
  isLoading: boolean;
  error: Error | null;

  // 처리된 데이터들 (완료/미완료 분리)
  processedTodos: ProcessedTodos;

  // 메뉴 상태 관리 (전역)
  openMenuId: number | null;

  // State setter 메서드들
  setTodos: (todos: Todo[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setProcessedTodos: (processedTodos: ProcessedTodos) => void;
  setOpenMenuId: (id: number | null) => void;

  // Action 메서드들
  fetchAllTodos: () => Promise<void>;
  toggleTodoComplete: (id: number) => Promise<void>;
  addTodo: (priority: PriorityType) => void;
  editTodo: (id: number) => void;
  deleteTodo: (id: number) => void;

  // 메뉴 액션
  toggleMenu: (id: number) => void;
  closeMenu: () => void;
}
