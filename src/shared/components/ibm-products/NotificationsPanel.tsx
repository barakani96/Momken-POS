import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Tag,
  ContentSwitcher,
  Switch,
  Stack,
} from '@carbon/react';
import {
  Close,
  CheckmarkOutline,
  TrashCan,
  Notification,
  Information,
  WarningFilled,
  ErrorFilled,
  CheckmarkFilled,
} from '@carbon/icons-react';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  category: 'system' | 'orders' | 'inventory' | 'sync';
  actionLabel?: string;
  onAction?: () => void;
}

export interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
  onNotificationClick?: (id: string) => void;
  onDismissNotification?: (id: string) => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  open,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick,
  onDismissNotification,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!open) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'warning':
        return <WarningFilled size={20} style={{ fill: 'var(--cds-support-warning)' }} />;
      case 'error':
        return <ErrorFilled size={20} style={{ fill: 'var(--cds-support-error)' }} />;
      case 'success':
        return <CheckmarkFilled size={20} style={{ fill: 'var(--cds-support-success)' }} />;
      default:
        return <Information size={20} style={{ fill: 'var(--cds-support-info)' }} />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Notifications panel"
      style={{
        position: 'fixed',
        top: '3rem',
        right: 0,
        bottom: 0,
        width: '420px',
        maxWidth: '100vw',
        backgroundColor: 'var(--cds-layer-01)',
        borderLeft: '1px solid var(--cds-border-subtle)',
        boxShadow: '-6px 0 24px rgba(0, 0, 0, 0.25)',
        zIndex: 9100,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--cds-border-subtle)',
          backgroundColor: 'var(--cds-layer-01)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 className="heading-03" style={{ margin: 0, fontWeight: 600 }}>
              Notifications
            </h2>
            {unreadCount > 0 && <Tag type="blue" size="sm">{unreadCount} new</Tag>}
          </div>

          <IconButton label="Close notifications" kind="ghost" size="md" align="left" onClick={onClose}>
            <Close size={20} />
          </IconButton>
        </div>

        {/* Filter Switcher & Global Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem',
          }}
        >
          <ContentSwitcher
            size="sm"
            selectedIndex={filter === 'all' ? 0 : 1}
            onChange={(e) => setFilter(e.name === 'unread' ? 'unread' : 'all')}
          >
            <Switch name="all" text="All" />
            <Switch name="unread" text={`Unread (${unreadCount})`} />
          </ContentSwitcher>

          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {onMarkAllAsRead && unreadCount > 0 && (
              <IconButton
                label="Mark all as read"
                kind="ghost"
                size="sm"
                align="bottom"
                onClick={onMarkAllAsRead}
              >
                <CheckmarkOutline size={16} />
              </IconButton>
            )}
            {onClearAll && notifications.length > 0 && (
              <IconButton
                label="Clear all notifications"
                kind="ghost"
                size="sm"
                align="bottom"
                onClick={onClearAll}
              >
                <TrashCan size={16} />
              </IconButton>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List Body */}
      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--cds-background)' }}>
        {filteredNotifications.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4rem 2rem',
              textAlign: 'center',
            }}
          >
            <Notification size={48} style={{ fill: 'var(--cds-icon-disabled)', marginBottom: '1rem' }} />
            <h3 className="heading-02" style={{ margin: '0 0 0.25rem 0', color: 'var(--cds-text-primary)' }}>
              No notifications
            </h3>
            <p className="body-01" style={{ margin: 0, color: 'var(--cds-text-secondary)' }}>
              You're all caught up with your store updates.
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => onNotificationClick && onNotificationClick(item.id)}
              style={{
                display: 'flex',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--cds-border-subtle)',
                backgroundColor: item.read ? 'transparent' : 'var(--cds-layer-01)',
                position: 'relative',
                cursor: onNotificationClick ? 'pointer' : 'default',
                transition: 'background-color 100ms ease',
              }}
            >
              {/* Unread indicator dot */}
              {!item.read && (
                <div
                  style={{
                    position: 'absolute',
                    top: '1.5rem',
                    left: '0.6rem',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--cds-interactive)',
                  }}
                />
              )}

              {/* Status Icon */}
              <div style={{ marginRight: '1rem', marginTop: '0.125rem' }}>
                {getIcon(item.type)}
              </div>

              {/* Text content */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.25rem',
                  }}
                >
                  <h4
                    className="heading-01"
                    style={{
                      margin: 0,
                      fontWeight: item.read ? 400 : 600,
                      color: 'var(--cds-text-primary)',
                    }}
                  >
                    {item.title}
                  </h4>
                  <span
                    className="label-01"
                    style={{
                      color: 'var(--cds-text-secondary)',
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      marginLeft: '0.5rem',
                    }}
                  >
                    {item.timestamp}
                  </span>
                </div>

                <p
                  className="body-01"
                  style={{
                    margin: '0 0 0.5rem 0',
                    color: 'var(--cds-text-secondary)',
                    fontSize: '0.875rem',
                    lineHeight: 1.4,
                  }}
                >
                  {item.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag size="sm" type="cool-gray">
                    {item.category}
                  </Tag>

                  {item.actionLabel && (
                    <Button
                      kind="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.onAction) item.onAction();
                      }}
                    >
                      {item.actionLabel}
                    </Button>
                  )}
                </div>
              </div>

              {/* Dismiss Button */}
              {onDismissNotification && (
                <IconButton
                  label="Dismiss"
                  kind="ghost"
                  size="sm"
                  align="left"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismissNotification(item.id);
                  }}
                  style={{ marginLeft: '0.25rem' }}
                >
                  <Close size={16} />
                </IconButton>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
