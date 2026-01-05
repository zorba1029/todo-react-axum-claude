import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import { useTodos } from './hooks/useTodos';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Filter from './components/Filter';
import theme from './theme';

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          py: { xs: 5, sm: 6 },
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          position: 'relative',
        }}
      >
        <Container maxWidth="md">
          {/* Decorative blobs */}
          <Box
            sx={{
              position: 'absolute',
              top: -40,
              left: -60,
              width: 176,
              height: 176,
              borderRadius: '50%',
              background: 'rgba(233, 121, 249, 0.3)',
              filter: 'blur(64px)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -64,
              right: -80,
              width: 224,
              height: 224,
              borderRadius: '50%',
              background: 'rgba(165, 180, 252, 0.3)',
              filter: 'blur(64px)',
              pointerEvents: 'none',
            }}
          />

          <Paper
            elevation={24}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 4,
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #d946ef 100%)',
                px: { xs: 3, sm: 5 },
                py: 6,
                textAlign: 'center',
                color: 'white',
              }}
            >
              <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
                일정관리
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                오늘 할 일을 깔끔하게 정리해보세요
              </Typography>
            </Box>

            {/* Input bar */}
            <TodoForm onSubmit={addTodo} />

            {/* Toolbar */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1.5,
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                px: { xs: 3, sm: 4 },
                py: 2,
                backdropFilter: 'blur(8px)',
              }}
            >
              <Filter currentFilter={filter} onFilterChange={setFilter} />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={`전체 ${totalCount}`} size="small" sx={{ fontWeight: 600 }} />
                <Chip
                  label={`진행중 ${activeCount}`}
                  size="small"
                  sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: 'rgb(180, 83, 9)', fontWeight: 600 }}
                />
                <Chip
                  label={`완료 ${completedCount}`}
                  size="small"
                  sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: 'rgb(6, 95, 70)', fontWeight: 600 }}
                />
              </Box>
            </Box>

            {error && (
              <Box sx={{ px: { xs: 3, sm: 4 }, pt: 2 }}>
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              </Box>
            )}

            {/* List */}
            <Box sx={{ bgcolor: 'white' }}>
              {loading ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 10,
                    gap: 2,
                  }}
                >
                  <CircularProgress size={24} />
                  <Typography color="text.secondary">로딩 중...</Typography>
                </Box>
              ) : (
                <TodoList
                  todos={todos}
                  onToggle={toggleTodo}
                  onUpdate={updateTodo}
                  onDelete={deleteTodo}
                />
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
