import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex-1">
        <h3
          className={`font-medium ${
            todo.completed ? 'line-through text-gray-400' : 'text-gray-900'
          }`}
        >
          {todo.title}
        </h3>
        {todo.description && (
          <p
            className={`text-sm mt-1 ${
              todo.completed ? 'line-through text-gray-300' : 'text-gray-600'
            }`}
          >
            {todo.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
      >
        Delete
      </button>
    </li>
  );
}
