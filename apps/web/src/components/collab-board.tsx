'use client';

// =============================================================================
// COLLABORATION BOARD - DAY 13 (CALM AUTHORITY)
// =============================================================================
// Shared Kanban boards with permission controls
// =============================================================================

import { useState, useEffect } from 'react';
import type { CollabBoard, CollabJob, CollabMember, CollabPermission } from '@/types/network';
import { getCollabBoards, saveCollabBoards, createCollabBoard, hasPermission } from '@/lib/network';

interface CollabBoardViewProps {
  boardId?: string;
}

export function CollabBoardView({ boardId }: CollabBoardViewProps) {
  const [mounted, setMounted] = useState(false);
  const [boards, setBoards] = useState<CollabBoard[]>([]);
  const [activeBoard, setActiveBoard] = useState<CollabBoard | null>(null);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');

  // Mock current user
  const currentUserId = 'current-user';
  const currentUserName = 'You';

  useEffect(() => {
    setMounted(true);
    loadBoards();
  }, []);

  useEffect(() => {
    if (boardId && boards.length > 0) {
      const board = boards.find((b) => b.id === boardId);
      if (board) setActiveBoard(board);
    } else if (boards.length > 0 && !activeBoard) {
      const firstBoard = boards[0];
      if (firstBoard) setActiveBoard(firstBoard);
    }
  }, [boardId, boards, activeBoard]);

  const loadBoards = () => {
    const storedBoards = getCollabBoards();

    // If no boards, create a demo board
    if (storedBoards.length === 0) {
      const demoBoard = createCollabBoard(
        'My First Shared Board',
        'Collaborate on job applications with your network',
        currentUserId,
        currentUserName
      );

      // Add demo jobs
      demoBoard.jobs = [
        {
          id: 'job-1',
          boardId: demoBoard.id,
          title: 'Senior Product Manager',
          company: 'TechCorp',
          location: 'Bangalore',
          status: 'backlog',
          addedBy: currentUserId,
          addedAt: new Date(),
          url: 'https://example.com/job1',
        },
        {
          id: 'job-2',
          boardId: demoBoard.id,
          title: 'Engineering Lead',
          company: 'StartupXYZ',
          location: 'Mumbai',
          status: 'applied',
          addedBy: currentUserId,
          addedAt: new Date(),
        },
      ];

      saveCollabBoards([demoBoard]);
      setBoards([demoBoard]);
    } else {
      setBoards(storedBoards);
    }
  };

  const handleCreateBoard = () => {
    if (!newBoardName.trim()) return;

    const newBoard = createCollabBoard(newBoardName, newBoardDesc, currentUserId, currentUserName);
    const updatedBoards = [...boards, newBoard];
    saveCollabBoards(updatedBoards);
    setBoards(updatedBoards);
    setActiveBoard(newBoard);
    setShowCreateBoard(false);
    setNewBoardName('');
    setNewBoardDesc('');
  };

  const handleAddJob = (status: CollabJob['status']) => {
    if (!activeBoard) return;
    if (!hasPermission(activeBoard, currentUserId, 'edit')) {
      alert('You do not have permission to add jobs to this board');
      return;
    }

    const title = prompt('Job title:');
    if (!title) return;

    const company = prompt('Company:');
    if (!company) return;

    const newJob: CollabJob = {
      id: `job-${Date.now()}`,
      boardId: activeBoard.id,
      title,
      company,
      location: 'Remote',
      status,
      addedBy: currentUserId,
      addedAt: new Date(),
    };

    const updatedBoard = {
      ...activeBoard,
      jobs: [...activeBoard.jobs, newJob],
      updatedAt: new Date(),
    };

    const updatedBoards = boards.map((b) => (b.id === activeBoard.id ? updatedBoard : b));
    saveCollabBoards(updatedBoards);
    setBoards(updatedBoards);
    setActiveBoard(updatedBoard);
  };

  const handleMoveJob = (jobId: string, newStatus: CollabJob['status']) => {
    if (!activeBoard) return;
    if (!hasPermission(activeBoard, currentUserId, 'edit')) return;

    const updatedJobs = activeBoard.jobs.map((job) =>
      job.id === jobId ? { ...job, status: newStatus } : job
    );

    const updatedBoard = {
      ...activeBoard,
      jobs: updatedJobs,
      updatedAt: new Date(),
    };

    const updatedBoards = boards.map((b) => (b.id === activeBoard.id ? updatedBoard : b));
    saveCollabBoards(updatedBoards);
    setBoards(updatedBoards);
    setActiveBoard(updatedBoard);
  };

  if (!mounted) {
    return <div className="text-neutral-400">Loading boards...</div>;
  }

  const columns: Array<{ id: CollabJob['status']; label: string; color: string }> = [
    { id: 'backlog', label: 'Backlog', color: 'neutral' },
    { id: 'applied', label: 'Applied', color: 'blue' },
    { id: 'interview', label: 'Interview', color: 'yellow' },
    { id: 'offer', label: 'Offer', color: 'green' },
    { id: 'rejected', label: 'Rejected', color: 'red' },
  ];

  return (
    <div className="space-y-6">
      {/* Board Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={activeBoard?.id || ''}
            onChange={(e) => {
              const board = boards.find((b) => b.id === e.target.value);
              if (board) setActiveBoard(board);
            }}
            className="bg-neutral-800 text-white px-4 py-2 rounded border border-neutral-700 focus:border-violet-500 outline-none"
          >
            {boards.map((board) => (
              <option key={board.id} value={board.id}>
                {board.name}
              </option>
            ))}
          </select>

          {activeBoard && (
            <div className="flex items-center space-x-2 text-sm text-neutral-400">
              <span>{activeBoard.members.length} members</span>
              <span>•</span>
              <span>{activeBoard.jobs.length} jobs</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowCreateBoard(true)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded transition-colors"
        >
          + New Board
        </button>
      </div>

      {/* Board Info */}
      {activeBoard && (
        <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
          <h2 className="text-lg font-semibold text-white mb-1">{activeBoard.name}</h2>
          {activeBoard.description && (
            <p className="text-sm text-neutral-400 mb-3">{activeBoard.description}</p>
          )}
          <div className="flex items-center space-x-4 text-xs text-neutral-500">
            <span>Owner: {activeBoard.ownerName}</span>
            <span>•</span>
            <span>Created {activeBoard.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      {activeBoard && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {columns.map((column) => {
            const columnJobs = activeBoard.jobs.filter((job) => job.status === column.id);

            return (
              <div key={column.id} className="flex flex-col space-y-3">
                {/* Column Header */}
                <div className="flex items-center justify-between bg-neutral-800 rounded-lg p-3 border border-neutral-700">
                  <h3 className="text-sm font-semibold text-white">
                    {column.label}
                    <span className="ml-2 text-xs text-neutral-400">({columnJobs.length})</span>
                  </h3>
                  {hasPermission(activeBoard, currentUserId, 'edit') && (
                    <button
                      onClick={() => handleAddJob(column.id)}
                      className="text-neutral-400 hover:text-white text-lg leading-none"
                      title="Add job"
                    >
                      +
                    </button>
                  )}
                </div>

                {/* Jobs */}
                <div className="space-y-2 min-h-[200px]">
                  {columnJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-neutral-900 rounded-lg p-3 border border-neutral-700/50 hover:border-violet-500/50 transition-colors cursor-move"
                      draggable
                    >
                      <h4 className="text-sm font-semibold text-white mb-1">{job.title}</h4>
                      <p className="text-xs text-neutral-400 mb-2">{job.company}</p>
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span>{job.location}</span>
                        {job.url && (
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-400 hover:text-violet-300"
                          >
                            Link ↗
                          </a>
                        )}
                      </div>

                      {/* Quick Move Buttons */}
                      {hasPermission(activeBoard, currentUserId, 'edit') && (
                        <div className="flex gap-1 mt-2">
                          {columns
                            .filter((c) => c.id !== column.id)
                            .slice(0, 2)
                            .map((targetCol) => (
                              <button
                                key={targetCol.id}
                                onClick={() => handleMoveJob(job.id, targetCol.id)}
                                className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2 py-1 rounded"
                              >
                                → {targetCol.label}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Board Modal */}
      {showCreateBoard && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateBoard(false)}
        >
          <div
            className="bg-neutral-900 rounded-lg p-6 max-w-md w-full border border-neutral-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-white mb-4">Create Collaboration Board</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-300 mb-2">Board Name</label>
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="e.g., PM Job Hunt 2024"
                  className="w-full bg-neutral-800 text-white px-4 py-2 rounded border border-neutral-700 focus:border-violet-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newBoardDesc}
                  onChange={(e) => setNewBoardDesc(e.target.value)}
                  placeholder="What's this board for?"
                  rows={3}
                  className="w-full bg-neutral-800 text-white px-4 py-2 rounded border border-neutral-700 focus:border-violet-500 outline-none resize-none"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleCreateBoard}
                  className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded transition-colors"
                >
                  Create Board
                </button>
                <button
                  onClick={() => setShowCreateBoard(false)}
                  className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
