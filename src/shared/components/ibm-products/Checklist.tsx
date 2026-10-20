import React, { useState } from 'react';
import {
  ProgressBar,
  Button,
  IconButton,
  Tag,
  Stack,
  ClickableTile,
} from '@carbon/react';
import {
  CheckmarkFilled,
  CircleDash,
  ChevronDown,
  ChevronUp,
  Close,
  ArrowRight,
  Task,
} from '@carbon/icons-react';

export interface ChecklistTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  estimatedTime?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface ChecklistProps {
  title?: string;
  subtitle?: string;
  tasks: ChecklistTask[];
  onToggleTask?: (id: string, completed: boolean) => void;
  onDismiss?: () => void;
  collapsible?: boolean;
}

export const Checklist: React.FC<ChecklistProps> = ({
  title = 'Get started with IBM Carbon POS',
  subtitle = 'Complete these setup tasks to optimize your store operations.',
  tasks,
  onToggleTask,
  onDismiss,
  collapsible = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(tasks[0]?.id || null);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / (tasks.length || 1)) * 100);

  return (
    <div
      className="c4p--checklist"
      style={{
        backgroundColor: 'var(--cds-layer-01)',
        border: '1px solid var(--cds-border-subtle)',
        borderRadius: 0,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: isExpanded ? '1px solid var(--cds-border-subtle)' : 'none',
          backgroundColor: 'var(--cds-layer-01)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: collapsible ? 'pointer' : 'default',
        }}
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
      >
        <div style={{ flex: 1, paddingRight: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Task size={20} style={{ fill: 'var(--cds-interactive)' }} />
            <h3 className="heading-02" style={{ margin: 0, fontWeight: 600 }}>
              {title}
            </h3>
            <Tag size="sm" type={progressPercent === 100 ? 'green' : 'blue'}>
              {completedCount}/{tasks.length} Completed
            </Tag>
          </div>
          <p className="body-01" style={{ margin: 0, color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
            {subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {collapsible && (
            <IconButton label={isExpanded ? 'Collapse' : 'Expand'} kind="ghost" size="sm" align="bottom">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </IconButton>
          )}
          {onDismiss && (
            <IconButton
              label="Dismiss checklist"
              kind="ghost"
              size="sm"
              align="bottom"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
            >
              <Close size={20} />
            </IconButton>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '0 1.5rem 1rem 1.5rem', backgroundColor: 'var(--cds-layer-01)' }}>
        <ProgressBar
          label="Setup Progress"
          value={progressPercent}
          max={100}
          helperText={`${progressPercent}% complete`}
          status={progressPercent === 100 ? 'finished' : 'active'}
          size="small"
        />
      </div>

      {/* Expandable Task List */}
      {isExpanded && (
        <div style={{ backgroundColor: 'var(--cds-background)' }}>
          {tasks.map((task) => {
            const isSelected = activeTaskId === task.id;

            return (
              <div
                key={task.id}
                style={{
                  borderTop: '1px solid var(--cds-border-subtle)',
                  padding: '1.25rem 1.5rem',
                  backgroundColor: isSelected ? 'var(--cds-layer-01)' : 'transparent',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease',
                }}
                onClick={() => setActiveTaskId(task.id)}
              >
                {/* Completion Toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleTask) onToggleTask(task.id, !task.completed);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    marginTop: '0.125rem',
                  }}
                  aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
                >
                  {task.completed ? (
                    <CheckmarkFilled size={20} style={{ fill: 'var(--cds-support-success)' }} />
                  ) : (
                    <CircleDash size={20} style={{ fill: 'var(--cds-icon-secondary)' }} />
                  )}
                </button>

                {/* Task Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4
                      className="heading-01"
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'var(--cds-text-secondary)' : 'var(--cds-text-primary)',
                      }}
                    >
                      {task.title}
                    </h4>

                    {task.estimatedTime && (
                      <span className="label-01" style={{ color: 'var(--cds-text-secondary)', fontSize: '0.75rem' }}>
                        {task.estimatedTime}
                      </span>
                    )}
                  </div>

                  {task.description && (
                    <p
                      className="body-01"
                      style={{
                        margin: '0.25rem 0 0 0',
                        color: 'var(--cds-text-secondary)',
                        fontSize: '0.875rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {task.description}
                    </p>
                  )}

                  {/* Task Action Trigger */}
                  {isSelected && task.actionLabel && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <Button
                        kind={task.completed ? 'ghost' : 'primary'}
                        size="sm"
                        renderIcon={ArrowRight}
                        iconDescription={task.actionLabel}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (task.onAction) task.onAction();
                        }}
                      >
                        {task.actionLabel}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
