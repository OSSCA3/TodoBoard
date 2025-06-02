import { useState } from 'react';
import { Todo } from '@/types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
}

// 완료/미완료로 먼저 나누고, 각각을 태그별로 그룹화하는 함수
const groupTodosByCompletionAndTag = (todos: Todo[]) => {
  const incomplete = todos.filter((todo) => !todo.isCompleted);
  const completed = todos.filter((todo) => todo.isCompleted);

  const groupByTag = (todoList: Todo[]) => {
    const groups: Record<string, Todo[]> = {};
    todoList.forEach((todo) => {
      const tag = todo.tag || 'no-tag';
      if (!groups[tag]) {
        groups[tag] = [];
      }
      groups[tag].push(todo);
    });
    return groups;
  };

  return {
    incomplete: groupByTag(incomplete),
    completed: groupByTag(completed),
  };
};

// 태그 이름을 한글로 변환
const getTagDisplayName = (tag: string): string => {
  switch (tag) {
    case 'work':
      return '업무';
    case 'dev':
      return '개발';
    case 'personal':
      return '개인';
    case 'no-tag':
      return '기타';
    default:
      return tag;
  }
};

// 태그별 색상 스타일
const getTagStyle = (tag: string): string => {
  switch (tag) {
    case 'work':
      return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'dev':
      return 'text-purple-700 bg-purple-50 border-purple-200';
    case 'personal':
      return 'text-green-700 bg-green-50 border-green-200';
    default:
      return 'text-gray-700 bg-gray-50 border-gray-200';
  }
};

export default function TodoList({ todos }: TodoListProps) {
  // 현재 열린 메뉴의 ID를 관리
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleMenuToggle = (todoId: number) => {
    setOpenMenuId(openMenuId === todoId ? null : todoId);
  };

  const handleMenuClose = () => {
    setOpenMenuId(null);
  };

  if (!todos || todos.length === 0) {
    return (
      <p className="text-sm text-gray-500">이 섹션에는 할 일이 없습니다.</p>
    );
  }

  const { incomplete, completed } = groupTodosByCompletionAndTag(todos);

  const renderTagGroup = (tag: string, tagTodos: Todo[]) => (
    <div key={tag} className={`border rounded-lg ${getTagStyle(tag)} mb-2`}>
      <div className="px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{getTagDisplayName(tag)}</span>
          <span className="text-xs opacity-70">({tagTodos.length})</span>
        </div>
      </div>
      <div className="px-2 pb-2 space-y-2">
        {tagTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isMenuOpen={openMenuId === todo.id}
            onMenuToggle={() => handleMenuToggle(todo.id)}
            onMenuClose={handleMenuClose}
          />
        ))}
      </div>
    </div>
  );

  const renderCompletionSection = (
    title: string,
    tagGroups: Record<string, Todo[]>,
  ) => {
    const tagKeys = Object.keys(tagGroups).sort();
    const totalCount = Object.values(tagGroups).reduce(
      (sum, todos) => sum + todos.length,
      0,
    );

    if (totalCount === 0) return null;

    return (
      <div className="mb-4">
        {/* 완료/미완료 섹션 헤더 */}
        <div className="flex items-center gap-2 mb-3 px-2 py-1">
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
          <span className="text-xs text-gray-500">({totalCount})</span>
        </div>

        {/* 섹션 내용 */}
        <div className="space-y-2">
          {tagKeys.map((tag) => renderTagGroup(tag, tagGroups[tag]))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {renderCompletionSection('미완료', incomplete)}
      {renderCompletionSection('완료', completed)}
    </div>
  );
}
