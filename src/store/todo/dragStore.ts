import { create } from 'zustand';
import { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { Todo, PriorityType } from '@/types/todo';
import { DragState, DragData, DropData } from '@/types/dnd';
import { useTodoStore } from './todoStore';

// 드롭 힌트 상태
export interface DropHintState {
  isVisible: boolean;
  targetPriority: PriorityType | null;
  insertPosition: 'top' | 'bottom' | null;
}

// Drag Store 인터페이스 - 드래그 앤 드롭 및 UI 인터랙션 전담
interface DragStore {
  // === 드래그 상태 ===
  dragState: DragState;
  dropHintState: DropHintState;

  // === 드래그 핸들러 ===
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => Promise<void>;
  handleDragCancel: () => void;

  // === UI 헬퍼 메서드 ===
  isDragDisabled: (todoId: number) => boolean;
  isBeingDragged: (todoId: number) => boolean;
  getTodoItemClass: (todoId: number) => string;
  getQuadrantClass: (priority: PriorityType) => string;

  // === 데이터 생성 헬퍼 ===
  createDragData: (todo: Todo) => DragData;
  createDropData: (priority: PriorityType) => DropData;
}

export const useDragStore = create<DragStore>((set, get) => ({
  // === 초기 상태 ===
  dragState: {
    isDragging: false,
    draggedTodoId: null,
    targetPriority: null,
  },
  dropHintState: {
    isVisible: false,
    targetPriority: null,
    insertPosition: null,
  },

  // === 드래그 핸들러 ===
  handleDragStart: (event: DragStartEvent) => {
    const dragData = event.active.data.current as DragData;
    if (dragData) {
      set({
        dragState: {
          isDragging: true,
          draggedTodoId: dragData.id,
          targetPriority: dragData.currentPriority,
        },
      });
    }
  },

  handleDragOver: (event: DragOverEvent) => {
    const { over } = event;

    if (over) {
      const dropData = over.data.current as DropData;
      if (dropData) {
        set((state) => ({
          dragState: {
            ...state.dragState,
            targetPriority: dropData.priority,
          },
          dropHintState: {
            isVisible: true,
            targetPriority: dropData.priority,
            insertPosition: 'bottom', // 새로운 todo는 미완료 섹션 하단에 추가
          },
        }));
      }
    } else {
      // 드래그가 유효한 드롭 영역 밖에 있을 때 힌트 숨김
      set((state) => ({
        dropHintState: {
          isVisible: false,
          targetPriority: null,
          insertPosition: null,
        },
      }));
    }
  },

  handleDragEnd: async (event: DragEndEvent) => {
    const { active, over } = event;

    // 드래그 상태 초기화
    set({
      dragState: {
        isDragging: false,
        draggedTodoId: null,
        targetPriority: null,
      },
      dropHintState: {
        isVisible: false,
        targetPriority: null,
        insertPosition: null,
      },
    });

    if (!over) return;

    const dragData = active.data.current as DragData;
    const dropData = over.data.current as DropData;

    if (dragData && dropData) {
      // 다른 우선순위로 이동한 경우에만 실행
      if (dragData.currentPriority !== dropData.priority) {
        // todoStore의 moveTodo 호출
        await useTodoStore
          .getState()
          .moveTodo(Number(dragData.id), dropData.priority);
      }
    }
  },

  handleDragCancel: () => {
    set({
      dragState: {
        isDragging: false,
        draggedTodoId: null,
        targetPriority: null,
      },
      dropHintState: {
        isVisible: false,
        targetPriority: null,
        insertPosition: null,
      },
    });
  },

  // === UI 헬퍼 메서드 ===
  isDragDisabled: (todoId: number) => {
    // todoStore의 로딩 상태를 확인
    return useTodoStore.getState().isLoading;
  },

  isBeingDragged: (todoId: number) => {
    const { dragState } = get();
    return dragState.draggedTodoId === todoId;
  },

  getTodoItemClass: (todoId: number) => {
    const { isDragDisabled, isBeingDragged } = get();

    let baseClass = 'todo-item';

    if (isDragDisabled(todoId)) {
      baseClass += ' todo-item-disabled';
    }

    if (isBeingDragged(todoId)) {
      baseClass += ' todo-item-dragging';
    }

    return baseClass;
  },

  getQuadrantClass: (priority: PriorityType) => {
    const { dragState } = get();

    if (!dragState.isDragging) return '';

    // 타겟 사분면 (드래그된 아이템이 도착할 곳)
    if (dragState.targetPriority === priority) {
      return 'todo-quadrant-target';
    }

    // 비활성 사분면 (드래그 중이지만 타겟이 아님)
    return 'todo-quadrant-inactive';
  },

  // === 데이터 생성 헬퍼 ===
  createDragData: (todo: Todo): DragData => ({
    id: todo.id,
    currentPriority: todo.priority,
    todo: todo,
  }),

  createDropData: (priority: PriorityType): DropData => ({
    priority,
  }),
}));
