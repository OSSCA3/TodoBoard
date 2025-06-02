import { create } from 'zustand';
import { Todo } from '@/types/todo';
import { fetchAllTodosFromApi } from '@/libs/api/todoApi';

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  error: Error | null;

  fetchAllTodos: () => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,

  fetchAllTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const fetchedTodos = await fetchAllTodosFromApi();
      set({ todos: fetchedTodos, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err : new Error('Failed to fetch todos'),
        isLoading: false,
      });
      console.error('Error fetching todos in store:', err);
    }
  },
}));
