import { ClipboardList } from 'lucide-react';

export function Header() {
  return (
    <div className="flex items-center justify-center mb-8">
      <ClipboardList className="w-8 h-8 text-blue-600 mr-2" />
      <h1 className="text-3xl font-bold text-gray-900">My Todo List</h1>
    </div>
  );
}