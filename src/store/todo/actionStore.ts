import { create } from 'zustand';
import { PriorityType } from '@/types/todo';
import {
  fetchAllTodosFromApi,
  updateTodoCompletionFromApi,
} from '@/libs/api/todoApi';
import { processAllTodos } from '@/utils/todoProcessor';
import { useTodoStateStore } from './stateStore';

// 비즈니스 로직 타입
interface TodoActionStore {
  // 비즈니스 액션들
  fetchAllTodos: () => Promise<void>;
  toggleTodoComplete: (id: number) => Promise<void>;
  addTodo: (priority: PriorityType) => void;
  editTodo: (id: number) => void;
  deleteTodo: (id: number) => void;

  // 메뉴 비즈니스 로직
  toggleMenu: (id: number) => void;
  closeMenu: () => void;
}

export const useTodoActionStore = create<TodoActionStore>(() => ({
  fetchAllTodos: async () => {
    const stateStore = useTodoStateStore.getState();

    stateStore.setLoading(true);
    stateStore.setError(null);

    try {
      const fetchedTodos = await fetchAllTodosFromApi();
      const processedData = processAllTodos(fetchedTodos);

      stateStore.setTodos(fetchedTodos);
      stateStore.setProcessedTodos(processedData);
      stateStore.setLoading(false);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to fetch todos');
      stateStore.setError(error);
      stateStore.setLoading(false);
      console.error('Error fetching todos in store:', err);
    }
  },

  toggleTodoComplete: async (id: number) => {
    const stateStore = useTodoStateStore.getState();
    const targetTodo = stateStore.todos.find((todo) => todo.id === id);

    if (!targetTodo) {
      console.error('Todo not found:', id);
      return;
    }

    const newCompletedState = !targetTodo.isCompleted;

    // 로컬 상태 즉시 업데이트
    const updatedTodos = stateStore.todos.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: newCompletedState } : todo,
    );
    const processedData = processAllTodos(updatedTodos);

    stateStore.setTodos(updatedTodos);
    stateStore.setProcessedTodos(processedData);

    // 서버 업데이트
    try {
      await updateTodoCompletionFromApi(id, newCompletedState);
      console.log('Todo completion updated successfully');
    } catch (err) {
      console.error('Error updating todo completion:', err);

      // 롤백
      const rollbackTodos = stateStore.todos.map((todo) =>
        todo.id === id
          ? { ...todo, isCompleted: targetTodo.isCompleted }
          : todo,
      );
      const rollbackProcessedData = processAllTodos(rollbackTodos);

      stateStore.setTodos(rollbackTodos);
      stateStore.setProcessedTodos(rollbackProcessedData);

      alert('완료 상태 업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  },

  addTodo: (priority: PriorityType) => {
    console.log('할 일 추가 버튼 클릭!', priority);
    // TODO: 나중에 할 일 추가 모달/폼 구현 예정
  },

  editTodo: (id: number) => {
    console.log('편집:', id);
    useTodoStateStore.getState().setOpenMenuId(null);
    // TODO: 나중에 편집 모달/폼 구현 예정
  },

  deleteTodo: (id: number) => {
    console.log('삭제:', id);
    useTodoStateStore.getState().setOpenMenuId(null);
    // TODO: 나중에 삭제 확인 및 실행 구현 예정
  },

  // 메뉴 비즈니스 로직
  toggleMenu: (id: number) => {
    const stateStore = useTodoStateStore.getState();
    const currentOpenId = stateStore.openMenuId;
    stateStore.setOpenMenuId(currentOpenId === id ? null : id);
  },

  closeMenu: () => {
    useTodoStateStore.getState().setOpenMenuId(null);
  },
}));
