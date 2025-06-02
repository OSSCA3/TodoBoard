import { Todo, PriorityType } from '@/types/todo';
import { DragState } from '@/types/dnd';

// 처리된 데이터 타입
export interface ProcessedTodos {
  high: { incomplete: Todo[]; completed: Todo[] };
  medium: { incomplete: Todo[]; completed: Todo[] };
  low: { incomplete: Todo[]; completed: Todo[] };
  someday: { incomplete: Todo[]; completed: Todo[] };
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

  // State setter 메서드들
  setTodos: (todos: Todo[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setProcessedTodos: (processedTodos: ProcessedTodos) => void;
  setDragState: (dragState: Partial<DragState>) => void;

  // Action 메서드들
  fetchAllTodos: () => Promise<void>;
  toggleTodoComplete: (id: number) => Promise<void>;
  addTodo: (priority: PriorityType) => void;
  editTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  moveTodo: (todoId: number, newPriority: PriorityType) => Promise<void>;
}
