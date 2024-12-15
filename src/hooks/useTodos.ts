import { useState, useEffect } from 'react';
import { Todo, TodoStatus, RepeatType } from '@/types/todo';

const STORAGE_KEY = 'todos';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Load todos from localStorage on initial mount
  useEffect(() => {
    const storedTodos = localStorage.getItem(STORAGE_KEY);
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // Check for daily tasks that need to be created
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dailyTasks = todos.filter(todo => 
      todo.repeat === 'daily' && 
      new Date(todo.startTime) < tomorrow &&
      todo.status !== 'done'
    );

    dailyTasks.forEach(todo => {
      const nextStart = new Date(todo.startTime);
      const nextEnd = new Date(todo.endTime);
      
      nextStart.setDate(nextStart.getDate() + 1);
      nextEnd.setDate(nextEnd.getDate() + 1);

      if (nextStart > now) {
        const newTodo: Todo = {
          ...todo,
          id: crypto.randomUUID(),
          startTime: nextStart.toISOString(),
          endTime: nextEnd.toISOString(),
          status: 'todo'
        };

        setTodos(prev => [...prev, newTodo]);
      }
    });
  }, [todos]);

  const addTodo = (title: string, startTime: string, endTime: string, repeat: RepeatType = 'none') => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      startTime,
      endTime,
      status: 'todo',
      repeat,
    };
    setTodos([...todos, newTodo]);
  };

  const updateTodoStatus = (todoId: string, status: TodoStatus) => {
    setTodos(todos.map(todo => 
      todo.id === todoId ? { ...todo, status } : todo
    ));

    // Handle repeating todos
    const todo = todos.find(t => t.id === todoId);
    if (todo && todo.repeat && status === 'done') {
      const nextStart = new Date(todo.startTime);
      const nextEnd = new Date(todo.endTime);
      
      if (todo.repeat === 'daily') {
        nextStart.setDate(nextStart.getDate() + 1);
        nextEnd.setDate(nextEnd.getDate() + 1);
      } else if (todo.repeat === 'weekly') {
        nextStart.setDate(nextStart.getDate() + 7);
        nextEnd.setDate(nextEnd.getDate() + 7);
      }

      const newTodo: Todo = {
        ...todo,
        id: crypto.randomUUID(),
        startTime: nextStart.toISOString(),
        endTime: nextEnd.toISOString(),
        status: 'todo'
      };

      setTodos(prev => [...prev, newTodo]);
    }
  };

  const filterTodos = (status: TodoStatus) => 
    todos.filter(todo => todo.status === status);

  const removeTodo = (todoId: string) => {
    const todoToRemove = todos.find(t => t.id === todoId);
    if (todoToRemove?.repeat) {
      // If it's a repeating task, ask for confirmation
      if (window.confirm('This is a repeating task. Do you want to remove all future occurrences?')) {
        setTodos(todos.filter(todo => 
          !(todo.title === todoToRemove.title && todo.repeat === todoToRemove.repeat)
        ));
      } else {
        setTodos(todos.filter(todo => todo.id !== todoId));
      }
    } else {
      setTodos(todos.filter(todo => todo.id !== todoId));
    }
  };

  return {
    todos,
    addTodo,
    updateTodoStatus,
    filterTodos,
    removeTodo,
  };
}