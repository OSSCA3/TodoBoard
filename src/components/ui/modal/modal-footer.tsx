import { Button } from '@/components/ui/buttons';

interface ModalFooterProps {
  onClose?: () => void;
  onSubmit?: () => void;
  submitText?: string;
  formId?: string; // form 제출 이벤트를 연결해야 할 때 사용
}

const ModalFooter = ({
  onClose,
  onSubmit,
  submitText = '저장',
  formId,
}: ModalFooterProps) => {
  return (
    <div className="p-4 w-full flex justify-end gap-2">
      <Button variant="secondary" onClick={onClose}>
        닫기
      </Button>
      <Button
        onClick={onSubmit}
        form={formId}
        type={formId ? 'submit' : 'button'}
      >
        {submitText}
      </Button>
    </div>
  );
};

export default ModalFooter;
