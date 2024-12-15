import { UseFormSetValue } from 'react-hook-form';

interface UseTaskFormHandlersProps {
  setValue: UseFormSetValue<any>;
}

export function useTaskFormHandlers({ setValue }: UseTaskFormHandlersProps) {
  const handleTemplateSelect = (title: string, durationMinutes: number) => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    setValue('title', title);
    setValue('startTime', now.toISOString().slice(0, 16));
    setValue('duration', durationMinutes);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    date.setMinutes(0, 0, 0);
    setValue('startTime', date.toISOString().slice(0, 16));
  };

  return {
    handleTemplateSelect,
    handleStartTimeChange,
  };
}