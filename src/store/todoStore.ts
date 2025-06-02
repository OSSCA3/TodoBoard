import { create } from 'zustand';
import { Todo, PriorityType } from '@/types/todo';
import {
  fetchAllTodosFromApi,
  updateTodoCompletionFromApi,
} from '@/libs/api/todoApi'; // API 호출 함수 임포트
import { formatDate } from '@/utils/todoFormatter'; // formatDate import
import {
  processAllTodos,
  createInitialProcessedTodos,
} from '@/utils/todoProcessor'; // 데이터 처리 함수들 import

// ===== 1. 유틸리티 헬퍼 함수들 =====

// ===== 2. 스토어 타입 정의 =====

interface TodoState {
  // 원본 데이터
  todos: Todo[];
  isLoading: boolean;
  error: Error | null;

  // 처리된 데이터들 (완료/미완료 분리)
  processedTodos: {
    high: { incomplete: Todo[]; completed: Todo[] };
    medium: { incomplete: Todo[]; completed: Todo[] };
    low: { incomplete: Todo[]; completed: Todo[] };
    someday: { incomplete: Todo[]; completed: Todo[] };
  };

  // 메뉴 상태 관리 (전역)
  openMenuId: number | null;

  // 액션
  fetchAllTodos: () => Promise<void>;
  addTodo: (priority: PriorityType) => void;

  // Todo 아이템 액션
  toggleTodoComplete: (id: number) => Promise<void>;
  editTodo: (id: number) => void;
  deleteTodo: (id: number) => void;

  // 메뉴 액션
  setOpenMenuId: (id: number | null) => void;
  toggleMenu: (id: number) => void;
  closeMenu: () => void;
}

// ===== 3. 스토어 생성 =====
export const useTodoStore = create<TodoState>((set, get) => ({
  // 초기 상태
  todos: [],
  isLoading: false,
  error: null,
  // 초기 처리된 데이터들
  processedTodos: createInitialProcessedTodos(),
  // 메뉴 상태 관리 (전역)
  openMenuId: null,
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
  addTodo: (priority: PriorityType) => {
    console.log('할 일 추가 버튼 클릭!', priority);
    // TODO: 나중에 할 일 추가 모달/폼 구현 예정
    // 1. 새로운 todo 객체 생성
    // 2. API 호출하여 서버에 저장
    // 3. 성공 시 로컬 상태 업데이트 및 재정렬
  },
  // 메뉴 액션
  setOpenMenuId: (id: number | null) => {
    set({ openMenuId: id });
  },
  toggleMenu: (id: number) => {
    const currentOpenId = get().openMenuId;
    set({ openMenuId: currentOpenId === id ? null : id });
  },
  closeMenu: () => {
    set({ openMenuId: null });
  },
  // Todo 아이템 액션
  toggleTodoComplete: async (id: number) => {
    const state = get();
    const targetTodo = state.todos.find((todo) => todo.id === id);

    if (!targetTodo) {
      console.error('Todo not found:', id);
      return;
    }

    const newCompletedState = !targetTodo.isCompleted;

    // 먼저 로컬 상태 업데이트 (UI 즉시 반영)
    const updatedTodos = state.todos.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: newCompletedState } : todo,
    );

    const processedData = processAllTodos(updatedTodos);
    set({
      todos: updatedTodos,
      processedTodos: processedData,
    });

    // 서버 업데이트 (백그라운드)
    try {
      await updateTodoCompletionFromApi(id, newCompletedState);
      console.log('Todo completion updated successfully');
    } catch (err) {
      console.error('Error updating todo completion:', err);

      // 서버 업데이트 실패 시 원래 상태로 롤백
      const rollbackTodos = state.todos.map((todo) =>
        todo.id === id
          ? { ...todo, isCompleted: targetTodo.isCompleted }
          : todo,
      );
      const rollbackProcessedData = processAllTodos(rollbackTodos);
      set({
        todos: rollbackTodos,
        processedTodos: rollbackProcessedData,
      });

      // 사용자에게 에러 알림 (추후 토스트 등으로 개선)
      alert('완료 상태 업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  },
  editTodo: (id: number) => {
    console.log('편집:', id);
    // 메뉴 닫기
    set({ openMenuId: null });
    // TODO: 나중에 편집 모달/폼 구현 예정
  },
  deleteTodo: (id: number) => {
    console.log('삭제:', id);
    // 메뉴 닫기
    set({ openMenuId: null });
    // TODO: 나중에 삭제 확인 및 실행 구현 예정
  },
}));
