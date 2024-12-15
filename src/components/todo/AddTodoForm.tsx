import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TaskTemplates } from './TaskTemplates';
import { useTemplates } from '@/hooks/useTemplates';
import { useTaskFormHandlers } from '@/hooks/useTaskFormHandlers';
import { RepeatType } from '@/types/todo';

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  duration: z.number().refine(value => value === 60 || value === 120, 'Duration must be either 60 or 120 minutes'),
  repeat: z.enum(['none', 'daily', 'weekly']).default('none'),
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

type TodoFormData = z.infer<typeof todoSchema>;

interface AddTodoFormProps {
  onAdd: (title: string, startTime: string, endTime: string, repeat: RepeatType) => void;
}

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      duration: 60,
      repeat: 'none'
    }
  });

  const { handleTemplateSelect, handleStartTimeChange } = useTaskFormHandlers({ setValue });

  const startTime = watch('startTime');
  const duration = watch('duration');

  useEffect(() => {
    if (startTime) {
      const start = new Date(startTime);
      const end = new Date(start.getTime() + duration * 60000);
      setValue('endTime', end.toISOString().slice(0, 16));
    }
  }, [startTime, duration, setValue]);

  const onSubmit = (data: TodoFormData) => {
    onAdd(data.title, data.startTime, data.endTime, data.repeat);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                type="datetime-local"
                id="startTime"
                {...register('startTime')}
                onChange={handleStartTimeChange}
                step="3600"
              />
              {errors.startTime && (
                <p className="text-sm text-red-500 mt-1">{errors.startTime.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="duration">Duration</Label>
              <select
                id="duration"
                {...register('duration', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
              </select>
              {errors.duration && (
                <p className="text-sm text-red-500 mt-1">{errors.duration.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="repeat">Repeat</Label>
              <select
                id="repeat"
                {...register('repeat')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="none">No repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                type="datetime-local"
                id="endTime"
                {...register('endTime')}
                readOnly
                className="bg-gray-50"
              />
              {errors.endTime && (
                <p className="text-sm text-red-500 mt-1">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </form>
      </div>

      <TaskTemplates onSelectTemplate={handleTemplateSelect} />
    </div>
  );
}