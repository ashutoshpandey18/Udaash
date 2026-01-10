import { KanbanBoard } from '@/components/kanban-board';
import Link from 'next/link';

export default function KanbanPage() {
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Job Applications</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            Drag cards to update status
          </span>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="flex-1 overflow-hidden">
        <KanbanBoard />
      </main>
    </div>
  );
}
