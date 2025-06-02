import { useState, useEffect, RefObject } from 'react';

interface UseDropdownPositionProps {
  ref: RefObject<HTMLElement | null>;
  isOpen: boolean;
  threshold?: number; // 기본값 100px
}

export const useDropdownPosition = ({
  ref,
  isOpen,
  threshold = 100,
}: UseDropdownPositionProps) => {
  const [dropdownUp, setDropdownUp] = useState(false);

  useEffect(() => {
    if (isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;

      // threshold 미만이면 위쪽으로 표시
      setDropdownUp(spaceBelow < threshold);
    }
  }, [isOpen, threshold, ref]);

  return dropdownUp;
};
