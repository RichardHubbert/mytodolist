import { TaskTemplate } from '@/types/todo';

export const defaultTemplates: TaskTemplate[] = [
  {
    id: 'wash-car',
    title: 'Wash the car',
    duration: 120,
    category: 'Maintenance',
    dayOfWeek: 'saturday'
  },
  {
    id: 'walk-dog',
    title: 'Walk the dog',
    duration: 60,
    category: 'Pets',
    dayOfWeek: 'monday'
  },
];