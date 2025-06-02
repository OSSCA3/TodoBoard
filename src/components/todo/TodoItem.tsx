import { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

export default function TodoItem({ todo }: TodoItemProps) {
  return (
    <li className="bg-white p-4 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <span
          className={`text-lg font-medium ${
            todo.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'
          }`}
        >
          {todo.title}
        </span>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {todo.dueDate && <p>마감일: {formatDate(todo.dueDate)}</p>}
        {todo.tag && (
          <span
            className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full
              ${
                todo.tag === 'work'
                  ? 'bg-sky-100 text-sky-700'
                  : todo.tag === 'dev'
                    ? 'bg-pink-100 text-pink-700'
                    : 'bg-green-100 text-green-700'
              }
            `}
          >
            {todo.tag}
          </span>
        )}
      </div>
    </li>
  );
}
