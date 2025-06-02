import { Todo } from '@/types/todo';
import { formatDate } from '@/utils/todo-processor';

interface TodoBodyProps {
  todo: Todo;
}

const TodoBody = ({ todo }: TodoBodyProps) => {
  return (
    <>
      <div
        className={`todo-item-title ${
          todo.isCompleted
            ? 'todo-text-completed todo-item-title-completed'
            : 'todo-text'
        }`}
      >
        {todo.title}
      </div>

      {todo.dueDate && (
        <div
          className={`todo-item-date ${
            todo.isCompleted ? 'todo-text-completed' : 'todo-text-muted'
          }`}
        >
          {formatDate(todo.dueDate)}
        </div>
      )}
    </>
  );
};

export default TodoBody;
