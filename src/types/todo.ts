export type TodoStatus = 'todo' | 'inprogress' | 'done';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type RepeatType = 'none' | 'daily' | 'weekly';

export interface Todo {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: TodoStatus;
  category?: string;
  dayOfWeek?: DayOfWeek;
  repeat?: RepeatType;
}

export interface TaskTemplate {
  id: string;
  title: string;
  duration: number; // in minutes
  category?: string;
  isCustom?: boolean;
  dayOfWeek?: DayOfWeek;
  repeat?: RepeatType;
}