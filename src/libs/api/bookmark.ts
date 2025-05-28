import axios from 'axios';

const BOOKMARK_ADD_ERROR_MESSAGE = '북마크를 추가하지 못했습니다.';

export const addBookmark = async (title: string, url: string) => {
  try {
    await axios.post('http://localhost:3000/api/bookmark/add', {
      title,
      url,
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || BOOKMARK_ADD_ERROR_MESSAGE,
      );
    }
    throw new Error(BOOKMARK_ADD_ERROR_MESSAGE);
  }
};
