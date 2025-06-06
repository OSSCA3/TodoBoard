import axios, { isAxiosError } from 'axios';
import { PriorityType } from '@/types/todo';

const TODO_ADD_ERROR_MESSAGE = '할 일을 추가하지 못했습니다.';

export const addTodo = async (
  title: string,
  dueDate: string,
  priority: PriorityType,
) => {
  try {
    await axios.post('http://localhost:3000/api/todo/add', {
      title,
      dueDate,
      priority,
    });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.message || TODO_ADD_ERROR_MESSAGE);
    }
    throw new Error(TODO_ADD_ERROR_MESSAGE);
  }
};
