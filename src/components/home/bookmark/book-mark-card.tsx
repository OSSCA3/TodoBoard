import { BookmarkItem } from '@/types/bookmark';
import React from 'react';
import { IoIosMore } from 'react-icons/io';

interface BookMarkCardProps {
  bookmark: BookmarkItem;
}
const BookMarkCard = ({ bookmark }: BookMarkCardProps) => {
  return (
    <div className="w-full border rounded min-h-28 max-h-32 flex justify-between items-center p-6 mt-4">
      <div className="cursor-pointer">
        <div>{bookmark.title}</div>
        <div>{bookmark.description}</div>
      </div>

      <IoIosMore
        className="text-xl cursor-pointer hover:text-gray-400 flex-shrink-0"
        aria-label="북마크 옵션"
        role="button"
      />
    </div>
  );
};

export default BookMarkCard;
