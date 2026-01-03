import type { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo';

const API_URL = import.meta.env.VITE_API_URL || '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const todoApi = {
  async getAll(): Promise<Todo[]> {
    const response = await fetch(`${API_URL}/todos`);
    return handleResponse<Todo[]>(response);
  },

  async getById(id: number): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos/${id}`);
    return handleResponse<Todo>(response);
  },

  async create(input: CreateTodoInput): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    return handleResponse<Todo>(response);
  },

  async update(id: number, input: UpdateTodoInput): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    return handleResponse<Todo>(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete todo: ${response.status}`);
    }
  },

  async toggle(id: number): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos/${id}/toggle`, {
      method: 'PATCH',
    });
    return handleResponse<Todo>(response);
  },
};
