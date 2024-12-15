import React from 'react';
import { Todo } from '../types/todo';

interface TodoColumnProps {
  title: string;
  todos: Todo[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function TodoColumn({ title, todos, onDragOver, onDrop }: TodoColumnProps) {
  return (
    <div
      className="bg-gray-50 p-4 rounded-lg shadow-sm w-full"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-700">{title}</h2>
      <div className="space-y-3">
        {todos.map((todo) => (
          <div
            key={todo.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('todoId', todo.id)}
            className="bg-white p-4 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-gray-800">{todo.title}</h3>
            <div className="mt-2 text-sm text-gray-600">
              <p>Start: {todo.startTime}</p>
              <p>End: {todo.endTime}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}