import { Todo, TodoStatus } from '@/types/todo';
import { TodoCard } from './TodoCard';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';

interface TodoColumnProps {
  title: string;
  todos: Todo[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TodoStatus) => void;
  status: TodoStatus;
  onRemoveTodo: (todoId: string) => void;
}

export function TodoColumn({ title, todos, onDragOver, onDrop, status, onRemoveTodo }: TodoColumnProps) {
  const [isDropTarget, setIsDropTarget] = useState(false);
  const columnRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent | TouchEvent, todoId: string) => {
    if (e instanceof DragEvent) {
      e.dataTransfer.setData('todoId', todoId);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const columns = document.querySelectorAll('[data-column]');
    
    columns.forEach((column) => {
      const rect = column.getBoundingClientRect();
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        (column as HTMLElement).style.opacity = '0.7';
      } else {
        (column as HTMLElement).style.opacity = '1';
      }
    });
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const touch = e.changedTouches[0];
    const columns = document.querySelectorAll('[data-column]');
    
    columns.forEach((column) => {
      (column as HTMLElement).style.opacity = '1';
      const rect = column.getBoundingClientRect();
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        const status = column.getAttribute('data-status') as TodoStatus;
        const todoId = column.getAttribute('data-dragging-id');
        if (todoId && status) {
          const mockEvent = { preventDefault: () => {}, dataTransfer: { getData: () => todoId } };
          onDrop(mockEvent as any, status);
        }
      }
    });
  };

  return (
    <div
      ref={columnRef}
      data-column
      data-status={status}
      className={cn(
        "p-4 rounded-lg shadow-sm w-full border-2 transition-all duration-200 min-h-[400px]",
        {
          'bg-green-50 border-green-200': status === 'todo',
          'bg-amber-50 border-amber-200': status === 'inprogress',
          'bg-purple-50 border-purple-200': status === 'done',
        },
        isDropTarget && "border-dashed scale-[1.02]"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDropTarget(true);
      }}
      onDragLeave={() => setIsDropTarget(false)}
      onDrop={(e) => {
        setIsDropTarget(false);
        onDrop(e, status);
      }}
      onTouchMove={handleTouchMove as any}
      onTouchEnd={handleTouchEnd as any}
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-700">{title}</h2>
      <div className="space-y-3">
        {todos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            status={status}
            onDragStart={handleDragStart}
            onRemove={onRemoveTodo}
          />
        ))}
        {todos.length === 0 && (
          <div className="h-32 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed rounded-lg">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}