'use client';

import { FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/inputs';
import { Modal } from '@/components/ui/modal';
import { addTodo } from '@/libs/api/todo';
import { Priorities, PriorityType } from '@/types/todo';

const UNKNOWN_ERROR_MESSAGE = '할 일을 저장하는 중 오류가 발생했습니다.';

const AddTodoModal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const priority = searchParams.get('priority');
  if (!(priority && Priorities.includes(priority as PriorityType))) {
    alert('유효하지 않은 접근입니다.');
    router.back(); // 잘못된 우선순위로 접근 시 이전 페이지로 리다이렉트
    return;
  }

  const saveTodo = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const formData = new FormData(formEvent.currentTarget);
    const title = formData.get('title')?.toString().trim();
    const dueDate = formData.get('dueDate')?.toString().trim();

    if (!title || !dueDate) {
      alert('제목과 마감일을 모두 입력해주세요.');
      return;
    }
    try {
      await addTodo(title, dueDate, priority as PriorityType);
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
        <label htmlFor="todo-dueDate" className="block font-medium text-black">
          마감일
        </label>
        <Input type="date" id="todo-dueDate" name="dueDate" />
      </form>
    </Modal>
  );
};

export default AddTodoModal;
