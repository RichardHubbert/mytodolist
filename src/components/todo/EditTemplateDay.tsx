import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TaskTemplate, DayOfWeek } from '@/types/todo';

interface EditTemplateDayProps {
  template: TaskTemplate;
  onSave: (dayOfWeek: DayOfWeek | undefined) => void;
  onCancel: () => void;
}

export function EditTemplateDay({ template, onSave, onCancel }: EditTemplateDayProps) {
  const daysOfWeek: DayOfWeek[] = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
        <h3 className="text-lg font-semibold">Edit Day for "{template.title}"</h3>
        
        <div>
          <Label htmlFor="dayOfWeek">Day of Week</Label>
          <select
            id="dayOfWeek"
            defaultValue={template.dayOfWeek}
            onChange={(e) => onSave(e.target.value as DayOfWeek || undefined)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">No specific day</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}