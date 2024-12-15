import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TaskTemplate, DayOfWeek } from '@/types/todo';

const templateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  duration: z.number().refine(value => value === 60 || value === 120, 'Duration must be either 60 or 120 minutes'),
  category: z.string().min(1, 'Category is required'),
  dayOfWeek: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).optional(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface AddTemplateFormProps {
  onAdd: (template: Omit<TaskTemplate, 'id' | 'isCustom'>) => void;
  onCancel: () => void;
}

export function AddTemplateForm({ onAdd, onCancel }: AddTemplateFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      duration: 60,
    },
  });

  const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <form onSubmit={handleSubmit(onAdd)} className="space-y-4 bg-gray-50 p-4 rounded-lg border">
      <div>
        <Label htmlFor="title">Template Title</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Enter template title"
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          {...register('category')}
          placeholder="Enter category (e.g., Work, Home, Personal)"
        />
        {errors.category && (
          <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
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
        <Label htmlFor="dayOfWeek">Preferred Day of Week</Label>
        <select
          id="dayOfWeek"
          {...register('dayOfWeek')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select a day</option>
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </option>
          ))}
        </select>
        {errors.dayOfWeek && (
          <p className="text-sm text-red-500 mt-1">{errors.dayOfWeek.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          <Plus className="w-4 h-4 mr-2" />
          Add Template
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}