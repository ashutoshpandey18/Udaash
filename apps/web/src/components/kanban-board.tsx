'use client';

import { useState, useEffect, useCallback } from 'react';
import { Job, JobStatus, Column } from '@/types/kanban';
import { mockJobs } from '@/lib/mock-jobs';
import { KanbanColumn } from './kanban-column';

interface KanbanBoardProps {
  onVoiceCommand?: (command: string) => void;
}

export function KanbanBoard({ onVoiceCommand }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
  const [groupBy, setGroupBy] = useState<'none' | 'market' | 'workMode'>('none');

  // Initialize columns
  useEffect(() => {
    const statuses: JobStatus[] = ['pending', 'sent', 'reply', 'interview'];
    const initialColumns: Column[] = statuses.map((status) => ({
      id: status,
      title: status,
      jobs: mockJobs.filter((job) => job.status === status),
    }));
    setColumns(initialColumns);
  }, []);

  // Handle job selection
  const handleJobSelect = useCallback((jobId: string) => {
    setSelectedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback((jobId: string, targetStatus: JobStatus) => {
    setColumns((prevColumns) => {
      const nextColumns = prevColumns.map((col) => {
        // Remove job from source column
        const jobs = col.jobs.filter((j) => j.id !== jobId);

        // Add job to target column
        if (col.id === targetStatus) {
          const job = prevColumns
            .flatMap((c) => c.jobs)
            .find((j) => j.id === jobId);
          if (job) {
            jobs.push({ ...job, status: targetStatus });
          }
        }

        return { ...col, jobs };
      });
      return nextColumns;
    });
  }, []);

  // Handle batch actions
  const handleBatchMove = useCallback((targetStatus: JobStatus) => {
    if (selectedJobIds.size === 0) return;

    setColumns((prevColumns) => {
      const selectedJobs: Job[] = [];

      // Collect selected jobs and remove from all columns
      const nextColumns = prevColumns.map((col) => {
        const jobs = col.jobs.filter((job) => {
          if (selectedJobIds.has(job.id)) {
            selectedJobs.push({ ...job, status: targetStatus });
            return false;
          }
          return true;
        });
        return { ...col, jobs };
      });

      // Add selected jobs to target column
      return nextColumns.map((col) => {
        if (col.id === targetStatus) {
          return { ...col, jobs: [...col.jobs, ...selectedJobs] };
        }
        return col;
      });
    });

    setSelectedJobIds(new Set());
  }, [selectedJobIds]);

  const handleBatchArchive = useCallback(() => {
    if (selectedJobIds.size === 0) return;

    const confirmed = window.confirm(`Archive ${selectedJobIds.size} selected job(s)?`);
    if (!confirmed) return;

    setColumns((prevColumns) =>
      prevColumns.map((col) => ({
        ...col,
        jobs: col.jobs.filter((job) => !selectedJobIds.has(job.id)),
      }))
    );

    setSelectedJobIds(new Set());
  }, [selectedJobIds]);

  // Handle grouping
  const handleGroupBy = useCallback((type: 'market' | 'workMode') => {
    setGroupBy(type);
    // Grouping logic would sort/organize jobs within columns
    // For now, we just update the state
  }, []);

  // Voice command integration
  useEffect(() => {
    if (!onVoiceCommand) return;

    const handleVoiceCommand = (command: string) => {
      const lower = command.toLowerCase();

      // Grouping commands
      if (lower.includes('group remote') || lower.includes('show remote')) {
        handleGroupBy('workMode');
      } else if (lower.includes('group market') || lower.includes('group by market')) {
        handleGroupBy('market');
      } else if (lower.includes('archive selected')) {
        handleBatchArchive();
      }
    };

    onVoiceCommand(handleVoiceCommand as any);
  }, [onVoiceCommand, handleGroupBy, handleBatchArchive]);

  // Clear selection
  const handleClearSelection = useCallback(() => {
    setSelectedJobIds(new Set());
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      {selectedJobIds.size > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-blue-900">
              {selectedJobIds.size} selected
            </span>
            <button
              onClick={handleClearSelection}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBatchMove('pending')}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              → Pending
            </button>
            <button
              onClick={() => handleBatchMove('sent')}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              → Sent
            </button>
            <button
              onClick={() => handleBatchMove('reply')}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              → Reply
            </button>
            <button
              onClick={() => handleBatchMove('interview')}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              → Interview
            </button>
            <button
              onClick={handleBatchArchive}
              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-300 rounded hover:bg-red-50"
            >
              Archive
            </button>
          </div>
        </div>
      )}

      {/* Kanban columns */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full gap-4 p-4 min-w-max">
          {columns.map((column) => (
            <div key={column.id} className="w-80 shrink-0">
              <KanbanColumn
                title={column.title}
                status={column.id}
                jobs={column.jobs}
                selectedJobIds={selectedJobIds}
                onJobSelect={handleJobSelect}
                onDrop={handleDrop}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: Scroll snap hint */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .flex.h-full.gap-4 {
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }
          .w-80 {
            scroll-snap-align: start;
            width: 90vw;
          }
        }
      `}</style>
    </div>
  );
}
