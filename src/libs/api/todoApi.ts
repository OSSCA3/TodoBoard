import { Todo } from '@/types/todo';

const API_BASE_URL = '/api';

export async function fetchAllTodosFromApi(): Promise<Todo[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/todos`);

    if (!Array.isArray(response.json)) {
      throw new Error('유효하지 않은 API 응답 형식입니다');
    }

    const data = await response.json();
    return data.todos.map((todo: any) => ({
      ...todo,
    }));
  } catch (error) {
    console.error('Error in fetchAllTodosFromApi:', error);
    throw error;
  }
}
