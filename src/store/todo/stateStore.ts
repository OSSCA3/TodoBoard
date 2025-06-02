import { create } from 'zustand';
import { Todo } from '@/types/todo';
import { createInitialProcessedTodos } from '@/utils/todoProcessor';
import { ProcessedTodos } from './typeStore';

// 순수 상태 관리 타입
interface TodoStateStore {
  // 상태
  todos: Todo[];
  isLoading: boolean;
  error: Error | null;
  processedTodos: ProcessedTodos;
  openMenuId: number | null;

  // 순수 setter들
  setTodos: (todos: Todo[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setProcessedTodos: (processedTodos: ProcessedTodos) => void;
  setOpenMenuId: (id: number | null) => void;
}

export const useTodoStateStore = create<TodoStateStore>((set) => ({
  // 초기 상태
  todos: [],
  isLoading: false,
  error: null,
  processedTodos: createInitialProcessedTodos(),
  openMenuId: null,

  // 순수 setter들
  setTodos: (todos) => set({ todos }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setProcessedTodos: (processedTodos) => set({ processedTodos }),
  setOpenMenuId: (openMenuId) => set({ openMenuId }),
}));
