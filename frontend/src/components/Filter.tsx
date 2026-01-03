import type { TodoFilter } from '../types/todo';

interface FilterProps {
  currentFilter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
}

export default function Filter({ currentFilter, onFilterChange }: FilterProps) {
  const filters: { label: string; value: TodoFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="flex gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            currentFilter === filter.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
