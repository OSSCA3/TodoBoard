import { Todo, PriorityType } from '@/types/todo';
import { DragState, DragData, DropData } from '@/types/dnd';
import { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';

// 처리된 데이터 타입
export interface ProcessedTodos {
  high: { incomplete: Todo[]; completed: Todo[] };
  medium: { incomplete: Todo[]; completed: Todo[] };
  low: { incomplete: Todo[]; completed: Todo[] };
  someday: { incomplete: Todo[]; completed: Todo[] };
}

// 드롭 힌트 상태
export interface DropHintState {
  isVisible: boolean;
  targetPriority: PriorityType | null;
  insertPosition: 'top' | 'bottom' | null; // 미완료 섹션 위/아래
}

// 통합된 Todo Store 상태 타입 (State + Action 통합)
export interface TodoState {
  // 원본 데이터
  todos: Todo[];
  isLoading: boolean;
  error: Error | null;

  // 처리된 데이터들 (완료/미완료 분리)
  processedTodos: ProcessedTodos;

  // 드래그 상태
  dragState: DragState;

  // 드롭 힌트 상태
  dropHintState: DropHintState;

  // State setter 메서드들
  setTodos: (todos: Todo[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setProcessedTodos: (processedTodos: ProcessedTodos) => void;
  setDragState: (dragState: Partial<DragState>) => void;
  setDropHintState: (dropHintState: Partial<DropHintState>) => void;

  // Action 메서드들
  fetchAllTodos: () => Promise<void>;
  toggleTodoComplete: (id: number) => Promise<void>;
  addTodo: (priority: PriorityType) => void;
  editTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  moveTodo: (todoId: number, newPriority: PriorityType) => Promise<void>;

  // 드래그 앤 드롭 핸들러들
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => Promise<void>;
  handleDragCancel: () => void;

  // 드래그 관련 Utility 메서드들 (TodoItem용)
  isDragDisabled: (todoId: number) => boolean;
  isBeingDragged: (todoId: number) => boolean;
  getTodoItemClass: (todoId: number) => string;
  createDragData: (todo: Todo) => DragData;

  // 드래그 관련 Utility 메서드들 (TodoQuadrant용)
  getQuadrantClass: (priority: PriorityType) => string;
  createDropData: (priority: PriorityType) => DropData;
  getQuadrantTodos: (priority: PriorityType) => Todo[];
}
