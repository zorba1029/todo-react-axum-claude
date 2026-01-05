import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {filters.map((filter) => (
        <Button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          variant={currentFilter === filter.value ? 'contained' : 'text'}
          size="small"
          sx={{
            px: 2,
            py: 1,
            borderRadius: 100,
            fontWeight: 700,
            textTransform: 'none',
            ...(currentFilter === filter.value
              ? {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #d946ef 100%)',
                  color: 'white',
                  boxShadow: '0 4px 6px -1px rgba(124, 58, 237, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6d28d9 0%, #c026d3 100%)',
                    boxShadow: '0 6px 8px -1px rgba(124, 58, 237, 0.4)',
                  },
                }
              : {
                  bgcolor: 'rgba(0, 0, 0, 0.05)',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.1)',
                  },
                }),
          }}
        >
          {filterLabels[filter.value]}
        </Button>
      ))}
    </Box>
  );
}
