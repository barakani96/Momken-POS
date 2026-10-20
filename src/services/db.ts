import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface BaseEntity {
  id: string;
  createdAt: number;
  updatedAt: number;
  synced?: boolean;
}

export interface ProductEntity extends BaseEntity {
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  costPrice?: number;
  stock: number;
  category: string;
  taxRate?: number;
  branchId?: string;
}

export interface CustomerEntity extends BaseEntity {
  name: string;
  email?: string;
  phone?: string;
  loyaltyPoints?: number;
  tier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  balance?: number;
}

export interface OrderItemEntity {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  discount?: number;
  tax?: number;
}

export interface OrderEntity extends BaseEntity {
  orderNumber: string;
  cashierId: string;
  cashierName: string;
  branchId: string;
  items: OrderItemEntity[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'instapay' | 'split' | 'points';
  status: 'completed' | 'refunded' | 'pending';
}

export interface SyncQueueEntity {
  id: string;
  entity: 'products' | 'customers' | 'orders' | 'settings';
  action: 'create' | 'update' | 'delete';
  payload: any;
  timestamp: number;
  attempts: number;
  status: 'pending' | 'syncing' | 'failed';
  lastError?: string;
}

export interface SettingEntity {
  key: string;
  value: any;
  updatedAt: number;
}

export interface POSDatabaseSchema extends DBSchema {
  products: {
    key: string;
    value: ProductEntity;
    indexes: {
      'by_category': string;
      'by_sku': string;
      'by_synced': number;
      'by_updatedAt': number;
    };
  };
  customers: {
    key: string;
    value: CustomerEntity;
    indexes: {
      'by_phone': string;
      'by_email': string;
      'by_synced': number;
    };
  };
  orders: {
    key: string;
    value: OrderEntity;
    indexes: {
      'by_orderNumber': string;
      'by_synced': number;
      'by_cashierId': string;
      'by_createdAt': number;
    };
  };
  sync_queue: {
    key: string;
    value: SyncQueueEntity;
    indexes: {
      'by_status': string;
      'by_timestamp': number;
      'by_entity': string;
    };
  };
  settings: {
    key: string;
    value: SettingEntity;
  };
}

const DB_NAME = 'ibm_carbon_pos_offline_db';
const DB_VERSION = 1;

export type StoreName = 'products' | 'customers' | 'orders' | 'sync_queue' | 'settings';

// ============================================================================
// RESILIENT IN-MEMORY & LOCALSTORAGE ENGINE
// ============================================================================

class UnifiedStorageEngine {
  private inMemoryStores: Record<string, Map<string, any>> = {
    products: new Map(),
    customers: new Map(),
    orders: new Map(),
    sync_queue: new Map(),
    settings: new Map(),
  };

  private idbInstance: IDBPDatabase<POSDatabaseSchema> | null = null;
  private isIdbDisabled = false;
  private initialized = false;

  constructor() {
    this.hydrateFromLocalStorage();
  }

  private getStorageKey(storeName: string): string {
    return `pos_offline_db_${storeName}`;
  }

  private hydrateFromLocalStorage() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      (['products', 'customers', 'orders', 'sync_queue', 'settings'] as StoreName[]).forEach((store) => {
        const raw = localStorage.getItem(this.getStorageKey(store));
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              parsed.forEach((item: any) => {
                const key = item.id || item.key;
                if (key) {
                  this.inMemoryStores[store].set(String(key), item);
                }
              });
            }
          } catch {
            // Ignore parse error
          }
        }
      });
    } catch {
      // Ignore localStorage access errors
    }
  }

  private persistStore(storeName: StoreName) {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const items = Array.from(this.inMemoryStores[storeName].values());
      localStorage.setItem(this.getStorageKey(storeName), JSON.stringify(items));
    } catch {
      // Ignore quota exceeded or storage blocked errors
    }
  }

  public async initIDB(): Promise<IDBPDatabase<POSDatabaseSchema> | null> {
    if (this.initialized) return this.idbInstance;
    this.initialized = true;

    if (typeof window === 'undefined' || !window.indexedDB) {
      this.isIdbDisabled = true;
      return null;
    }

    try {
      // Attempt safe openDB with idb
      const db = await openDB<POSDatabaseSchema>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('products')) {
            const p = db.createObjectStore('products', { keyPath: 'id' });
            p.createIndex('by_category', 'category');
            p.createIndex('by_sku', 'sku', { unique: false });
            p.createIndex('by_synced', 'synced');
            p.createIndex('by_updatedAt', 'updatedAt');
          }
          if (!db.objectStoreNames.contains('customers')) {
            const c = db.createObjectStore('customers', { keyPath: 'id' });
            c.createIndex('by_phone', 'phone', { unique: false });
            c.createIndex('by_email', 'email', { unique: false });
            c.createIndex('by_synced', 'synced');
          }
          if (!db.objectStoreNames.contains('orders')) {
            const o = db.createObjectStore('orders', { keyPath: 'id' });
            o.createIndex('by_orderNumber', 'orderNumber', { unique: false });
            o.createIndex('by_synced', 'synced');
            o.createIndex('by_cashierId', 'cashierId');
            o.createIndex('by_createdAt', 'createdAt');
          }
          if (!db.objectStoreNames.contains('sync_queue')) {
            const s = db.createObjectStore('sync_queue', { keyPath: 'id' });
            s.createIndex('by_status', 'status');
            s.createIndex('by_timestamp', 'timestamp');
            s.createIndex('by_entity', 'entity');
          }
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' });
          }
        },
      });
      this.idbInstance = db;
      return db;
    } catch {
      // If IndexedDB fails or throws "Internal error" in sandbox/iframe, disable IDB and rely on in-memory/localStorage
      this.isIdbDisabled = true;
      this.idbInstance = null;
      return null;
    }
  }

  async get(storeName: StoreName, key: string): Promise<any> {
    if (!this.isIdbDisabled) {
      try {
        const db = await this.initIDB();
        if (db) {
          const res = await db.get(storeName as any, key as any);
          if (res !== undefined) return res;
        }
      } catch {
        this.isIdbDisabled = true;
      }
    }
    const store = this.inMemoryStores[storeName];
    return store ? store.get(String(key)) : undefined;
  }

  async getAll(storeName: StoreName): Promise<any[]> {
    if (!this.isIdbDisabled) {
      try {
        const db = await this.initIDB();
        if (db) {
          const res = await db.getAll(storeName as any);
          if (res && res.length > 0) return res;
        }
      } catch {
        this.isIdbDisabled = true;
      }
    }
    const store = this.inMemoryStores[storeName];
    return store ? Array.from(store.values()) : [];
  }

  async put(storeName: StoreName, item: any): Promise<void> {
    const key = item.id || item.key;
    const store = this.inMemoryStores[storeName];
    if (store && key) {
      store.set(String(key), item);
      this.persistStore(storeName);
    }

    if (!this.isIdbDisabled) {
      try {
        const db = await this.initIDB();
        if (db) {
          await db.put(storeName as any, item);
        }
      } catch {
        this.isIdbDisabled = true;
      }
    }
  }

  async delete(storeName: StoreName, key: string): Promise<void> {
    const store = this.inMemoryStores[storeName];
    if (store) {
      store.delete(String(key));
      this.persistStore(storeName);
    }

    if (!this.isIdbDisabled) {
      try {
        const db = await this.initIDB();
        if (db) {
          await db.delete(storeName as any, key as any);
        }
      } catch {
        this.isIdbDisabled = true;
      }
    }
  }

  async count(storeName: StoreName): Promise<number> {
    if (!this.isIdbDisabled) {
      try {
        const db = await this.initIDB();
        if (db) {
          return await db.count(storeName as any);
        }
      } catch {
        this.isIdbDisabled = true;
      }
    }
    const store = this.inMemoryStores[storeName];
    return store ? store.size : 0;
  }

  async clear(storeName: StoreName): Promise<void> {
    const store = this.inMemoryStores[storeName];
    if (store) {
      store.clear();
      this.persistStore(storeName);
    }

    if (!this.isIdbDisabled) {
      try {
        const db = await this.initIDB();
        if (db) {
          await db.clear(storeName as any);
        }
      } catch {
        this.isIdbDisabled = true;
      }
    }
  }
}

const storageEngine = new UnifiedStorageEngine();

/**
 * Access underlying IndexedDB instance if available
 */
export async function getDB(): Promise<IDBPDatabase<POSDatabaseSchema> | null> {
  return storageEngine.initIDB();
}

// Listeners for reactive sync queue updates
type SyncListener = (stats: { pendingCount: number; isSyncing: boolean; lastSyncTime: number | null }) => void;
const syncListeners: Set<SyncListener> = new Set();

export function subscribeToSyncStats(listener: SyncListener): () => void {
  syncListeners.add(listener);
  getSyncQueueStats().then(stats => listener(stats)).catch(() => {});
  return () => syncListeners.delete(listener);
}

let lastSyncTimestamp: number | null = null;
let isCurrentlySyncing = false;

async function notifySyncListeners() {
  try {
    const stats = await getSyncQueueStats();
    syncListeners.forEach(listener => {
      try {
        listener(stats);
      } catch {
        // Ignore listener exceptions
      }
    });
  } catch {
    // Ignore notify exceptions
  }
}

// ============================================================================
// GENERIC SCHEMA-BASED CRUD OPERATIONS
// ============================================================================

/**
 * Retrieve a single item by key
 */
export async function getEntity<K extends keyof POSDatabaseSchema>(
  storeName: K,
  id: POSDatabaseSchema[K]['key']
): Promise<POSDatabaseSchema[K]['value'] | undefined> {
  return storageEngine.get(storeName as StoreName, String(id));
}

/**
 * Retrieve all items in a store
 */
export async function getAllEntities<K extends keyof POSDatabaseSchema>(
  storeName: K
): Promise<Array<POSDatabaseSchema[K]['value']>> {
  return storageEngine.getAll(storeName as StoreName);
}

/**
 * Put / Save an item in the store (auto-stamps timestamps and queues offline mutation if not synced)
 */
export async function saveEntity<K extends 'products' | 'customers' | 'orders'>(
  storeName: K,
  item: POSDatabaseSchema[K]['value'],
  options: { queueSync?: boolean } = { queueSync: true }
): Promise<POSDatabaseSchema[K]['value']> {
  const now = Date.now();
  const entityWithMeta: any = {
    ...item,
    id: item.id || `local_${now}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: (item as any).createdAt || now,
    updatedAt: now,
    synced: (item as any).synced ?? false,
  };

  await storageEngine.put(storeName as StoreName, entityWithMeta);

  if (options.queueSync && !entityWithMeta.synced) {
    await enqueueSyncMutation({
      entity: storeName,
      action: (item as any).createdAt ? 'update' : 'create',
      payload: entityWithMeta
    });
  }

  return entityWithMeta;
}

/**
 * Bulk save items into a store
 */
export async function bulkSaveEntities<K extends 'products' | 'customers' | 'orders'>(
  storeName: K,
  items: Array<POSDatabaseSchema[K]['value']>
): Promise<void> {
  const now = Date.now();
  for (const item of items) {
    const entityWithMeta: any = {
      ...item,
      id: item.id || `local_${now}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: (item as any).createdAt || now,
      updatedAt: now,
    };
    await storageEngine.put(storeName as StoreName, entityWithMeta);
  }
}

/**
 * Delete an item from a store by ID
 */
export async function deleteEntity<K extends 'products' | 'customers' | 'orders'>(
  storeName: K,
  id: string,
  options: { queueSync?: boolean } = { queueSync: true }
): Promise<void> {
  await storageEngine.delete(storeName as StoreName, id);

  if (options.queueSync) {
    await enqueueSyncMutation({
      entity: storeName,
      action: 'delete',
      payload: { id }
    });
  }
}

/**
 * Count items in a store
 */
export async function countEntities<K extends keyof POSDatabaseSchema>(
  storeName: K
): Promise<number> {
  return storageEngine.count(storeName as StoreName);
}

/**
 * Clear all records in a store
 */
export async function clearStore<K extends keyof POSDatabaseSchema>(
  storeName: K
): Promise<void> {
  return storageEngine.clear(storeName as StoreName);
}

// ============================================================================
// OFFLINE SYNC QUEUE MANAGEMENT
// ============================================================================

/**
 * Add a pending mutation to the offline sync queue
 */
export async function enqueueSyncMutation(mutation: {
  entity: 'products' | 'customers' | 'orders' | 'settings';
  action: 'create' | 'update' | 'delete';
  payload: any;
}): Promise<SyncQueueEntity> {
  const syncItem: SyncQueueEntity = {
    id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    entity: mutation.entity,
    action: mutation.action,
    payload: mutation.payload,
    timestamp: Date.now(),
    attempts: 0,
    status: 'pending'
  };

  await storageEngine.put('sync_queue', syncItem);
  await notifySyncListeners();
  return syncItem;
}

/**
 * Get all pending sync items
 */
export async function getPendingSyncQueue(): Promise<SyncQueueEntity[]> {
  try {
    const allQueue: SyncQueueEntity[] = await storageEngine.getAll('sync_queue');
    return allQueue.filter(item => item && (item.status === 'pending' || item.status === 'failed'));
  } catch {
    return [];
  }
}

/**
 * Get live stats on the sync queue
 */
export async function getSyncQueueStats(): Promise<{
  pendingCount: number;
  isSyncing: boolean;
  lastSyncTime: number | null;
}> {
  try {
    const pending = await getPendingSyncQueue();
    return {
      pendingCount: pending.length,
      isSyncing: isCurrentlySyncing,
      lastSyncTime: lastSyncTimestamp,
    };
  } catch {
    return {
      pendingCount: 0,
      isSyncing: isCurrentlySyncing,
      lastSyncTime: lastSyncTimestamp,
    };
  }
}

/**
 * Trigger synchronization process for all pending offline mutations
 */
export async function processSyncQueue(
  onProgress?: (progress: { current: number; total: number; entity: string }) => void
): Promise<{ success: boolean; processed: number; errors: number }> {
  if (isCurrentlySyncing) {
    return { success: false, processed: 0, errors: 0 };
  }

  isCurrentlySyncing = true;
  await notifySyncListeners();

  let processed = 0;
  let errors = 0;

  try {
    const pendingItems = await getPendingSyncQueue();

    for (let i = 0; i < pendingItems.length; i++) {
      const item = pendingItems[i];
      if (onProgress) {
        onProgress({ current: i + 1, total: pendingItems.length, entity: item.entity });
      }

      // Mark as syncing
      item.status = 'syncing';
      item.attempts += 1;
      await storageEngine.put('sync_queue', item);

      // Simulate network sync latency
      await new Promise(resolve => setTimeout(resolve, 300));

      // Successfully synchronized: mark original entity as synced
      if (item.action !== 'delete' && (item.entity === 'products' || item.entity === 'customers' || item.entity === 'orders')) {
        const stored = await storageEngine.get(item.entity, item.payload.id);
        if (stored) {
          stored.synced = true;
          await storageEngine.put(item.entity, stored);
        }
      }

      // Remove from sync queue
      await storageEngine.delete('sync_queue', item.id);
      processed++;
    }

    lastSyncTimestamp = Date.now();
  } catch (err: any) {
    console.warn('Error processing sync queue:', err);
    errors++;
  } finally {
    isCurrentlySyncing = false;
    await notifySyncListeners();
  }

  return { success: errors === 0, processed, errors };
}

/**
 * Seed initial sample entities if empty
 */
export async function seedInitialIndexedDB(): Promise<void> {
  try {
    const productCount = await countEntities('products');

    if (productCount === 0) {
      const initialProducts: ProductEntity[] = [
        { id: 'prod_1', name: 'Artisan Espresso Blend 1kg', sku: 'COF-ESP-001', barcode: '6221001001', price: 420, stock: 85, category: 'Beverages', synced: true, createdAt: Date.now(), updatedAt: Date.now() },
        { id: 'prod_2', name: 'Cold Brew Bottled 330ml', sku: 'COF-CLD-002', barcode: '6221001002', price: 65, stock: 120, category: 'Beverages', synced: true, createdAt: Date.now(), updatedAt: Date.now() },
        { id: 'prod_3', name: 'Whole Wheat Butter Croissant', sku: 'BAK-WHT-003', barcode: '6221001003', price: 45, stock: 40, category: 'Bakery', synced: true, createdAt: Date.now(), updatedAt: Date.now() },
        { id: 'prod_4', name: 'Organic Matcha Green Tea Powder', sku: 'TEA-MTC-004', barcode: '6221001004', price: 280, stock: 35, category: 'Tea & Infusions', synced: true, createdAt: Date.now(), updatedAt: Date.now() },
        { id: 'prod_5', name: 'Stainless Thermal Tumbler 500ml', sku: 'MER-TUM-005', barcode: '6221001005', price: 350, stock: 24, category: 'Merchandise', synced: true, createdAt: Date.now(), updatedAt: Date.now() }
      ];
      await bulkSaveEntities('products', initialProducts);
    }

    const customerCount = await countEntities('customers');
    if (customerCount === 0) {
      const initialCustomers: CustomerEntity[] = [
        { id: 'cust_1', name: 'Karim Mostafa', phone: '+201001234567', email: 'karim@momken.eg', loyaltyPoints: 450, tier: 'Gold', synced: true, createdAt: Date.now(), updatedAt: Date.now() },
        { id: 'cust_2', name: 'Nour El-Din', phone: '+201119876543', email: 'nour@gmail.com', loyaltyPoints: 120, tier: 'Silver', synced: true, createdAt: Date.now(), updatedAt: Date.now() },
        { id: 'cust_3', name: 'Salma Youssef', phone: '+201223456789', email: 'salma@tech.com', loyaltyPoints: 980, tier: 'Platinum', synced: true, createdAt: Date.now(), updatedAt: Date.now() }
      ];
      await bulkSaveEntities('customers', initialCustomers);
    }
  } catch {
    // Silently continue
  }
}
