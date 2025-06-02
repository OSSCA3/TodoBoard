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
  // 공통 헬퍼 함수들
  const updateTodos = (todos: Todo[]) =>
    set({ todos, processedTodos: processAllTodos(todos) });
  const findTodo = (id: number) => get().todos.find((todo) => todo.id === id);
  const handleError = (err: unknown, rollback: Todo[], message: string) => {
    console.error(err);
    updateTodos(rollback);
    alert(message);
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
        const todos = await fetchAllTodosFromApi();
        set({
          todos,
          processedTodos: processAllTodos(todos),
          isLoading: false,
        });
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to fetch todos');
        set({ error, isLoading: false });
        console.error('Error fetching todos:', err);
      }
    },

    toggleTodoComplete: async (id: number) => {
      const todo = findTodo(id);
      if (!todo) return console.error('Todo not found:', id);

      const originalTodos = get().todos;
      const newCompleted = !todo.isCompleted;

      // 낙관적 업데이트
      updateTodos(
        originalTodos.map((t) =>
          t.id === id ? { ...t, isCompleted: newCompleted } : t,
        ),
      );

      try {
        await updateTodoCompletionFromApi(id, newCompleted);
      } catch (err) {
        handleError(err, originalTodos, '완료 상태 업데이트에 실패했습니다.');
      }
    },

    moveTodo: async (todoId: number, newPriority: PriorityType) => {
      const todo = findTodo(todoId);
      if (!todo || todo.priority === newPriority) return;

      const originalTodos = get().todos;

      // 낙관적 업데이트
      updateTodos(
        originalTodos.map((todo) =>
          todo.id === todoId ? { ...todo, priority: newPriority } : todo,
        ),
      );

      try {
        const response = await fetch(`/api/todos?id=${todoId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priority: newPriority }),
        });
        if (!response.ok)
          throw new Error(`Failed to update: ${response.status}`);
      } catch (err) {
        handleError(err, originalTodos, '할 일 이동에 실패했습니다.');
      }
    },

    // === CRUD 액션 ===
    addTodo: (priority: PriorityType) => {
      console.log('할 일 추가:', priority);
      // TODO: 추가 모달/폼 구현 예정
    },

    editTodo: (id: number) => {
      console.log('편집:', id);
      // TODO: 편집 모달/폼 구현 예정
    },

    deleteTodo: (id: number) => {
      console.log('삭제:', id);
      // TODO: 삭제 확인 및 실행 구현 예정
    },

    // === 헬퍼 메서드 ===
    getQuadrantTodos: (priority: PriorityType) => {
      const { processedTodos } = get();
      const data = processedTodos[priority];
      return [...data.incomplete, ...data.completed];
    },
  };
});
