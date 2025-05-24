import { BookmarkItem } from '@/types/bookmark';
import React from 'react';

interface BookMarkCardProps {
  bookmark: BookmarkItem;
}
const BookMarkCard = ({ bookmark }: BookMarkCardProps) => {
  return (
    <div className="min-w-[200px] max-w-[270px] border rounded min-h-28 max-h-32 flex gap-2 justify-between items-center p-6">
      <div>
        <div>{bookmark.title}</div>
        <div>{bookmark.description}</div>
      </div>
      <div>,,,</div>
    </div>
  );
};

export default BookMarkCard;
