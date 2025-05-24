import { MemoItem } from '@/types/memo';
import React from 'react';
import { IoIosMore } from 'react-icons/io';

interface MemoListProps {
  memo: MemoItem;
}
const MemoListItem = ({ memo }: MemoListProps) => {
  return (
    <li className="flex justify-between w-full items-center border-b border-gray-200 last:border-b-0 py-2">
      <div className="flex flex-col">
        <span className="font-semibold">{memo.title}</span>
        <span>{memo.content}</span>
      </div>
      <IoIosMore className="text-xl cursor-pointer" />
    </li>
  );
};

export default MemoListItem;
