import { useState, useEffect } from 'react';
import type { Todo, CreateTodoInput, TodoFilter } from '../types/todo';
import { todoApi } from '../api/todoApi';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoApi.getAll();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (input: CreateTodoInput) => {
    try {
      const newTodo = await todoApi.create(input);
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      const updatedTodo = await todoApi.toggle(id);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle todo');
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await todoApi.delete(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return {
    todos: filteredTodos,
    filter,
    loading,
    error,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    refetch: fetchTodos,
  };
}
