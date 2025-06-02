import { useState, useEffect, RefObject } from 'react';

interface UseDropdownPositionProps {
  ref: RefObject<HTMLElement | null>;
  isOpen: boolean;
  threshold?: number; // 기본값 100px
  scrollContainerSelector?: string; // 스크롤 컨테이너 선택자
}

export const useDropdownPosition = ({
  ref,
  isOpen,
  threshold = 100,
  scrollContainerSelector = '.todo-content', // 기본적으로 todo-content 클래스 사용
}: UseDropdownPositionProps) => {
  const [dropdownUp, setDropdownUp] = useState(false);

  useEffect(() => {
    if (isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();

      // 1. 전체 뷰포트 기준 공간 계산
      const viewportHeight = window.innerHeight;
      const spaceBelowViewport = viewportHeight - rect.bottom;

      // 2. 스크롤 컨테이너 기준 공간 계산
      const scrollContainer = ref.current.closest(
        scrollContainerSelector,
      ) as HTMLElement;
      let spaceBelowContainer = Infinity; // 기본값: 충분한 공간

      if (scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect();
        spaceBelowContainer = containerRect.bottom - rect.bottom;
      }

      // 3. 더 제한적인 공간을 기준으로 결정
      const availableSpace = Math.min(spaceBelowViewport, spaceBelowContainer);

      // threshold 미만이면 위쪽으로 표시
      setDropdownUp(availableSpace < threshold);
    }
  }, [isOpen, threshold, ref, scrollContainerSelector]);

  return dropdownUp;
};
