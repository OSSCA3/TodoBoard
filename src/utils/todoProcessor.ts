import { Todo, PriorityType } from '@/types/todo';

// === 포맷팅 유틸리티 ===
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

// === 정렬 및 필터링 유틸리티 ===
// 모든 todos를 날짜별로 정렬하는 함수
export const sortTodosByDate = (todos: Todo[]): Todo[] => {
  return [...todos].sort((a, b) => {
    // dueDate가 없는 경우 맨 뒤로
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;

    // 단순 날짜 오름차순 정렬
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
};

// 정렬된 todos를 priority별로 분류하는 함수
export const filterTodosByPriority = (
  sortedTodos: Todo[],
  priority: PriorityType,
): Todo[] => {
  return sortedTodos.filter((todo) => todo.priority === priority);
};

// === 데이터 처리 유틸리티 ===
// 특정 priority의 완료/미완료 분리 헬퍼 함수
export const processPriorityTodos = (
  sortedTodos: Todo[],
  priority: PriorityType,
) => {
  const priorityTodos = filterTodosByPriority(sortedTodos, priority);
  return {
    incomplete: priorityTodos.filter((todo) => !todo.isCompleted),
    completed: priorityTodos.filter((todo) => todo.isCompleted),
  };
};

// 모든 데이터를 한 번에 처리하는 함수
export const processAllTodos = (todos: Todo[]) => {
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
export const createInitialProcessedTodos = () => {
  const priorities: PriorityType[] = ['high', 'medium', 'low', 'someday'];
  return priorities.reduce(
    (acc, priority) => {
      acc[priority] = { incomplete: [], completed: [] };
      return acc;
    },
    {} as Record<PriorityType, { incomplete: Todo[]; completed: Todo[] }>,
  );
};
