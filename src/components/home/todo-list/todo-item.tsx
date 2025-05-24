import { TodoItem } from '@/types/todo-list';
import React from 'react';
import { IoIosMore } from 'react-icons/io';
import CheckBox from './checkbox';

interface TodoListProps {
  todo: TodoItem;
}
const TodoListItem = ({ todo }: TodoListProps) => {
  return (
    <li className="flex justify-between w-full border-b border-gray-200 last:border-b-0 py-2 select-none">
      <div className="flex items-center gap-3">
        <CheckBox />
        <div className="flex flex-col cursor-pointer truncate max-w-[340px]">
          <span>{todo.content}</span>
          <span>{todo.date}</span>
        </div>
      </div>
      <IoIosMore className="text-xl cursor-pointer" />
    </li>
  );
};

export default TodoListItem;
