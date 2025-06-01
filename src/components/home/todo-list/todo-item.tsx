'use client';

import { TodoItem } from '@/types/todo-list';
import React, { useState } from 'react';
import { IoIosMore } from 'react-icons/io';
import CheckBox from './checkbox';

interface TodoListProps {
  todo: TodoItem;
}
const TodoListItem = ({ todo }: TodoListProps) => {
  const [isCompleted, setIsCompleted] = useState(todo.isCompleted);

  const handleIsCompleted = () => {
    setIsCompleted((prev) => !prev);
  };

  return (
    <li className="flex justify-between w-full border-b border-gray-200 last:border-b-0 py-2 select-none mt-1">
      <div className="flex items-center gap-3">
        <CheckBox isCompleted={isCompleted} onClick={handleIsCompleted} />
        <div className="flex flex-col cursor-pointer truncate max-w-[340px]">
          <span>{todo.title}</span>
          <span>{todo.dueDate} 까지</span>
        </div>
      </div>
      <IoIosMore
        className="text-xl cursor-pointer hover:text-gray-400 flex-shrink-0"
        aria-label="Todo 옵션"
        role="button"
      />
    </li>
  );
};

export default TodoListItem;
