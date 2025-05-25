import { DevNewsItem } from '@/types/dev-news';
import { default as axios } from 'axios';

export const fetchDevNews = async (): Promise<DevNewsItem[]> => {
  try {
    const response = await axios.get<DevNewsItem[]>(
      'https://dev.to/api/articles',
      {
        params: {
          tag: 'javascript',
          per_page: 10,
        },
      },
    );
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.message);
    } else {
      throw new Error('오류가 발생했습니다');
    }
  }
};
