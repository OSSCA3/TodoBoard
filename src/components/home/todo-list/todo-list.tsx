import { mockTodoData } from '@/mocks/todos';
import React from 'react';
import TodoListItem from './todo-item';

const TodoList = () => {
  return (
    <div className="rounded-xl h-full w-full">
      <h2>할 일 리스트</h2>
      <ul className="flex flex-col gap-2">
        {mockTodoData.map((todo) => (
          <TodoListItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
