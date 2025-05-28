'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/inputs';
import { Modal } from '@/components/ui/modal';
import { addBookmark } from '@/libs/api/bookmark';

const UNKNOWN_ERROR_MESSAGE = '북마크를 저장하는 중 오류가 발생했습니다.';

const AddBookmarkModal = () => {
  const router = useRouter();

  const saveBookmark = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();

    const formData = new FormData(formEvent.currentTarget);
    const title = formData.get('title')?.toString().trim();
    const url = formData.get('url')?.toString().trim();

    if (!title || !url) {
      alert('제목과 URL을 모두 입력해주세요.');
      return;
    }

    try {
      await addBookmark(title, url);
      router.back(); // 북마크 저장 후 이전 페이지로 리다이렉트
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        return;
      }
      alert(UNKNOWN_ERROR_MESSAGE);
    }
  };

  return (
    <Modal
      title="북마크 추가"
      submitText="북마크 저장"
      formId="add-bookmark-form"
    >
      <form
        className="flex flex-col gap-4"
        id="add-bookmark-form"
        onSubmit={saveBookmark}
      >
        <label htmlFor="bookmark-title">제목</label>
        <Input
          type="text"
          placeholder="제목을 입력하세요"
          id="bookmark-title"
          name="title"
        />
        <label htmlFor="bookmark-url">URL</label>
        <Input
          type="url"
          placeholder="https://example.com"
          id="bookmark-url"
          name="url"
        />
      </form>
    </Modal>
  );
};

export default AddBookmarkModal;
