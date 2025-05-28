import { Memo } from '@/types/memo';
import axios, { isAxiosError } from 'axios';

const MEMO_FETCH_ERROR_MESSAGE = '메모를 불러오지 못했습니다.';

export const fetchMemo = async (id: string): Promise<Memo> => {
  try {
    const response = await axios.get<Memo>(
      `http://localhost:3000/api/memo/${id}`,
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.message || MEMO_FETCH_ERROR_MESSAGE);
    }
    throw new Error(MEMO_FETCH_ERROR_MESSAGE);
  }
};
