import React, { useState } from 'react';
import {
  InlineNotification,
  ToastNotification,
  ActionableNotification,
  Button,
  Tag,
  Stack,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  IconButton
} from '@carbon/react';
import {
  Notification,
  Checkmark,
  TrashCan,
  Information,
  WarningAlt,
  CheckmarkFilled,
  ErrorFilled,
  Launch
} from '@carbon/icons-react';

export interface SystemNotificationItem {
  id: string;
  kind: 'error' | 'warning' | 'info' | 'success';
  title: string;
  subtitle: string;
  timestamp: string;
  read: boolean;
  category?: 'inventory' | 'system' | 'sales' | 'security';
  actionLabel?: string;
  onAction?: () => void;
}

export const initialNotificationData: SystemNotificationItem[] = [
  {
    id: 'notif-1',
    kind: 'error',
    title: 'Low Stock Warning',
    subtitle: 'Espresso Beans inventory dropped below safety threshold (1.8 kg remaining at Main Branch).',
    timestamp: '5m ago',
    read: false,
    category: 'inventory',
    actionLabel: 'Reorder Stock'
  },
  {
    id: 'notif-2',
    kind: 'warning',
    title: 'Hardware Terminal Alert',
    subtitle: 'RFID Scanner #3 at POS Terminal B lost connection. Re-sync recommended.',
    timestamp: '18m ago',
    read: false,
    category: 'system',
    actionLabel: 'Diagnostic Run'
  },
  {
    id: 'notif-3',
    kind: 'success',
    title: 'Daily Settlement Completed',
    subtitle: 'Branch #1 end-of-day register batch closed successfully with zero cash discrepancies.',
    timestamp: '1h ago',
    read: true,
    category: 'sales'
  },
  {
    id: 'notif-4',
    kind: 'info',
    title: 'System Firmware Update',
    subtitle: 'Carbon Core POS Engine v4.2.1 deployment scheduled tonight at 02:00 AM UTC.',
    timestamp: '3h ago',
    read: true,
    category: 'system'
  }
];

interface CarbonNotificationCenterProps {
  notifications?: SystemNotificationItem[];
  onNotificationDismiss?: (id: string) => void;
  onMarkAllRead?: () => void;
  onClearAll?: () => void;
  onNotificationClick?: (item: SystemNotificationItem) => void;
  compact?: boolean;
}

export default function CarbonNotificationCenter({
  notifications = initialNotificationData,
  onNotificationDismiss,
  onMarkAllRead,
  onClearAll,
  onNotificationClick,
  compact = false
}: CarbonNotificationCenterProps) {
  const [items, setItems] = useState<SystemNotificationItem[]>(notifications);
  const [selectedTab, setSelectedTab] = useState(0);

  const unreadCount = items.filter((n) => !n.read).length;

  const handleDismiss = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (onNotificationDismiss) onNotificationDismiss(id);
  };

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
    if (onMarkAllRead) onMarkAllRead();
  };

  const handleClearAll = () => {
    setItems([]);
    if (onClearAll) onClearAll();
  };

  const handleItemClick = (item: SystemNotificationItem) => {
    setItems((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    if (onNotificationClick) onNotificationClick(item);
  };

  const filteredItems = items.filter((item) => {
    if (selectedTab === 1) return !item.read; // Unread tab
    if (selectedTab === 2) return item.kind === 'error' || item.kind === 'warning'; // System/Urgent tab
    return true; // All tab
  });

  return (
    <div style={{ width: '100%' }}>
      {/* Drawer Header Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--cds-border-subtle, #e0e0e0)',
          marginBottom: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Notification size={18} />
          <span className="heading-02" style={{ fontWeight: 600 }}>
            Notifications
          </span>
          {unreadCount > 0 && (
            <Tag type="red" size="sm">
              {unreadCount} new
            </Tag>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <Button
            kind="ghost"
            size="sm"
            renderIcon={Checkmark}
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            title="Mark all notifications as read"
          >
            Mark all read
          </Button>
          <Button
            kind="ghost"
            size="sm"
            renderIcon={TrashCan}
            onClick={handleClearAll}
            disabled={items.length === 0}
            title="Clear all notifications"
          >
            Clear all
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs selectedIndex={selectedTab} onChange={({ selectedIndex }) => setSelectedTab(selectedIndex)}>
        <TabList aria-label="Notification filters" size="sm" style={{ marginBottom: '1rem' }}>
          <Tab>All ({items.length})</Tab>
          <Tab>Unread ({unreadCount})</Tab>
          <Tab>Critical ({items.filter((i) => i.kind === 'error' || i.kind === 'warning').length})</Tab>
        </TabList>

        <TabPanels>
          <TabPanel style={{ padding: 0 }}>
            {filteredItems.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '2.5rem 1rem',
                  color: 'var(--cds-text-secondary, #6f6f6f)'
                }}
              >
                <Notification size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                <p className="body-01">No notifications in this view.</p>
              </div>
            ) : (
              <Stack gap={3}>
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    style={{
                      position: 'relative',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      transition: 'background-color 0.15s ease',
                      backgroundColor: item.read
                        ? 'transparent'
                        : 'var(--cds-layer-selected, #e8f0fe)'
                    }}
                  >
                    {!item.read && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: compact ? '4px' : '8px',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--cds-support-error, #da1e28)',
                          zIndex: 2
                        }}
                      />
                    )}
                    {item.actionLabel ? (
                      <ActionableNotification
                        kind={item.kind}
                        title={item.title}
                        subtitle={item.subtitle}
                        actionButtonLabel={item.actionLabel}
                        onActionButtonClick={() => {
                          if (item.onAction) item.onAction();
                          handleItemClick(item);
                        }}
                        onClose={() => handleDismiss(item.id)}
                        lowContrast
                        style={{ width: '100%', maxWidth: '100%' }}
                      />
                    ) : (
                      <InlineNotification
                        kind={item.kind}
                        title={item.title}
                        subtitle={`${item.subtitle} • ${item.timestamp}`}
                        onClose={() => handleDismiss(item.id)}
                        lowContrast
                        style={{ width: '100%', maxWidth: '100%' }}
                      />
                    )}
                  </div>
                ))}
              </Stack>
            )}
          </TabPanel>
          <TabPanel style={{ padding: 0 }}>
            {filteredItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--cds-text-secondary)' }}>
                <CheckmarkFilled size={32} style={{ marginBottom: '0.5rem', color: 'var(--cds-support-success)' }} />
                <p className="body-01">All caught up! No unread notifications.</p>
              </div>
            ) : (
              <Stack gap={3}>
                {filteredItems.map((item) => (
                  <InlineNotification
                    key={item.id}
                    kind={item.kind}
                    title={item.title}
                    subtitle={`${item.subtitle} • ${item.timestamp}`}
                    onClose={() => handleDismiss(item.id)}
                    lowContrast
                    style={{ width: '100%' }}
                  />
                ))}
              </Stack>
            )}
          </TabPanel>
          <TabPanel style={{ padding: 0 }}>
            {filteredItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--cds-text-secondary)' }}>
                <CheckmarkFilled size={32} style={{ marginBottom: '0.5rem', color: 'var(--cds-support-success)' }} />
                <p className="body-01">No critical warnings or system errors.</p>
              </div>
            ) : (
              <Stack gap={3}>
                {filteredItems.map((item) => (
                  <ActionableNotification
                    key={item.id}
                    kind={item.kind}
                    title={item.title}
                    subtitle={`${item.subtitle} • ${item.timestamp}`}
                    actionButtonLabel={item.actionLabel || 'Investigate'}
                    onActionButtonClick={() => handleItemClick(item)}
                    onClose={() => handleDismiss(item.id)}
                    lowContrast
                    style={{ width: '100%' }}
                  />
                ))}
              </Stack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
