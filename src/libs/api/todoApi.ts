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
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.details ||
        errorData?.error ||
        `Failed to update todo completion status: ${response.status}`;
      throw new Error(errorMessage);
    }

    const updatedTodo = await response.json();
    return updatedTodo;
  } catch (error) {
    console.error('Error in updateTodoCompletionFromApi:', error);
    throw error;
  }
}
