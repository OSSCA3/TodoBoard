import { Todo, PriorityType } from '@/types/todo';

// 모든 todos를 날짜별로 정렬하는 함수
export const sortTodosByDate = (todos: Todo[]): Todo[] => {
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
export const filterTodosByPriority = (
  sortedTodos: Todo[],
  priority: PriorityType,
): Todo[] => {
  return sortedTodos.filter((todo) => todo.priority === priority);
};

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
