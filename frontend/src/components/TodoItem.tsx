import type { Todo } from '../types/todo';
import type { UpdateTodoInput } from '../types/todo';
import { useEffect, useMemo, useState } from 'react';

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
    <li
      className={`group flex items-center gap-4 px-6 py-5 sm:px-8 sm:py-6 transition-colors ${
        todo.completed ? 'bg-gray-50/60' : 'bg-white'
      } hover:bg-violet-50/60`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className="flex-shrink-0 transition-transform hover:scale-110"
        aria-label={todo.completed ? '완료 해제' : '완료 처리'}
      >
        {todo.completed ? (
          <svg className="w-9 h-9 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8.29 13.29a.996.996 0 01-1.41 0L5.71 12.7a.996.996 0 111.41-1.41L10 14.17l6.88-6.88a.996.996 0 111.41 1.41l-7.58 7.59z"/>
          </svg>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-violet-200 text-violet-300 transition-colors group-hover:border-violet-300 group-hover:text-violet-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-2">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-base font-medium text-gray-900 shadow-sm outline-none ring-0 focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
              placeholder="제목"
            />
            <input
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none ring-0 focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
              placeholder="설명 (선택)"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={saveEdit}
                disabled={!editTitle.trim() || !hasChanges}
                className="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                저장
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <>
            <p
              className={`truncate text-lg font-medium transition-all ${
                todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'
              }`}
            >
              {todo.title}
            </p>
            {todo.description && (
              <p
                className={`mt-1 truncate text-sm transition-all ${
                  todo.completed ? 'text-gray-400 line-through' : 'text-gray-600'
                }`}
              >
                {todo.description}
              </p>
            )}
          </>
        )}
      </div>

      {/* Edit button */}
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        disabled={isEditing}
        className="flex-shrink-0 rounded-xl p-2 text-gray-700 transition-all hover:bg-gray-900/5 hover:scale-105 disabled:opacity-40"
        aria-label="Edit task"
        title="수정"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
      </button>

      {/* Delete button */}
      <button
        onClick={() => onDelete(todo.id)}
        className="flex-shrink-0 rounded-xl p-2 text-red-600 transition-all hover:bg-red-50 hover:scale-105"
        aria-label="Delete task"
        title="삭제"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0l1 14a2 2 0 002 2h4a2 2 0 002-2l1-14" />
        </svg>
      </button>
    </li>
  );
}
