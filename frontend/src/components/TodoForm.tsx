import { useState } from 'react';
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
    <form onSubmit={handleSubmit} className="bg-zinc-900/90 px-6 py-5 sm:px-8">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="할 일을 입력하세요"
            className="w-full bg-transparent text-white placeholder:text-white/60 focus:outline-none text-xl"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="설명 (선택)"
            className="mt-2 w-full bg-transparent text-sm text-white/80 placeholder:text-white/40 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={!title.trim()}
          className="group flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 text-white ring-1 ring-white/15 transition-all hover:bg-white/15 hover:ring-white/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="할 일 추가"
        >
          <svg className="w-8 h-8 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </form>
  );
}
