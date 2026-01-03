import { useTodos } from './hooks/useTodos';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Filter from './components/Filter';

function App() {
  const {
    allTodos,
    todos,
    filter,
    loading,
    error,
    setFilter,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
  } = useTodos();

  const totalCount = allTodos.length;
  const activeCount = allTodos.filter((t) => !t.completed).length;
  const completedCount = allTodos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen py-10 sm:py-12">
      <div className="relative mx-auto max-w-3xl px-4">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-10 left-[-60px] h-44 w-44 rounded-full bg-fuchsia-300/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 right-[-80px] h-56 w-56 rounded-full bg-indigo-300/50 blur-3xl" />

        <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/5">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 px-6 py-12 text-center text-white sm:px-10">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">일정관리</h1>
            <p className="mt-2 text-white/90">오늘 할 일을 깔끔하게 정리해보세요</p>
          </div>

          {/* Input bar */}
          <TodoForm onSubmit={addTodo} />

          {/* Toolbar */}
          <div className="flex flex-col gap-3 bg-white/80 px-6 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <Filter currentFilter={filter} onFilterChange={setFilter} />
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded-full bg-gray-900/5 px-3 py-1 font-medium text-gray-700">
                전체 {totalCount}
              </span>
              <span className="rounded-full bg-amber-500/10 px-3 py-1 font-medium text-amber-700">
                진행중 {activeCount}
              </span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-medium text-emerald-700">
                완료 {completedCount}
              </span>
            </div>
          </div>

          {error && (
            <div className="mx-6 mb-4 bg-red-50/90 border border-red-200 text-red-700 px-4 py-3 rounded-xl sm:mx-8">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* List */}
          <div className="bg-white">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex items-center gap-3 text-gray-500">
                  <svg className="animate-spin h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>로딩 중...</span>
                </div>
              </div>
            ) : (
              <TodoList
                todos={todos}
                onToggle={toggleTodo}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
