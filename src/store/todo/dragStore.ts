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

export const useDragStore = create<DragStore>((set, get) => {
  // 상태 초기화 헬퍼
  const resetStates = () =>
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

  return {
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
      const dropData = event.over?.data.current as DropData;

      set((state) => ({
        dragState: {
          ...state.dragState,
          targetPriority: dropData?.priority || null,
        },
        dropHintState: {
          isVisible: !!dropData,
          targetPriority: dropData?.priority || null,
          insertPosition: dropData ? 'bottom' : null,
        },
      }));
    },

    handleDragEnd: async (event: DragEndEvent) => {
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

    handleDragCancel: resetStates,

    // === UI 헬퍼 메서드 ===
    isDragDisabled: (todoId: number) => useTodoStore.getState().isLoading,

    isBeingDragged: (todoId: number) =>
      get().dragState.draggedTodoId === todoId,

    getTodoItemClass: (todoId: number) => {
      const { isDragDisabled, isBeingDragged } = get();
      return [
        'todo-item',
        isDragDisabled(todoId) && 'todo-item-disabled',
        isBeingDragged(todoId) && 'todo-item-dragging',
      ]
        .filter(Boolean)
        .join(' ');
    },

    getQuadrantClass: (priority: PriorityType) => {
      const { dragState } = get();
      if (!dragState.isDragging) return '';
      return dragState.targetPriority === priority
        ? 'todo-quadrant-target'
        : 'todo-quadrant-inactive';
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
  };
});
