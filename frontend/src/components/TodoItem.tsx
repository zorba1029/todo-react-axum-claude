import type { Todo } from '../types/todo';
import type { UpdateTodoInput } from '../types/todo';
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onUpdate: (id: number, input: UpdateTodoInput) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description ?? '');

  useEffect(() => {
    setEditTitle(todo.title);
    setEditDescription(todo.description ?? '');
  }, [todo.title, todo.description]);

  const hasChanges = useMemo(() => {
    const nextTitle = editTitle.trim();
    const nextDesc = editDescription.trim();
    const prevDesc = (todo.description ?? '').trim();
    return nextTitle !== todo.title.trim() || nextDesc !== prevDesc;
  }, [editTitle, editDescription, todo.title, todo.description]);

  const saveEdit = () => {
    const nextTitle = editTitle.trim();
    if (!nextTitle) return;
    const nextDesc = editDescription.trim();
    onUpdate(todo.id, { title: nextTitle, description: nextDesc || undefined });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description ?? '');
    setIsEditing(false);
  };

  return (
    <ListItem
      sx={{
        gap: 2,
        px: { xs: 3, sm: 4 },
        py: { xs: 2.5, sm: 3 },
        bgcolor: todo.completed ? 'rgba(249, 250, 251, 0.6)' : 'white',
        transition: 'background-color 0.2s',
        '&:hover': {
          bgcolor: 'rgba(124, 58, 237, 0.04)',
        },
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Checkbox */}
      <Checkbox
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        icon={<CheckBoxOutlineBlankIcon />}
        checkedIcon={<CheckBoxIcon />}
        sx={{
          color: 'primary.light',
          '&.Mui-checked': {
            color: 'primary.main',
          },
          '& .MuiSvgIcon-root': {
            fontSize: 36,
          },
        }}
        aria-label={todo.completed ? '완료 해제' : '완료 처리'}
      />

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {isEditing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <TextField
              fullWidth
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="제목"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                },
              }}
            />
            <TextField
              fullWidth
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="설명 (선택)"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                },
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Button
                variant="contained"
                size="small"
                onClick={saveEdit}
                disabled={!editTitle.trim() || !hasChanges}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                저장
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={cancelEdit}
                sx={{ textTransform: 'none', fontWeight: 700, color: 'text.primary' }}
              >
                취소
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: todo.completed ? 'text.disabled' : 'text.primary',
                textDecoration: todo.completed ? 'line-through' : 'none',
                transition: 'all 0.2s',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {todo.title}
            </Typography>
            {todo.description && (
              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  color: todo.completed ? 'text.disabled' : 'text.secondary',
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  transition: 'all 0.2s',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {todo.description}
              </Typography>
            )}
          </>
        )}
      </Box>

      {/* Edit button */}
      <IconButton
        onClick={() => setIsEditing(true)}
        disabled={isEditing}
        size="medium"
        sx={{
          color: 'text.secondary',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.05)',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s',
        }}
        aria-label="Edit task"
        title="수정"
      >
        <EditIcon />
      </IconButton>

      {/* Delete button */}
      <IconButton
        onClick={() => onDelete(todo.id)}
        size="medium"
        sx={{
          color: 'error.main',
          '&:hover': {
            bgcolor: 'rgba(244, 67, 54, 0.08)',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s',
        }}
        aria-label="Delete task"
        title="삭제"
      >
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
}
