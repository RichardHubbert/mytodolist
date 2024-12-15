import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceControl } from '@/hooks/useVoiceControl';
import { Todo, TodoStatus } from '@/types/todo';

interface VoiceControlProps {
  onAddTodo: (title: string, startTime: string, endTime: string) => void;
  onUpdateStatus: (todoId: string, status: TodoStatus) => void;
  todos: Todo[];
}

export function VoiceControl({ onAddTodo, onUpdateStatus, todos }: VoiceControlProps) {
  const { isListening, transcript, startListening } = useVoiceControl({
    onAddTodo,
    onUpdateStatus,
    todos
  });

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-4 bg-white p-4 rounded-lg shadow-lg">
      <div className="text-sm">
        {transcript || 'Click the microphone to start voice commands'}
      </div>
      <Button
        variant={isListening ? 'destructive' : 'default'}
        size="icon"
        onClick={startListening}
        className="relative"
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        {isListening && (
          <span className="absolute -top-1 -right-1 h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </Button>
    </div>
  );
}