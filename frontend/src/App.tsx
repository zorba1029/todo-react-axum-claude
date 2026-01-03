import { useTodos } from './hooks/useTodos';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Filter from './components/Filter';

function App() {
  const {
    todos,
    filter,
    loading,
    error,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo List</h1>
          <p className="text-gray-600">Organize your tasks efficiently</p>
        </header>

        <div className="space-y-6">
          <TodoForm onSubmit={addTodo} />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Filter currentFilter={filter} onFilterChange={setFilter} />

          {loading ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-500">Loading todos...</p>
            </div>
          ) : (
            <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
          )}
        </div>

        <footer className="text-center mt-8 text-gray-600 text-sm">
          <p>Built with React, TypeScript, Vite, and Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
