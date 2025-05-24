import { BookmarkItem } from '@/types/bookmark';
import React from 'react';
import { IoIosMore } from 'react-icons/io';

interface BookMarkCardProps {
  bookmark: BookmarkItem;
}
const BookMarkCard = ({ bookmark }: BookMarkCardProps) => {
  return (
    <div className="min-w-[200px] max-w-[270px] border rounded min-h-28 max-h-32 flex justify-between items-center p-6 mt-4">
      <div className="cursor-pointer">
        <div>{bookmark.title}</div>
        <div>{bookmark.description}</div>
      </div>

      <IoIosMore className="text-xl cursor-pointer" />
    </div>
  );
};

export default BookMarkCard;
