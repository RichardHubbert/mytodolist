import { Header } from '@/components/layout/Header';
import { TodoList } from '@/components/todo/TodoList';
import { AddTodoForm } from '@/components/todo/AddTodoForm';
import { VoiceControl } from '@/components/VoiceControl';
import { useTodos } from '@/hooks/useTodos';
import { TodoStatus } from '@/types/todo';

function App() {
  const { todos, addTodo, updateTodoStatus, removeTodo } = useTodos();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TodoStatus) => {
    e.preventDefault();
    const todoId = e.dataTransfer.getData('todoId');
    updateTodoStatus(todoId, status);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />
        
        <div className="space-y-6">
          <AddTodoForm onAdd={addTodo} />
          
          <TodoList
            todos={todos}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onRemoveTodo={removeTodo}
          />
        </div>

        <VoiceControl
          onAddTodo={addTodo}
          onUpdateStatus={updateTodoStatus}
          todos={todos}
        />
      </div>
    </div>
  );
}

export default App;