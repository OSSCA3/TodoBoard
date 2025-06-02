import { create } from 'zustand';
import { Todo, PriorityType } from '@/types/todo';
import { fetchAllTodosFromApi } from '@/libs/api/todoApi'; // API 호출 함수 임포트

// ===== 1. 데이터 처리 헬퍼 함수들 =====
// 모든 todos를 날짜별로 정렬하는 함수
const sortTodosByDate = (todos: Todo[]): Todo[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return [...todos].sort((a, b) => {
    // dueDate가 없는 경우 맨 뒤로
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;

    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    dateA.setHours(0, 0, 0, 0);
    dateB.setHours(0, 0, 0, 0);

    // 현재 날짜와의 거리 계산 (절댓값)
    const diffA = Math.abs(dateA.getTime() - today.getTime());
    const diffB = Math.abs(dateB.getTime() - today.getTime());

    return diffA - diffB;
  });
};

// 정렬된 todos를 priority별로 분류하는 함수
const filterTodosByPriority = (
  sortedTodos: Todo[],
  priority: PriorityType,
): Todo[] => {
  return sortedTodos.filter((todo) => todo.priority === priority);
};

// 특정 priority의 완료/미완료 분리 헬퍼 함수
const processPriorityTodos = (sortedTodos: Todo[], priority: PriorityType) => {
  const priorityTodos = filterTodosByPriority(sortedTodos, priority);
  return {
    incomplete: priorityTodos.filter((todo) => !todo.isCompleted),
    completed: priorityTodos.filter((todo) => todo.isCompleted),
  };
};

// 모든 데이터를 한 번에 처리하는 함수
const processAllTodos = (todos: Todo[]) => {
  const sortedTodos = sortTodosByDate(todos);
  const priorities: PriorityType[] = ['high', 'medium', 'low', 'someday'];

  return priorities.reduce(
    (acc, priority) => {
      acc[priority] = processPriorityTodos(sortedTodos, priority);
      return acc;
    },
    {} as Record<PriorityType, { incomplete: Todo[]; completed: Todo[] }>,
  );
};

// 초기 processedTodos 생성 헬퍼 함수
const createInitialProcessedTodos = () => {
  const priorities: PriorityType[] = ['high', 'medium', 'low', 'someday'];
  return priorities.reduce(
    (acc, priority) => {
      acc[priority] = { incomplete: [], completed: [] };
      return acc;
    },
    {} as Record<PriorityType, { incomplete: Todo[]; completed: Todo[] }>,
  );
};

// ===== 2. 스토어 타입 정의 =====

interface TodoState {
  // 원본 데이터
  todos: Todo[];
  isLoading: boolean;
  error: Error | null;

  // 처리된 데이터들 (완료/미완료 분리)
  processedTodos: {
    high: { incomplete: Todo[]; completed: Todo[] };
    medium: { incomplete: Todo[]; completed: Todo[] };
    low: { incomplete: Todo[]; completed: Todo[] };
    someday: { incomplete: Todo[]; completed: Todo[] };
  };

  // 메뉴 상태 관리 (전역)
  openMenuId: number | null;

  // 액션
  fetchAllTodos: () => Promise<void>;
  addTodo: (priority: PriorityType) => void;

  // 메뉴 액션
  setOpenMenuId: (id: number | null) => void;
  toggleMenu: (id: number) => void;
  closeMenu: () => void;
}

// ===== 3. 스토어 생성 =====
export const useTodoStore = create<TodoState>((set, get) => ({
  // 초기 상태
  todos: [],
  isLoading: false,
  error: null,
  // 초기 처리된 데이터들
  processedTodos: createInitialProcessedTodos(),
  // 메뉴 상태 관리 (전역)
  openMenuId: null,
  // 액션: 데이터 가져오기 및 한 번에 처리
  fetchAllTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const fetchedTodos = await fetchAllTodosFromApi();
      // 한 번만 정렬/분류 처리
      const processedData = processAllTodos(fetchedTodos);

      set({
        todos: fetchedTodos,
        isLoading: false,
        processedTodos: processedData,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err : new Error('Failed to fetch todos'),
        isLoading: false,
      });
      console.error('Error fetching todos in store:', err);
    }
  },
  addTodo: (priority: PriorityType) => {
    console.log('할 일 추가 버튼 클릭!', priority);
    // TODO: 나중에 할 일 추가 모달/폼 구현 예정
    // 1. 새로운 todo 객체 생성
    // 2. API 호출하여 서버에 저장
    // 3. 성공 시 로컬 상태 업데이트 및 재정렬
  },
  // 메뉴 액션
  setOpenMenuId: (id: number | null) => {
    set({ openMenuId: id });
  },
  toggleMenu: (id: number) => {
    const currentOpenId = get().openMenuId;
    set({ openMenuId: currentOpenId === id ? null : id });
  },
  closeMenu: () => {
    set({ openMenuId: null });
  },
}));
