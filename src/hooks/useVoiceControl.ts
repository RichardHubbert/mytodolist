import { useState, useEffect, useCallback } from 'react';
import { Todo, TodoStatus } from '@/types/todo';

interface VoiceControlProps {
  onAddTodo: (title: string, startTime: string, endTime: string) => void;
  onUpdateStatus: (todoId: string, status: TodoStatus) => void;
  todos: Todo[];
}

export function useVoiceControl({ onAddTodo, onUpdateStatus, todos }: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const processCommand = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase();

    // Add task command
    // Example: "add task walk the dog at 2 PM for 1 hour"
    const addTaskMatch = lowerCommand.match(/add task (.*?) at (\d{1,2} [ap]m) for (\d+) hour/i);
    if (addTaskMatch) {
      const [_, title, timeStr, duration] = addTaskMatch;
      const startTime = new Date();
      const [hour, period] = timeStr.split(' ');
      startTime.setHours(
        period.toLowerCase() === 'pm' ? parseInt(hour) + 12 : parseInt(hour),
        0, 0, 0
      );
      const endTime = new Date(startTime.getTime() + parseInt(duration) * 60 * 60 * 1000);
      
      onAddTodo(
        title,
        startTime.toISOString(),
        endTime.toISOString()
      );
      return `Added task: ${title}`;
    }

    // Move task command
    // Example: "move task walk the dog to in progress"
    const moveTaskMatch = lowerCommand.match(/move task (.*?) to (todo|in progress|done)/i);
    if (moveTaskMatch) {
      const [_, taskTitle, targetStatus] = moveTaskMatch;
      const todo = todos.find(t => t.title.toLowerCase().includes(taskTitle.toLowerCase()));
      if (todo) {
        const statusMap: Record<string, TodoStatus> = {
          'todo': 'todo',
          'in progress': 'inprogress',
          'done': 'done'
        };
        onUpdateStatus(todo.id, statusMap[targetStatus.toLowerCase()]);
        return `Moved task: ${taskTitle} to ${targetStatus}`;
      }
      return `Task not found: ${taskTitle}`;
    }

    return 'Command not recognized. Try "add task [title] at [time] for [duration] hour" or "move task [title] to [status]"';
  }, [onAddTodo, onUpdateStatus, todos]);

  const startListening = useCallback(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('Listening...');
      };

      recognition.onresult = (event: any) => {
        const command = event.results[0][0].transcript;
        setTranscript(command);
        const response = processCommand(command);
        setTranscript(response);
      };

      recognition.onerror = (event: any) => {
        setTranscript(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      setTranscript('Speech recognition not supported in this browser.');
    }
  }, [processCommand]);

  return {
    isListening,
    transcript,
    startListening
  };
}