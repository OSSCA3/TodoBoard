import { Todo } from '@/types/todo';

const API_BASE_URL = '/api';

export async function fetchAllTodosFromApi(): Promise<Todo[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/todos`);

    const data = await response.json();

    if (!Array.isArray(data.todos)) {
      throw new Error('유효하지 않은 API 응답 형식입니다');
    }

    return data.todos.map((todo: any) => ({
      ...todo,
    }));
  } catch (error) {
    console.error('Error in fetchAllTodosFromApi:', error);
    throw error;
  }
}

export async function updateTodoCompletionFromApi(
  id: number,
  isCompleted: boolean,
): Promise<Todo> {
  try {
    const response = await fetch(`${API_BASE_URL}/todos?id=${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isCompleted }),
    });

    if (!response.ok) {
      throw new Error(`Todo 업데이트 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in updateTodoCompletionFromApi:', error);
    throw error;
  }
}
