import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { mockBookmarkData } from '@/mocks/dashboard';
import BookMarkCard from './book-mark-card';

const BookMark = () => {
  return (
    <div className="rounded-xl h-full">
      <div className="flex justify-between items-center">
        <h2>북마크</h2>
        <FiPlus className="text-xl cursor-pointer" />
      </div>
      <div className="grid justify-items-center grid-cols-2 gap-2">
        {mockBookmarkData.map((bookmark) => (
          <BookMarkCard bookmark={bookmark} />
        ))}
      </div>
    </div>
  );
};

export default BookMark;
