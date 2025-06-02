import { create } from 'zustand';
import { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { Todo, PriorityType } from '@/types/todo';
import { DragState, DragData, DropData } from '@/types/dnd';
import { useTodoStore } from './todo-store';

// 드롭 힌트 상태
export interface HintState {
  isVisible: boolean;
  targetPriority: PriorityType | null;
  insertPosition: 'top' | 'bottom' | null;
}

// Drag Store 인터페이스
interface DragStore {
  // === 드래그 상태 ===
  dragState: DragState;
  hintState: HintState;

  // === 드래그 핸들러 ===
  onDragStart: (event: DragStartEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => Promise<void>;
  onDragCancel: () => void;

  // === UI 헬퍼 메서드 ===
  isDisabled: (todoId: number) => boolean;
  isDragging: (todoId: number) => boolean;
  getItemClass: (todoId: number) => string;
  getQuadrantClass: (priority: PriorityType) => string;

  // === 데이터 생성 헬퍼 ===
  createDragProps: (todo: Todo) => DragData;
  createDropProps: (priority: PriorityType) => DropData;
}

export const useDragStore = create<DragStore>((set, get) => {
  // 상태 초기화 헬퍼
  const resetStates = () =>
    set({
      dragState: {
        isDragging: false,
        draggedTodoId: null,
        targetPriority: null,
      },
      hintState: {
        isVisible: false,
        targetPriority: null,
        insertPosition: null,
      },
    });

  return {
    // === 초기 상태 ===
    dragState: {
      isDragging: false,
      draggedTodoId: null,
      targetPriority: null,
    },
    hintState: {
      isVisible: false,
      targetPriority: null,
      insertPosition: null,
    },

    // === 드래그 핸들러 ===
    onDragStart: (event: DragStartEvent) => {
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

    onDragOver: (event: DragOverEvent) => {
      const dropData = event.over?.data.current as DropData;

      set((state) => ({
        dragState: {
          ...state.dragState,
          targetPriority: dropData?.priority || null,
        },
        hintState: {
          isVisible: !!dropData,
          targetPriority: dropData?.priority || null,
          insertPosition: dropData ? 'bottom' : null,
        },
      }));
    },

    onDragEnd: async (event: DragEndEvent) => {
      const { active, over } = event;
      resetStates(); // UI 먼저 업데이트

      if (!over) return;

      const dragData = active.data.current as DragData;
      const dropData = over.data.current as DropData;

      if (
        dragData &&
        dropData &&
        dragData.currentPriority !== dropData.priority
      ) {
        await useTodoStore
          .getState()
          .moveTodo(Number(dragData.id), dropData.priority);
      }
    },

    onDragCancel: resetStates,

    // === UI 헬퍼 메서드 ===
    isDisabled: (todoId: number) => useTodoStore.getState().isLoading,

    isDragging: (todoId: number) => get().dragState.draggedTodoId === todoId,

    getItemClass: (todoId: number) => {
      const { isDisabled, isDragging } = get();
      return [
        'todo-item',
        isDisabled(todoId) && 'todo-item-disabled',
        isDragging(todoId) && 'todo-item-dragging',
      ]
        .filter(Boolean)
        .join(' ');
    },

    getQuadrantClass: (priority: PriorityType) => {
      const { dragState } = get();
      if (!dragState.isDragging) return '';
      return dragState.targetPriority === priority
        ? 'quadrant-target'
        : 'quadrant-inactive';
    },

    // === 데이터 생성 헬퍼 ===
    createDragProps: (todo: Todo): DragData => ({
      id: todo.id,
      currentPriority: todo.priority,
      todo: todo,
    }),

    createDropProps: (priority: PriorityType): DropData => ({
      priority,
    }),
  };
});
