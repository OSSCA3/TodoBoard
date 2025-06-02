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

export const useTodoStore = create<TodoStore>((set, get) => {
  // === 공통 헬퍼 함수들 ===
  const updateTodosAndProcess = (todos: Todo[]) => {
    const processedData = processAllTodos(todos);
    set({ todos, processedTodos: processedData });
  };

  const findTodoById = (id: number): Todo | undefined => {
    return get().todos.find((todo) => todo.id === id);
  };

  const handleApiError = (
    error: unknown,
    rollbackTodos: Todo[],
    message: string,
  ) => {
    console.error(error);
    updateTodosAndProcess(rollbackTodos);
    alert(message); // TODO: 토스트로 교체 예정
  };

  return {
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
      const targetTodo = findTodoById(id);
      if (!targetTodo) {
        console.error('Todo not found:', id);
        return;
      }

      const originalTodos = get().todos;
      const newCompletedState = !targetTodo.isCompleted;

      // 낙관적 업데이트
      const updatedTodos = originalTodos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: newCompletedState } : todo,
      );
      updateTodosAndProcess(updatedTodos);

      try {
        await updateTodoCompletionFromApi(id, newCompletedState);
      } catch (err) {
        handleApiError(
          err,
          originalTodos,
          '완료 상태 업데이트에 실패했습니다.',
        );
      }
    },

    moveTodo: async (todoId: number, newPriority: PriorityType) => {
      const targetTodo = findTodoById(todoId);
      if (!targetTodo) {
        console.error('Todo not found:', todoId);
        return;
      }

      if (targetTodo.priority === newPriority) {
        return;
      }

      const originalTodos = get().todos;

      // 낙관적 업데이트
      const updatedTodos = originalTodos.map((todo) =>
        todo.id === todoId ? { ...todo, priority: newPriority } : todo,
      );
      updateTodosAndProcess(updatedTodos);

      try {
        const response = await fetch(`/api/todos?id=${todoId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priority: newPriority }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update todo priority: ${response.status}`);
        }
      } catch (err) {
        handleApiError(err, originalTodos, '할 일 이동에 실패했습니다.');
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
  };
});
