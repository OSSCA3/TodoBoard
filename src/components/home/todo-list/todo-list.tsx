import React from 'react';
import TodoListItem from './todo-item';
import { TodoItem } from '@/types/todo-list';

const TodoList = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/todos`, {});
  if (!res.ok) console.error('할 일 목록 조회를 실패했어요');
  const json = await res.json();
  const todos: TodoItem[] = json.todos;

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
};

export default TodoList;
