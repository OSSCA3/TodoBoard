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
export const sortByDate = (todos: Todo[]): Todo[] => {
  return [...todos].sort((a, b) => {
    // dueDate가 없는 경우 맨 뒤로
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;

    // 단순 날짜 오름차순 정렬
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
};

export const filterByPriority = (
  sortedTodos: Todo[],
  priority: PriorityType,
): Todo[] => {
  return sortedTodos.filter((todo) => todo.priority === priority);
};

// === 데이터 처리 유틸리티 ===
export const groupByStatus = (sortedTodos: Todo[], priority: PriorityType) => {
  const priorityTodos = filterByPriority(sortedTodos, priority);
  return {
    incomplete: priorityTodos.filter((todo) => !todo.isCompleted),
    completed: priorityTodos.filter((todo) => todo.isCompleted),
  };
};

export const processAll = (todos: Todo[]) => {
  const sortedTodos = sortByDate(todos);
  const priorities: PriorityType[] = ['high', 'medium', 'low', 'someday'];

  return priorities.reduce(
    (acc, priority) => {
      acc[priority] = groupByStatus(sortedTodos, priority);
      return acc;
    },
    {} as Record<PriorityType, { incomplete: Todo[]; completed: Todo[] }>,
  );
};

export const createInitialGroups = () => {
  const priorities: PriorityType[] = ['high', 'medium', 'low', 'someday'];
  return priorities.reduce(
    (acc, priority) => {
      acc[priority] = { incomplete: [], completed: [] };
      return acc;
    },
    {} as Record<PriorityType, { incomplete: Todo[]; completed: Todo[] }>,
  );
};
