import { mockMemoData } from '@/mocks/memo';
import React from 'react';
import { FiPlus } from 'react-icons/fi';
import MemoListItem from './memo-item';

const Memo = () => {
  return (
    <div className="rounded-xl h-full w-full">
      <div className="flex justify-between items-center">
        <h2>메모</h2>
        <button className="text-xl cursor-pointer">
          <FiPlus />
        </button>
      </div>
      <ul className="flex flex-col justify-between items-start">
        {mockMemoData.map((memo) => (
          <MemoListItem key={memo.id} memo={memo} />
        ))}
      </ul>
    </div>
  );
};

export default Memo;
