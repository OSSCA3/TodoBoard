'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input, TextArea } from '@/components/ui/inputs';
import { Modal } from '@/components/ui/modal/index';
import { MEMO_CONTENT_MAX_LENGTH } from '@/constants/memo';
import { addMemo } from '@/libs/api/memo';

const UNKNOWN_ERROR_MESSAGE = '메모를 저장하는 중 오류가 발생했습니다.';

const AddMemoModal = () => {
  const router = useRouter();

  const saveMemo = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();

    const formData = new FormData(formEvent.currentTarget);
    const title = formData.get('title')?.toString().trim();
    const content = formData.get('content')?.toString().trim();

    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    if (content.length > MEMO_CONTENT_MAX_LENGTH) {
      alert(`내용은 ${MEMO_CONTENT_MAX_LENGTH}자 이내로 입력해주세요.`);
      return;
    }

    try {
      await addMemo(title, content);
      router.back(); // 북마크 저장 후 이전 페이지로 리다이렉트
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
        return;
      }
      alert(UNKNOWN_ERROR_MESSAGE);
    }
  };

  return (
    <Modal title="메모 추가" submitText="메모 저장" formId="add-memo-form">
      <form
        className="flex flex-col gap-4"
        onSubmit={saveMemo}
        id="add-memo-form"
      >
        <label htmlFor="memo-title" className="block font-medium text-black">
          제목
        </label>
        <Input
          type="text"
          placeholder="제목을 입력하세요"
          id="memo-title"
          name="title"
        />
        <label htmlFor="memo-content" className="block font-medium text-black">
          내용
        </label>
        <TextArea
          maxLength={MEMO_CONTENT_MAX_LENGTH}
          placeholder="내용을 입력하세요"
          id="memo-content"
          name="content"
          rows={3}
        />
      </form>
    </Modal>
  );
};

export default AddMemoModal;
