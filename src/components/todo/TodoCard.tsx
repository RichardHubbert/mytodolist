import { Calendar, Trash2, Repeat, GripVertical } from 'lucide-react';
import { Todo, TodoStatus } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { generateICalEvent, downloadICalFile } from '@/lib/ical';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/date';
import { useState, useRef, useEffect } from 'react';

interface TodoCardProps {
  todo: Todo;
  status: TodoStatus;
  onDragStart: (e: React.DragEvent | TouchEvent, todoId: string) => void;
  onRemove: (todoId: string) => void;
}

export function TodoCard({ todo, status, onDragStart, onRemove }: TodoCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStartY) return;
    
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - touchStartY;

    if (Math.abs(deltaY) > 10) {
      onDragStart(e, todo.id);
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    card.addEventListener('touchstart', handleTouchStart);
    card.addEventListener('touchmove', handleTouchMove);

    return () => {
      card.removeEventListener('touchstart', handleTouchStart);
      card.removeEventListener('touchmove', handleTouchMove);
    };
  }, [todo.id, touchStartY]);

  const handleExportToICal = () => {
    const event = generateICalEvent(todo);
    const filename = `${todo.title.toLowerCase().replace(/\s+/g, '-')}.ics`;
    downloadICalFile(event, filename);
  };

  const cardColors = {
    todo: 'bg-green-100 hover:bg-green-200',
    inprogress: 'bg-amber-100 hover:bg-amber-200',
    done: 'bg-purple-100 hover:bg-purple-200',
  };

  return (
    <div
      ref={cardRef}
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        onDragStart(e, todo.id);
      }}
      onDragEnd={() => setIsDragging(false)}
      className={cn(
        "p-4 rounded-lg shadow-sm transition-all duration-200",
        cardColors[status],
        isDragging && "opacity-50 scale-95",
        "transform hover:-translate-y-1 hover:shadow-md",
        "touch-manipulation" // Improves touch handling
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <GripVertical className="h-5 w-5 text-gray-400 touch-handle" />
            <h3 className="font-medium text-gray-800">{todo.title}</h3>
          </div>
          {todo.repeat && todo.repeat !== 'none' && (
            <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
              <Repeat className="h-3 w-3" />
              <span>{todo.repeat === 'daily' ? 'Repeats daily' : 'Repeats weekly'}</span>
            </div>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="touch-manipulation"
            onClick={handleExportToICal}
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="touch-manipulation"
            onClick={() => onRemove(todo.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        <p>Start: {formatDateTime(todo.startTime)}</p>
        <p>End: {formatDateTime(todo.endTime)}</p>
      </div>
    </div>
  );
}