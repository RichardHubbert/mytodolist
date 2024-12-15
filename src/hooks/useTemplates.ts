import { useState, useEffect } from 'react';
import { TaskTemplate } from '@/types/todo';
import { defaultTemplates } from '@/data/taskTemplates';

const STORAGE_KEY = 'custom-templates';

export function useTemplates() {
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);

  useEffect(() => {
    const storedTemplates = localStorage.getItem(STORAGE_KEY);
    const customTemplates = storedTemplates ? JSON.parse(storedTemplates) : [];
    setTemplates([...defaultTemplates, ...customTemplates]);
  }, []);

  const addTemplate = (template: Omit<TaskTemplate, 'id' | 'isCustom'>) => {
    const newTemplate: TaskTemplate = {
      ...template,
      id: crypto.randomUUID(),
      isCustom: true,
    };

    const storedTemplates = localStorage.getItem(STORAGE_KEY);
    const customTemplates = storedTemplates ? JSON.parse(storedTemplates) : [];
    const updatedTemplates = [...customTemplates, newTemplate];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
    setTemplates([...defaultTemplates, ...updatedTemplates]);
  };

  const updateTemplate = (updatedTemplate: TaskTemplate) => {
    if (updatedTemplate.isCustom) {
      const storedTemplates = localStorage.getItem(STORAGE_KEY);
      const customTemplates = storedTemplates ? JSON.parse(storedTemplates) : [];
      const updatedTemplates = customTemplates.map((t: TaskTemplate) =>
        t.id === updatedTemplate.id ? updatedTemplate : t
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
      setTemplates([...defaultTemplates, ...updatedTemplates]);
    } else {
      // For default templates, update in memory only
      setTemplates(templates.map(t =>
        t.id === updatedTemplate.id ? updatedTemplate : t
      ));
    }
  };

  const removeTemplate = (templateId: string) => {
    const storedTemplates = localStorage.getItem(STORAGE_KEY);
    const customTemplates = storedTemplates ? JSON.parse(storedTemplates) : [];
    const updatedTemplates = customTemplates.filter((t: TaskTemplate) => t.id !== templateId);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
    setTemplates([...defaultTemplates, ...updatedTemplates]);
  };

  return {
    templates,
    addTemplate,
    updateTemplate,
    removeTemplate,
  };
}