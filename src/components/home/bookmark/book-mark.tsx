import React from 'react';
import { mockBookmarkData } from '@/mocks/dashboard';
import BookMarkCard from './book-mark-card';

const BookMark = () => {
  return (
    <div className="rounded-xl h-full">
      <h2>북마크</h2>
      <div className="grid justify-items-center grid-cols-2 gap-2">
        {mockBookmarkData.map((bookmark) => (
          <BookMarkCard bookmark={bookmark} />
        ))}
      </div>
    </div>
  );
};

export default BookMark;
