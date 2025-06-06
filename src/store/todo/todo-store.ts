import { create } from 'zustand';
import { Todo, PriorityType } from '@/types/todo';
import { fetchTodos, updateTodoStatus } from '@/libs/api/todo-api';
import { processAll, createInitialGroups } from '@/utils/todo-processor';
import { addTodo } from '@/libs/api/todo';

// 그룹화된 데이터 타입
export interface GroupedTodos {
  high: { incomplete: Todo[]; completed: Todo[] };
  medium: { incomplete: Todo[]; completed: Todo[] };
  low: { incomplete: Todo[]; completed: Todo[] };
  someday: { incomplete: Todo[]; completed: Todo[] };
}

// Todo Store 인터페이스
interface TodoStore {
  // === 상태 ===
  todos: Todo[];
  isLoading: boolean;
  error: Error | null;
  groupedTodos: GroupedTodos;

  // === API 통신 & 데이터 관리 ===
  fetchAll: () => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  moveTodo: (todoId: string, newPriority: PriorityType) => Promise<void>;

  // === CRUD 액션 ===
  addTodo: (newTodo: Todo, priority: PriorityType) => void;
  editTodo: (id: string) => void;
  deleteTodo: (id: string) => void;

  // === 헬퍼 메서드 ===
  getQuadrantTodos: (priority: PriorityType) => Todo[];
}

export const useTodoStore = create<TodoStore>((set, get) => {
  // 공통 헬퍼 함수들
  const updateTodos = (todos: Todo[]) =>
    set({ todos, groupedTodos: processAll(todos) });
  const findTodo = (id: string) => get().todos.find((todo) => todo.id === id);
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
    groupedTodos: createInitialGroups(),

    // === API 통신 & 데이터 관리 ===
    fetchAll: async () => {
      set({ isLoading: true, error: null });
      try {
        const todos = await fetchTodos();
        set({
          todos,
          groupedTodos: processAll(todos),
          isLoading: false,
        });
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to fetch todos');
        set({ error, isLoading: false });
        console.error('Error fetching todos:', err);
      }
    },

    toggleComplete: async (id: string) => {
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
        await updateTodoStatus(id, newCompleted);
      } catch (err) {
        handleError(err, originalTodos, '완료 상태 업데이트에 실패했습니다.');
      }
    },

    moveTodo: async (todoId: string, newPriority: PriorityType) => {
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
    addTodo: async (newTodo: Todo, priority: PriorityType) => {
      try {
        // API 호출
        await addTodo(newTodo.title, newTodo.dueDate, priority);
        // 업데이트
        const todos = get().todos;
        const updatedTodos = [...todos, { ...newTodo, priority }];
        updateTodos(updatedTodos);
      } catch (error) {
        handleError(
          error,
          get().todos,
          '할 일을 추가하는 중 오류가 발생했습니다.',
        );
      }
    },

    editTodo: (id: string) => {
      console.log('편집:', id);
      // TODO: 편집 모달/폼 구현 예정
    },

    deleteTodo: (id: string) => {
      console.log('삭제:', id);
      // TODO: 삭제 확인 및 실행 구현 예정
    },

    // === 헬퍼 메서드 ===
    getQuadrantTodos: (priority: PriorityType) => {
      const { groupedTodos } = get();
      const data = groupedTodos[priority];
      return [...data.incomplete, ...data.completed];
    },
  };
});
