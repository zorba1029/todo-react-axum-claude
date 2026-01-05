import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import type { CreateTodoInput } from '../types/todo';

interface TodoFormProps {
  onSubmit: (input: CreateTodoInput) => void;
}

export default function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
    });

    setTitle('');
    setDescription('');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        bgcolor: 'rgba(24, 24, 27, 0.9)',
        px: { xs: 3, sm: 4 },
        py: 2.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="할 일을 입력하세요"
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                color: 'white',
                fontSize: '1.25rem',
                '& input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.6)',
                  opacity: 1,
                },
              },
            }}
          />
          <TextField
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="설명 (선택)"
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.875rem',
                mt: 1,
                '& input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.4)',
                  opacity: 1,
                },
              },
            }}
          />
        </Box>

        <IconButton
          type="submit"
          disabled={!title.trim()}
          sx={{
            width: 56,
            height: 56,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              borderColor: 'rgba(255, 255, 255, 0.25)',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
            '&:disabled': {
              opacity: 0.5,
              color: 'white',
            },
          }}
          aria-label="할 일 추가"
        >
          <AddIcon sx={{ fontSize: 32 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
