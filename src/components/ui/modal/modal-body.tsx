import { PropsWithChildren } from 'react';

const ModalBody = ({ children, ...props }: PropsWithChildren) => {
  return (
    <div className="p-4 overflow-y-auto border-y border-y-[#8B5CF6]" {...props}>
      {children}
    </div>
  );
};

export default ModalBody;
