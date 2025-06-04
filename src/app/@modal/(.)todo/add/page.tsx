'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/inputs';
import { Modal } from '@/components/ui/modal';
import { addTodo } from '@/libs/api/todo';

const UNKNOWN_ERROR_MESSAGE = '할 일을 저장하는 중 오류가 발생했습니다.';

const AddTodoModal = () => {
  const router = useRouter();

  const saveTodo = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const formData = new FormData(formEvent.currentTarget);
    const title = formData.get('title')?.toString().trim();
    const deadline = formData.get('deadline')?.toString().trim();

    if (!title || !deadline) {
      alert('제목과 마감일을 모두 입력해주세요.');
      return;
    }
    try {
      await addTodo(title, deadline);
      router.back(); // 할일 저장 후 이전 페이지로 리다이렉트
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        return;
      }
      alert(UNKNOWN_ERROR_MESSAGE);
    }
  };

  return (
    <Modal title="할일 추가" formId="add-todo-form" submitText="할일 저장">
      <form
        className="flex flex-col gap-4"
        id="add-todo-form"
        onSubmit={saveTodo}
      >
        <label htmlFor="todo-title" className="block font-medium text-black">
          제목
        </label>
        <Input
          type="text"
          placeholder="제목을 입력하세요"
          id="todo-title"
          name="title"
        />
        <label htmlFor="todo-deadline" className="block font-medium text-black">
          마감일
        </label>
        <Input type="date" id="todo-deadline" name="deadline" />
      </form>
    </Modal>
  );
};

export default AddTodoModal;
