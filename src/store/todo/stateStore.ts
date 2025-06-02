import { create } from 'zustand';
import { Todo } from '@/types/todo';
import { createInitialProcessedTodos } from '@/utils/todoProcessor';
import { ProcessedTodos, DropHintState } from './typeStore';
import { DragState } from '@/types/dnd';

// 순수 상태 관리 타입
interface TodoStateStore {
  // 상태
  todos: Todo[];
  isLoading: boolean;
  error: Error | null;
  processedTodos: ProcessedTodos;

  // 드래그 상태
  dragState: DragState;

  // 드롭 힌트 상태
  dropHintState: DropHintState;

  // 순수 setter들
  setTodos: (todos: Todo[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setProcessedTodos: (processedTodos: ProcessedTodos) => void;
  setDragState: (dragState: Partial<DragState>) => void;
  setDropHintState: (dropHintState: Partial<DropHintState>) => void;
}

export const useTodoStateStore = create<TodoStateStore>((set) => ({
  // 초기 상태
  todos: [],
  isLoading: false,
  error: null,
  processedTodos: createInitialProcessedTodos(),
  dragState: {
    isDragging: false,
    draggedTodoId: null,
    targetPriority: null,
  },
  dropHintState: {
    isVisible: false,
    targetPriority: null,
    insertPosition: null,
  },

  // 순수 setter들
  setTodos: (todos) => set({ todos }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setProcessedTodos: (processedTodos) => set({ processedTodos }),
  setDragState: (newDragState) =>
    set((state) => ({
      dragState: { ...state.dragState, ...newDragState },
    })),
  setDropHintState: (newDropHintState) =>
    set((state) => ({
      dropHintState: { ...state.dropHintState, ...newDropHintState },
    })),
}));
