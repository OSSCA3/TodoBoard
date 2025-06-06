import { Todo, PriorityType } from './todo';

// 드래그 데이터 타입
export interface DragData {
  id: string; // Todo ID
  currentPriority: PriorityType;
  todo: Todo;
}

// 드롭 대상 데이터 타입
export interface DropData {
  priority: PriorityType;
}

// 드래그 상태 타입
export interface DragState {
  isDragging: boolean;
  draggedTodoId: string | null;
  targetPriority: PriorityType | null;
}
