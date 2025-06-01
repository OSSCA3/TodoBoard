import { Memo } from '@/types/memo';
import React from 'react';
import { IoIosMore } from 'react-icons/io';

interface MemoListProps {
  memo: Memo;
}
const MemoListItem = ({ memo }: MemoListProps) => {
  return (
    <li className="gap-2 flex justify-between w-full items-center border-b border-gray-200 last:border-b-0 py-2 select-none">
      <div className="w-full flex flex-col cursor-pointer">
        <span className="font-semibold">{memo.title}</span>
        <span className="truncate max-w-[340px]">{memo.content}</span>
      </div>
      <IoIosMore
        className="text-xl cursor-pointer hover:text-gray-400 flex-shrink-0"
        aria-label="메모 옵션"
        role="button"
      />
    </li>
  );
};

export default MemoListItem;
