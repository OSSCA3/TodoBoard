import { DevNewsItem } from '@/types/dev-news';
import axios from 'axios';

const API_BASE_URL = 'https://dev.to/api/articles';
const DEFAULT_TAG = 'javascript';
const DEFAULT_PER_PAGE = 10;

export const fetchDevNews = async (): Promise<DevNewsItem[]> => {
  try {
    const response = await axios.get<DevNewsItem[]>(API_BASE_URL, {
      params: {
        tag: DEFAULT_TAG,
        per_page: DEFAULT_PER_PAGE,
      },
    });

    // 응답 데이터 검증
    if (!Array.isArray(response.data)) {
      throw new Error('유효하지 않은 API 응답 형식입니다');
    }

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Dev.to API 요청 실패:', err.response?.status, err.message);
      throw new Error(`API 요청 실패: ${err.response?.status || 'Unknown'}`);
    } else {
      console.error('예상치 못한 오류:', err);
      throw new Error('오류가 발생했습니다');
    }
  }
};
