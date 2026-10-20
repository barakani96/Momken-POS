import React, { useState, useEffect, useRef } from 'react';
import {
  HeaderGlobalAction,
  Popover,
  PopoverContent,
  Tag,
  Button,
  ProgressBar,
  Stack,
  InlineNotification,
  Toggle,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  Loading
} from '@carbon/react';
import {
  Wifi,
  WifiOff,
  CloudUpload,
  CheckmarkFilled,
  Renew,
  DataBase,
  WarningAlt,
  Time,
  AddAlt,
  ArrowRight
} from '@carbon/icons-react';
import {
  subscribeToSyncStats,
  getSyncQueueStats,
  processSyncQueue,
  getPendingSyncQueue,
  enqueueSyncMutation,
  countEntities,
  seedInitialIndexedDB,
  SyncQueueEntity
} from '../services/db';

export interface ConnectivitySyncStatusProps {
  className?: string;
}

export const ConnectivitySyncStatus: React.FC<ConnectivitySyncStatusProps> = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [syncProgress, setSyncProgress] = useState<{ current: number; total: number; entity: string } | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [pendingItems, setPendingItems] = useState<SyncQueueEntity[]>([]);
  const [entityCounts, setEntityCounts] = useState<{ products: number; customers: number; orders: number }>({
    products: 0,
    customers: 0,
    orders: 0
  });

  const anchorRef = useRef<HTMLButtonElement>(null);

  // Effective online status considering simulation
  const effectiveOnline = isOnline && !isSimulatedOffline;

  // Initialize DB and subscribe to sync queue stats
  useEffect(() => {
    seedInitialIndexedDB().then(() => {
      refreshDatabaseCounts();
    });

    const unsubscribe = subscribeToSyncStats((stats) => {
      setPendingCount(stats.pendingCount);
      setIsSyncing(stats.isSyncing);
      if (stats.lastSyncTime) {
        setLastSyncTime(stats.lastSyncTime);
      }
    });

    const handleOnline = () => {
      setIsOnline(true);
      if (!isSimulatedOffline) {
        handleTriggerSync();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    getSyncQueueStats().then(stats => {
      setPendingCount(stats.pendingCount);
      setIsSyncing(stats.isSyncing);
    });

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isSimulatedOffline]);

  const refreshDatabaseCounts = async () => {
    try {
      const [pCount, cCount, oCount] = await Promise.all([
        countEntities('products'),
        countEntities('customers'),
        countEntities('orders')
      ]);
      setEntityCounts({ products: pCount, customers: cCount, orders: oCount });
      const queue = await getPendingSyncQueue();
      setPendingItems(queue);
    } catch (err) {
      console.error('Failed to read entity counts:', err);
    }
  };

  const handleTriggerSync = async () => {
    if (!effectiveOnline || isSyncing) return;

    setIsSyncing(true);
    setSyncProgress({ current: 0, total: pendingCount || 1, entity: 'Connecting...' });

    try {
      await processSyncQueue((progress) => {
        setSyncProgress(progress);
      });
      await refreshDatabaseCounts();
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
      setSyncProgress(null);
    }
  };

  const handleSimulateOfflineToggle = (checked: boolean) => {
    setIsSimulatedOffline(checked);
    if (!checked && isOnline) {
      handleTriggerSync();
    }
  };

  const handleAddTestOfflineOrder = async () => {
    const testOrderId = `ord_off_${Date.now()}`;
    await enqueueSyncMutation({
      entity: 'orders',
      action: 'create',
      payload: {
        id: testOrderId,
        orderNumber: `OFF-${Math.floor(1000 + Math.random() * 9000)}`,
        total: 185.00,
        itemsCount: 2,
        paymentMethod: 'card',
        createdAt: Date.now()
      }
    });
    await refreshDatabaseCounts();
  };

  const formatRelativeTime = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSec < 10) return 'Just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div
      id="connectivity-sync-status-wrapper"
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        height: '100%',
      }}
    >
      {/* Clickable Header Status Pill Button */}
      <button
        id="connectivity-sync-header-pill"
        ref={anchorRef}
        type="button"
        aria-label="Connectivity and Sync Status"
        aria-expanded={isPopoverOpen}
        onClick={() => {
          setIsPopoverOpen(!isPopoverOpen);
          refreshDatabaseCounts();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          height: '100%',
          padding: '0 0.875rem',
          background: isPopoverOpen ? 'var(--cds-layer-selected, rgba(255,255,255,0.15))' : 'transparent',
          border: 'none',
          borderInlineStart: '1px solid var(--cds-border-subtle)',
          cursor: 'pointer',
          color: 'inherit',
          transition: 'background-color 150ms ease-in-out',
          outline: 'none'
        }}
        onMouseEnter={(e) => {
          if (!isPopoverOpen) e.currentTarget.style.backgroundColor = 'var(--cds-layer-hover, rgba(255,255,255,0.08))';
        }}
        onMouseLeave={(e) => {
          if (!isPopoverOpen) e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {/* Connection State Icon */}
        {!effectiveOnline ? (
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--cds-support-error, #da1e28)' }}>
            <WifiOff size={18} />
          </div>
        ) : isSyncing ? (
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--cds-support-info, #4589ff)' }}>
            <CloudUpload size={18} className="rotating-icon" />
          </div>
        ) : pendingCount > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--cds-support-warning, #f1c21b)' }}>
            <WarningAlt size={18} />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--cds-support-success, #24a148)' }}>
            <Wifi size={18} />
          </div>
        )}

        {/* Text Label & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', whiteSpace: 'nowrap' }}>
          <span className="label-01" style={{ fontWeight: 600 }}>
            {!effectiveOnline
              ? 'Offline Mode'
              : isSyncing
              ? 'Syncing...'
              : pendingCount > 0
              ? `${pendingCount} Pending`
              : 'Online & Synced'}
          </span>

          {pendingCount > 0 && !isSyncing && (
            <Tag
              type={!effectiveOnline ? 'red' : 'warm-gray'}
              size="sm"
              style={{ margin: 0, padding: '0 0.35rem', height: '18px', lineHeight: '18px', minWidth: 'auto' }}
            >
              {pendingCount}
            </Tag>
          )}

          {isSyncing && (
            <Tag
              type="blue"
              size="sm"
              style={{ margin: 0, padding: '0 0.35rem', height: '18px', lineHeight: '18px', minWidth: 'auto' }}
            >
              {syncProgress ? `${syncProgress.current}/${syncProgress.total}` : 'Active'}
            </Tag>
          )}
        </div>
      </button>

      {/* Popover Details Panel */}
      <Popover
        open={isPopoverOpen}
        align="bottom-right"
        onRequestClose={() => setIsPopoverOpen(false)}
      >
        <PopoverContent
          id="connectivity-sync-popover"
          style={{
            width: '380px',
            maxWidth: '92vw',
            padding: '1.25rem',
            backgroundColor: 'var(--cds-layer-01)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            borderRadius: '4px',
            border: '1px solid var(--cds-border-subtle)',
            color: 'var(--cds-text-primary)'
          }}
        >
          <Stack gap={5}>
            {/* Header Title and Status */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <h4 className="heading-02" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <DataBase size={18} />
                  Offline-First & Sync Engine
                </h4>
                <p className="body-01" style={{ margin: '0.25rem 0 0 0', color: 'var(--cds-text-secondary)', fontSize: '0.75rem' }}>
                  IndexedDB Schema-driven local storage & cloud sync
                </p>
              </div>
              <Tag
                type={!effectiveOnline ? 'red' : isSyncing ? 'blue' : pendingCount > 0 ? 'warm-gray' : 'green'}
                size="md"
              >
                {!effectiveOnline ? 'OFFLINE' : isSyncing ? 'SYNCING' : pendingCount > 0 ? 'PENDING' : 'ONLINE'}
              </Tag>
            </div>

            {/* Sync Progress Bar (if active) */}
            {isSyncing && syncProgress && (
              <div
                id="sync-progress-indicator"
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--cds-layer-02)',
                  borderRadius: '4px',
                  border: '1px solid var(--cds-border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span className="label-01" style={{ fontWeight: 600, color: 'var(--cds-support-info)' }}>
                    Synchronizing Entity: {syncProgress.entity}
                  </span>
                  <span className="label-01">
                    {Math.round((syncProgress.current / syncProgress.total) * 100)}%
                  </span>
                </div>
                <ProgressBar
                  label=""
                  helperText=""
                  value={syncProgress.current}
                  max={syncProgress.total}
                  status="active"
                  size="small"
                />
              </div>
            )}

            {/* Offline notification if applicable */}
            {!effectiveOnline && (
              <InlineNotification
                id="offline-banner-notification"
                kind="warning"
                lowContrast
                title="Working Offline"
                subtitle="All transactions and mutations are safely saved to local IndexedDB and will auto-sync when connection restores."
                hideCloseButton
              />
            )}

            {/* Storage Engine Breakdown */}
            <div
              style={{
                backgroundColor: 'var(--cds-layer-02)',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid var(--cds-border-subtle)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="label-01" style={{ fontWeight: 600 }}>Local IndexedDB Stores</span>
                <span className="label-01" style={{ color: 'var(--cds-text-secondary)' }}>ibm_carbon_pos_offline_db (v1)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--cds-layer-01)', borderRadius: '2px' }}>
                  <div className="heading-02" style={{ margin: 0, fontWeight: 700 }}>{entityCounts.products}</div>
                  <div className="label-01" style={{ color: 'var(--cds-text-secondary)', fontSize: '0.7rem' }}>Products</div>
                </div>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--cds-layer-01)', borderRadius: '2px' }}>
                  <div className="heading-02" style={{ margin: 0, fontWeight: 700 }}>{entityCounts.customers}</div>
                  <div className="label-01" style={{ color: 'var(--cds-text-secondary)', fontSize: '0.7rem' }}>Customers</div>
                </div>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--cds-layer-01)', borderRadius: '2px' }}>
                  <div className="heading-02" style={{ margin: 0, fontWeight: 700 }}>{entityCounts.orders}</div>
                  <div className="label-01" style={{ color: 'var(--cds-text-secondary)', fontSize: '0.7rem' }}>Orders</div>
                </div>
              </div>
            </div>

            {/* Sync Queue List Preview */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span className="label-01" style={{ fontWeight: 600 }}>
                  Offline Queue ({pendingCount} pending mutations)
                </span>
                <span className="label-01" style={{ color: 'var(--cds-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Time size={14} />
                  Last synced: {formatRelativeTime(lastSyncTime)}
                </span>
              </div>

              {pendingItems.length === 0 ? (
                <div
                  style={{
                    padding: '0.75rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--cds-layer-02)',
                    borderRadius: '4px',
                    color: 'var(--cds-text-secondary)',
                    fontSize: '0.8125rem'
                  }}
                >
                  <CheckmarkFilled size={18} style={{ color: 'var(--cds-support-success)', marginBottom: '0.25rem', display: 'inline-block' }} />
                  <div>All local transactions are completely synchronized with the cloud.</div>
                </div>
              ) : (
                <div style={{ maxHeight: '120px', overflowY: 'auto', border: '1px solid var(--cds-border-subtle)', borderRadius: '4px' }}>
                  <StructuredListWrapper isCondensed aria-label="Pending sync mutations">
                    <StructuredListBody>
                      {pendingItems.slice(0, 5).map((item) => (
                        <StructuredListRow key={item.id}>
                          <StructuredListCell style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}>
                            <Tag type={item.action === 'create' ? 'green' : item.action === 'update' ? 'blue' : 'red'} size="sm">
                              {item.action.toUpperCase()}
                            </Tag>
                          </StructuredListCell>
                          <StructuredListCell style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}>
                            <strong>{item.entity}</strong>
                            <span style={{ color: 'var(--cds-text-secondary)', marginLeft: '0.25rem' }}>
                              #{item.payload?.orderNumber || item.payload?.id?.substring(0, 8)}
                            </span>
                          </StructuredListCell>
                          <StructuredListCell style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem', textAlign: 'right', color: 'var(--cds-text-secondary)' }}>
                            {formatRelativeTime(item.timestamp)}
                          </StructuredListCell>
                        </StructuredListRow>
                      ))}
                    </StructuredListBody>
                  </StructuredListWrapper>
                </div>
              )}
            </div>

            {/* Offline Simulation Toggle & Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--cds-layer-02)',
                borderRadius: '4px',
                border: '1px solid var(--cds-border-subtle)'
              }}
            >
              <div>
                <span className="label-01" style={{ fontWeight: 600, display: 'block' }}>Simulate Offline Mode</span>
                <span className="body-01" style={{ fontSize: '0.7rem', color: 'var(--cds-text-secondary)' }}>
                  Test local IndexedDB mutations & queueing
                </span>
              </div>
              <Toggle
                id="toggle-simulate-offline"
                size="sm"
                aria-label="Simulate offline connection"
                toggled={isSimulatedOffline}
                onToggle={handleSimulateOfflineToggle}
                labelA=""
                labelB=""
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                id="btn-sync-now"
                kind="primary"
                size="sm"
                renderIcon={Renew}
                iconDescription={isSyncing ? 'Syncing...' : 'Sync Now'}
                disabled={!effectiveOnline || isSyncing || pendingCount === 0}
                onClick={handleTriggerSync}
                style={{ flex: 1 }}
              >
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </Button>
              <Button
                id="btn-add-test-offline-record"
                kind="tertiary"
                size="sm"
                renderIcon={AddAlt}
                iconDescription="Add Test Queue Record"
                onClick={handleAddTestOfflineOrder}
              >
                + Test Queue
              </Button>
            </div>
          </Stack>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ConnectivitySyncStatus;
