import React from 'react';
import { Todo } from '@/types/todo';
import TodoListItem from './todo-item';

const TodoList = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/todos`, {});
    if (!res.ok) console.error('할 일 목록 조회를 실패했어요');
    const json = await res.json();
    const todos: Todo[] = json.todos || [];

    return (
      <div className="rounded-xl h-full w-full">
        <h2>할 일 리스트</h2>
        <ul className="flex flex-col gap-2 max-h-[330px] overflow-y-auto">
          {todos.length > 0 ? (
            todos.map((todo) => <TodoListItem key={todo.id} todo={todo} />)
          ) : (
            <li className="text-gray-500 text-center py-4">
              작성된 일정이 없습니다
            </li>
          )}
        </ul>
      </div>
    );
  } catch (error) {
    return (
      <div className="rounded-xl h-full w-full">
        <h2>할 일 리스트</h2>
        <div className="flex flex-col gap-2 max-h-[330px]">
          할 일 목록을 불러오는 중 오류가 발생했습니다
        </div>
      </div>
    );
  }
};

export default TodoList;
