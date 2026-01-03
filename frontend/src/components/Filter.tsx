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

  const filterLabels: Record<TodoFilter, string> = {
    all: '전체',
    active: '진행중',
    completed: '완료됨',
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            currentFilter === filter.value
              ? 'bg-gradient-to-r from-primary-600 to-fuchsia-500 text-white shadow-md'
              : 'bg-gray-900/5 text-gray-700 hover:bg-gray-900/10'
          }`}
        >
          {filterLabels[filter.value]}
        </button>
      ))}
    </div>
  );
}
