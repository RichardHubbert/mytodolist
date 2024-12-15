import { Todo, TodoStatus } from '@/types/todo';
import { TodoColumn } from './TodoColumn';

interface TodoListProps {
  todos: Todo[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TodoStatus) => void;
  onRemoveTodo: (todoId: string) => void;
}

export function TodoList({ todos, onDragOver, onDrop, onRemoveTodo }: TodoListProps) {
  const filterTodos = (status: TodoStatus) => 
    todos.filter(todo => todo.status === status);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <TodoColumn
        title="To Do"
        todos={filterTodos('todo')}
        onDragOver={onDragOver}
        onDrop={onDrop}
        status="todo"
        onRemoveTodo={onRemoveTodo}
      />
      <TodoColumn
        title="In Progress"
        todos={filterTodos('inprogress')}
        onDragOver={onDragOver}
        onDrop={onDrop}
        status="inprogress"
        onRemoveTodo={onRemoveTodo}
      />
      <TodoColumn
        title="Done"
        todos={filterTodos('done')}
        onDragOver={onDragOver}
        onDrop={onDrop}
        status="done"
        onRemoveTodo={onRemoveTodo}
      />
    </div>
  );
}