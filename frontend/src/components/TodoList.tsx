import type { Todo } from '../types/todo';
import TodoItem from './TodoItem';
import type { UpdateTodoInput } from '../types/todo';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onUpdate: (id: number, input: UpdateTodoInput) => void;
  onDelete: (id: number) => void;
}

export default function TodoList({ todos, onToggle, onUpdate, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 10,
          px: 3,
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'rgba(124, 58, 237, 0.1)',
            mb: 2,
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: 40, color: 'primary.light' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary', mb: 0.5 }}>
          할 일이 없습니다
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          새로운 할 일을 추가해보세요!
        </Typography>
      </Box>
    );
  }

  return (
    <List disablePadding>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
}
