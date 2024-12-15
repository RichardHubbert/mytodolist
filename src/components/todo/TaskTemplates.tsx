import { useState } from 'react';
import { Clock, Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTemplates } from '@/hooks/useTemplates';
import { AddTemplateForm } from './AddTemplateForm';
import { EditTemplateDay } from './EditTemplateDay';
import { TaskTemplate } from '@/types/todo';

interface TaskTemplatesProps {
  onSelectTemplate: (title: string, duration: number) => void;
}

export function TaskTemplates({ onSelectTemplate }: TaskTemplatesProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TaskTemplate | null>(null);
  const { templates, addTemplate, removeTemplate, updateTemplate } = useTemplates();

  const groupedTemplates = templates.reduce((acc, template) => {
    const category = template.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(template);
    return acc;
  }, {} as Record<string, typeof templates>);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Quick Templates
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Template
        </Button>
      </div>

      {showAddForm && (
        <AddTemplateForm
          onAdd={(template) => {
            addTemplate(template);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingTemplate && (
        <EditTemplateDay
          template={editingTemplate}
          onSave={(dayOfWeek) => {
            updateTemplate({ ...editingTemplate, dayOfWeek });
            setEditingTemplate(null);
          }}
          onCancel={() => setEditingTemplate(null)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500">{category}</h3>
            <div className="space-y-2">
              {categoryTemplates.map((template) => (
                <div
                  key={template.id}
                  className="relative group"
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-3"
                    onClick={() => onSelectTemplate(template.title, template.duration)}
                  >
                    <div className="text-left flex-1">
                      <div className="font-medium">{template.title}</div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>
                          Duration: {template.duration >= 60 
                            ? `${template.duration / 60} hour${template.duration > 60 ? 's' : ''}`
                            : `${template.duration} min`}
                        </div>
                        {template.dayOfWeek && (
                          <div className="text-blue-600">
                            {template.dayOfWeek.charAt(0).toUpperCase() + template.dayOfWeek.slice(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  </Button>
                  <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 bg-white shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTemplate(template);
                      }}
                    >
                      <Edit2 className="h-4 w-4 text-blue-500" />
                    </Button>
                    {template.isCustom && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 bg-white shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTemplate(template.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}