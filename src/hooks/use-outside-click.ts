import { useEffect, RefObject } from 'react';

interface UseOutsideClickProps {
  ref: RefObject<HTMLElement | null>;
  isOpen: boolean;
  onClose: () => void;
}

export const useOutsideClick = ({
  ref,
  isOpen,
  onClose,
}: UseOutsideClickProps) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, ref]);
};
