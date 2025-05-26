import { HTMLAttributes, PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import ModalHeader from './modal-header';
import ModalBody from './modal-body';
import ModalFooter from './modal-footer';

interface ModalProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  title: string;
  onClose?: () => void;
  onSubmit?: () => void;
  submitText?: string;
  formId?: string; // form 제출 이벤트를 연결해야 할 때 사용
}

const Modal = ({
  title,
  onClose,
  onSubmit,
  formId,
  submitText,
  className,
  children,
  ...props
}: ModalProps) => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-header"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#3b3b3b]/60"
      onClick={onClose || goBack}
    >
      <div
        className={`rounded-2xl bg-[#FFFEFE] max-w-xl min-w-96 ${className || ''}`}
        onClick={(clickEvent) => clickEvent.stopPropagation()} // NOTE : modal content 클릭 시에 overlay로 클릭 이벤트가 전파되지 않도록 함
        {...props}
      >
        <ModalHeader title={title} />
        <ModalBody>{children}</ModalBody>
        <ModalFooter
          onClose={onClose || goBack}
          onSubmit={onSubmit}
          submitText={submitText}
          formId={formId}
        />
      </div>
    </div>
  );
};

export default Modal;
