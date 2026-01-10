'use client';

import { Job, JobStatus } from '@/types/kanban';
import { JobCard } from './job-card';
import { useState } from 'react';

interface KanbanColumnProps {
  title: string;
  status: JobStatus;
  jobs: Job[];
  selectedJobIds: Set<string>;
  onJobSelect: (id: string) => void;
  onDrop: (jobId: string, targetStatus: JobStatus) => void;
}

const statusLabels: Record<JobStatus, string> = {
  pending: 'Pending',
  sent: 'Sent',
  reply: 'Reply',
  interview: 'Interview',
};

export function KanbanColumn({
  title,
  status,
  jobs,
  selectedJobIds,
  onJobSelect,
  onDrop,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const jobId = e.dataTransfer.getData('jobId');
    const sourceStatus = e.dataTransfer.getData('sourceStatus');

    if (jobId && sourceStatus !== status) {
      onDrop(jobId, status);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg border border-gray-200">
      {/* Sticky header */}
      <div
        className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 rounded-t-lg cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">{statusLabels[status]}</h2>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center min-w-6 h-5 px-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
              {jobs.length}
            </span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-100 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content area */}
      {!isCollapsed && (
        <div
          className={`
            flex-1 overflow-y-auto p-3 space-y-3
            ${isDragOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {jobs.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">
              Drag jobs here
            </div>
          ) : (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={selectedJobIds.has(job.id)}
                onSelect={onJobSelect}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
