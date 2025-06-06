import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { mockBookmarkData } from '@/mocks/dashboard';
import { Button } from '@/components/ui/buttons';
import BookMarkCard from './book-mark-card';

const BookMark = () => {
  return (
    <div className="rounded-xl h-full">
      <div className="flex justify-between items-center">
        <h2>북마크</h2>
        <Button
          variant="link"
          href="/bookmark/add"
          scroll={false} // NOTE : 모달로 사용하기 위한 스크롤 방지 (https://github.com/shadcn-ui/ui/issues/1355)
          className="text-xl cursor-pointer"
        >
          <FiPlus />
        </Button>
      </div>
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
        {mockBookmarkData.map((bookmark) => (
          <BookMarkCard key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>
    </div>
  );
};

export default BookMark;
