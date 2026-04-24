import React from 'react';
import { formatDate, getStatusColor } from '../utils/helpers';
import { FiCheckCircle, FiCircle, FiClock } from 'react-icons/fi';

const MilestoneTracker = ({ milestones, onUpdate, canEdit = false }) => {
  const handleStatusToggle = (milestoneId, currentStatus) => {
    if (canEdit && onUpdate) {
      const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
      onUpdate(milestoneId, { status: newStatus });
    }
  };

  if (!milestones || milestones.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500 dark:text-primary-400">
        No milestones defined for this project
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((milestone, index) => (
        <div
          key={milestone._id}
          className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-primary-800/30 rounded-xl p-5 hover:shadow-card dark:hover:border-primary-700/50 transition-all duration-300"
        >
          <div className="flex items-start space-x-4">
            {/* Status Icon */}
            <button
              onClick={() => handleStatusToggle(milestone._id, milestone.status)}
              disabled={!canEdit}
              className={`mt-1 ${canEdit ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            >
              {milestone.status === 'Completed' ? (
                <FiCheckCircle className="text-green-500 dark:text-green-400" size={26} />
              ) : (
                <FiCircle className="text-neutral-400 dark:text-primary-600" size={26} />
              )}
            </button>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Milestone {index + 1}
                  </h4>
                  <p className="text-sm text-neutral-700 dark:text-primary-200 mt-1">{milestone.description}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(milestone.status)}`}>
                  {milestone.status}
                </span>
              </div>

              {/* Deadline */}
              <div className="flex items-center space-x-4 mt-3 text-sm text-neutral-500 dark:text-primary-400">
                <div className="flex items-center space-x-1">
                  <FiClock size={14} />
                  <span>Deadline: {formatDate(milestone.deadline)}</span>
                </div>
                {milestone.completedDate && (
                  <div className="flex items-center space-x-1">
                    <FiCheckCircle size={14} />
                    <span>Completed: {formatDate(milestone.completedDate)}</span>
                  </div>
                )}
              </div>

              {/* Evidence */}
              {milestone.evidenceUrl && (
                <div className="mt-3">
                  <a
                    href={milestone.evidenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline font-medium"
                  >
                    View Evidence Document
                  </a>
                </div>
              )}

              {/* Remarks */}
              {milestone.remarks && (
                <div className="mt-3 p-3 bg-secondary-50 dark:bg-primary-900/30 rounded-lg text-sm text-neutral-700 dark:text-primary-200">
                  <span className="font-semibold">Remarks:</span> {milestone.remarks}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Progress Summary */}
      <div className="bg-primary-50 dark:bg-primary-900/40 border border-primary-200 dark:border-primary-700/50 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-primary-900 dark:text-primary-200">Overall Progress</span>
          <span className="text-sm font-bold text-primary-900 dark:text-white">
            {milestones.filter((m) => m.status === 'Completed').length} of {milestones.length} completed
          </span>
        </div>
        <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((milestones.filter((m) => m.status === 'Completed').length / milestones.length) * 100).toFixed(0)}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneTracker;
