import { PropsWithChildren } from 'react';

interface MemoContentProps extends PropsWithChildren {
  isError?: boolean;
}

const MemoContent = ({ isError, children }: MemoContentProps) => {
  return (
    <p
      className={`w-96 max-h-40 overflow-y-auto ${isError ? 'text-red-500' : 'text-black'}`}
    >
      {children}
    </p>
  );
};

export default MemoContent;
