import { create } from 'zustand';
import { Todo, PriorityType } from '@/types/todo';
import {
  fetchAllTodosFromApi,
  updateTodoCompletionFromApi,
} from '@/libs/api/todoApi';
import {
  processAllTodos,
  createInitialProcessedTodos,
} from '@/utils/todoProcessor';

// 처리된 데이터 타입
export interface ProcessedTodos {
  high: { incomplete: Todo[]; completed: Todo[] };
  medium: { incomplete: Todo[]; completed: Todo[] };
  low: { incomplete: Todo[]; completed: Todo[] };
  someday: { incomplete: Todo[]; completed: Todo[] };
}

// Todo Store 인터페이스 - 데이터 관리 및 CRUD 전담
interface TodoStore {
  // === 상태 ===
  todos: Todo[];
  isLoading: boolean;
  error: Error | null;
  processedTodos: ProcessedTodos;

  // === API 통신 & 데이터 관리 ===
  fetchAllTodos: () => Promise<void>;
  toggleTodoComplete: (id: number) => Promise<void>;
  moveTodo: (todoId: number, newPriority: PriorityType) => Promise<void>;

  // === CRUD 액션 ===
  addTodo: (priority: PriorityType) => void;
  editTodo: (id: number) => void;
  deleteTodo: (id: number) => void;

  // === 헬퍼 메서드 ===
  getQuadrantTodos: (priority: PriorityType) => Todo[];
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  // === 초기 상태 ===
  todos: [],
  isLoading: false,
  error: null,
  processedTodos: createInitialProcessedTodos(),

  // === API 통신 & 데이터 관리 ===
  fetchAllTodos: async () => {
    set({ isLoading: true, error: null });

    try {
      const fetchedTodos = await fetchAllTodosFromApi();
      const processedData = processAllTodos(fetchedTodos);

      set({
        todos: fetchedTodos,
        processedTodos: processedData,
        isLoading: false,
      });
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to fetch todos');
      set({ error, isLoading: false });
      console.error('Error fetching todos in store:', err);
    }
  },

  toggleTodoComplete: async (id: number) => {
    const { todos } = get();
    const targetTodo = todos.find((todo) => todo.id === id);

    if (!targetTodo) {
      console.error('Todo not found:', id);
      return;
    }

    const newCompletedState = !targetTodo.isCompleted;

    // 낙관적 업데이트: 로컬 상태 즉시 변경
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: newCompletedState } : todo,
    );
    const processedData = processAllTodos(updatedTodos);

    set({
      todos: updatedTodos,
      processedTodos: processedData,
    });

    // 서버 업데이트
    try {
      await updateTodoCompletionFromApi(id, newCompletedState);
      console.log('Todo completion updated successfully');
    } catch (err) {
      console.error('Error updating todo completion:', err);

      // 롤백: 원래 상태로 복원
      const rollbackTodos = todos.map((todo) =>
        todo.id === id
          ? { ...todo, isCompleted: targetTodo.isCompleted }
          : todo,
      );
      const rollbackProcessedData = processAllTodos(rollbackTodos);

      set({
        todos: rollbackTodos,
        processedTodos: rollbackProcessedData,
      });

      // TODO: 더 나은 에러 UI 필요 (토스트/스낵바)
      alert('완료 상태 업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  },

  moveTodo: async (todoId: number, newPriority: PriorityType) => {
    const { todos } = get();
    const targetTodo = todos.find((todo) => todo.id === todoId);

    if (!targetTodo) {
      console.error('Todo not found:', todoId);
      return;
    }

    // 같은 우선순위면 이동할 필요 없음
    if (targetTodo.priority === newPriority) {
      return;
    }

    const originalTodos = [...todos];

    // 낙관적 업데이트: 로컬 상태 즉시 변경
    const updatedTodos = todos.map((todo) =>
      todo.id === todoId ? { ...todo, priority: newPriority } : todo,
    );
    const processedData = processAllTodos(updatedTodos);

    set({
      todos: updatedTodos,
      processedTodos: processedData,
    });

    try {
      // 서버에 우선순위 변경 요청
      const response = await fetch(`/api/todos?id=${todoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority: newPriority }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update todo priority: ${response.status}`);
      }

      console.log('Todo priority updated successfully');
    } catch (err) {
      console.error('Error updating todo priority:', err);

      // 롤백: 원래 상태로 복원
      const rollbackProcessedData = processAllTodos(originalTodos);
      set({
        todos: originalTodos,
        processedTodos: rollbackProcessedData,
      });

      // TODO: 더 나은 에러 UI 필요 (토스트/스낵바)
      alert('할 일 이동에 실패했습니다. 다시 시도해주세요.');
    }
  },

  // === CRUD 액션 ===
  addTodo: (priority: PriorityType) => {
    console.log('할 일 추가 버튼 클릭!', priority);
    // TODO: 나중에 할 일 추가 모달/폼 구현 예정
  },

  editTodo: (id: number) => {
    console.log('편집:', id);
    // TODO: 나중에 편집 모달/폼 구현 예정
  },

  deleteTodo: (id: number) => {
    console.log('삭제:', id);
    // TODO: 나중에 삭제 확인 및 실행 구현 예정
  },

  // === 헬퍼 메서드 ===
  getQuadrantTodos: (priority: PriorityType) => {
    const { processedTodos } = get();
    const priorityData = processedTodos[priority];
    return [...priorityData.incomplete, ...priorityData.completed];
  },
}));
