'use client';

import { FormEvent } from 'react';
import { Input, TextArea } from '@/components/ui/inputs';
import { Modal } from '@/components/ui/modal/index';
import { MEMO_CONTENT_MAX_LENGTH } from '@/constants/memo';

const AddMemoModal = () => {
  const saveMemo = (formEvent: FormEvent<HTMLFormElement>) => {
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

    console.log('[TODO] 메모 저장 로직 추가: ', { title, content }); // TODO
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
