import { Modal } from '@/components/ui/modal';
import { fetchMemo } from '@/libs/api/memo';
import MemoContent from '@/components/modal/memo/memo-content';

const MEMO_NOT_FOUND_MESSAGE = '메모를 찾을 수 없습니다.';
const UNKNOWN_ERROR_MESSAGE = '알 수 없는 오류가 발생했습니다.';

interface MemoModalProps {
  params: {
    id: string;
  };
}

const MemoModal = async ({ params }: MemoModalProps) => {
  try {
    const { id } = await params;
    const memo = await fetchMemo(id);

    if (!(memo && memo.title && memo.content)) {
      throw new Error(MEMO_NOT_FOUND_MESSAGE);
    }

    return (
      <Modal title={memo.title}>
        <MemoContent>{memo.content}</MemoContent>
      </Modal>
    );
  } catch (error) {
    if (error instanceof Error) {
      return (
        <Modal title="">
          <MemoContent isError>{error.message}</MemoContent>
        </Modal>
      );
    }

    return (
      <Modal title="">
        <MemoContent isError>{UNKNOWN_ERROR_MESSAGE}</MemoContent>
      </Modal>
    );
  }
};

export default MemoModal;
