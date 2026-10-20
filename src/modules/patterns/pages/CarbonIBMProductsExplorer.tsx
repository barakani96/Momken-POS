import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  Row,
  Column,
  Stack,
  Tile,
  ClickableTile,
  Button,
  ButtonSet,
  Tag,
  TextInput,
  Select,
  SelectItem,
  CodeSnippet,
  Link,
  Accordion,
  AccordionItem,
} from '@carbon/react';
import {
  Launch,
  Add,
  Settings,
  Notification,
  Warning,
  Checkmark,
  Information,
  Maximize,
  Document,
  ArrowRight,
  Filter,
  Idea,
  User,
  ShoppingBag,
} from '@carbon/icons-react';
import {
  PageHeader,
  SidePanel,
  Tearsheet,
  TearsheetNarrow,
  NotificationsPanel,
  ProductiveCard,
  ExpressiveCard,
  Checklist,
  InterstitialScreen,
  SingleAddSelect,
  FullPageError,
  NotificationItem,
  CatalogItem,
} from '../../../shared/components/ibm-products';

export default function CarbonIBMProductsExplorer() {
  const navigate = useNavigate();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // 1. SidePanel Playground States
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [sidePanelSize, setSidePanelSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'max'>('md');
  const [sidePanelPlacement, setSidePanelPlacement] = useState<'right' | 'left'>('right');
  const [panelCustomerName, setPanelCustomerName] = useState('Nour El-Din');
  const [panelDiscountTier, setPanelDiscountTier] = useState('Gold');

  // 2. Tearsheet Playground States
  const [isTearsheetOpen, setIsTearsheetOpen] = useState(false);
  const [isTearsheetNarrowOpen, setIsTearsheetNarrowOpen] = useState(false);
  const [tearsheetStep, setTearsheetStep] = useState(0);
  const [hasInfluencer, setHasInfluencer] = useState(true);

  // 3. Notifications Panel States
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      title: 'Offline Sync Queue Synced',
      description: '14 transactions completed during network outage have been committed to central ledger.',
      timestamp: '2 mins ago',
      type: 'success',
      read: false,
      category: 'sync',
      actionLabel: 'View Audit Log',
      onAction: () => alert('Opening audit log'),
    },
    {
      id: 'notif_2',
      title: 'Low Stock Alert: Whole Wheat Croissant',
      description: 'Stock level dropped below safety threshold (8 units remaining).',
      timestamp: '15 mins ago',
      type: 'warning',
      read: false,
      category: 'inventory',
      actionLabel: 'Reorder Now',
      onAction: () => alert('Reorder triggered'),
    },
    {
      id: 'notif_3',
      title: 'Shift Reconciliation Required',
      description: 'Cashier Ahmed shift closed with $12.50 cash drawer variance.',
      timestamp: '1 hour ago',
      type: 'error',
      read: true,
      category: 'orders',
    },
  ]);

  // 4. Checklist Playground States
  const [checklistTasks, setChecklistTasks] = useState([
    {
      id: 'chk_1',
      title: 'Configure branch tax rate & currency format',
      description: 'Set standard 14% Egyptian VAT and localized currency prefix.',
      completed: true,
      estimatedTime: '2 min',
      actionLabel: 'Open Settings',
      onAction: () => navigate('/settings'),
    },
    {
      id: 'chk_2',
      title: 'Pair Serial / Bluetooth Barcode Scanner',
      description: 'Authorize Web Serial API access to standard USB-HID scanner hardware.',
      completed: false,
      estimatedTime: '3 min',
      actionLabel: 'Pair Device',
      onAction: () => navigate('/pos'),
    },
    {
      id: 'chk_3',
      title: 'Import initial store product catalog',
      description: 'Upload CSV or sync products from cloud inventory.',
      completed: false,
      estimatedTime: '5 min',
      actionLabel: 'Go to Catalog',
      onAction: () => navigate('/products'),
    },
    {
      id: 'chk_4',
      title: 'Verify offline transaction caching',
      description: 'Test airplane mode order persistence and sync queue queueing.',
      completed: false,
      estimatedTime: '1 min',
      actionLabel: 'Test Offline POS',
      onAction: () => navigate('/pos'),
    },
  ]);

  // 5. Interstitial Screen States
  const [isInterstitialOpen, setIsInterstitialOpen] = useState(false);

  // 6. SingleAddSelect States
  const [isAddSelectOpen, setIsAddSelectOpen] = useState(false);
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<CatalogItem | null>(null);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([
    { id: 'p_1', title: 'Artisan Espresso Blend 1kg', category: 'Beverages', price: 420, sku: 'COF-ESP-001', subtitle: 'Arabica dark roast' },
    { id: 'p_2', title: 'Cold Brew Bottled 330ml', category: 'Beverages', price: 65, sku: 'COF-CLD-002', subtitle: 'Single-origin Ethiopia' },
    { id: 'p_3', title: 'Whole Wheat Butter Croissant', category: 'Bakery', price: 45, sku: 'BAK-WHT-003', subtitle: 'Freshly baked' },
    { id: 'p_4', title: 'Stainless Thermal Tumbler 500ml', category: 'Merchandise', price: 350, sku: 'MER-TUM-005', subtitle: 'Double-walled steel' },
    { id: 'p_5', title: 'Zebra DS2208 Handheld Scanner', category: 'Hardware', price: 1850, sku: 'HW-SCN-009', subtitle: '2D Barcode scanner' },
  ]);

  // 7. FullPageError States
  const [errorPreviewKind, setErrorPreviewKind] = useState<'404' | '403' | '500' | 'maintenance'>('404');
  const [showFullscreenError, setShowFullscreenError] = useState(false);

  const toggleChecklistTask = (id: string, completed: boolean) => {
    setChecklistTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed } : t))
    );
  };

  return (
    <>
      {/* 1. Carbon for IBM Products PageHeader Pattern */}
      <PageHeader
        title="IBM Carbon for IBM Products — Component Patterns"
        subtitle="Standardized enterprise patterns from @carbon/ibm-products (SidePanel, Tearsheet, PageHeader, Cards, Onboarding, and Add & Select) natively implemented for POS terminal systems."
        breadcrumbs={[
          { label: 'POS Terminal', onClick: () => navigate('/pos') },
          { label: 'Pattern Library', onClick: () => navigate('/patterns') },
          { label: 'IBM Products Components' },
        ]}
        tags={[
          { label: '@carbon/ibm-products', type: 'blue' },
          { label: '12 Patterns Active', type: 'green' },
          { label: 'Enterprise Ready', type: 'purple' },
        ]}
        actionButtons={[
          {
            label: 'Open Notifications',
            kind: 'secondary',
            renderIcon: Notification,
            onClick: () => setIsNotificationsOpen(true),
          },
          {
            label: 'Launch Interstitial Tour',
            kind: 'primary',
            renderIcon: Idea,
            onClick: () => setIsInterstitialOpen(true),
          },
        ]}
        tabs={[
          { label: 'Overview & Showcase', key: 'overview' },
          { label: 'Panels & Tearsheets', key: 'panels' },
          { label: 'Cards & Metrics', key: 'cards' },
          { label: 'Onboarding & Catalog', key: 'onboarding' },
          { label: 'Error States & Guidance', key: 'errors' },
        ]}
        activeTabIndex={selectedTabIndex}
        onTabChange={setSelectedTabIndex}
      />

      <div style={{ padding: '2rem' }}>
        {/* TAB 0: OVERVIEW & ARCHITECTURE */}
        {selectedTabIndex === 0 && (
          <Stack gap={7}>
            <div>
              <h2 className="heading-04" style={{ marginBottom: '0.5rem' }}>
                Carbon for IBM Products Architecture
              </h2>
              <p className="body-01" style={{ color: 'var(--cds-text-secondary)', maxWidth: '900px' }}>
                IBM Carbon for IBM Products extends the core Carbon Design System with high-order patterns designed for complex workflows, contextual drill-downs, onboarding, and high-density operational data.
              </p>
            </div>

            {/* Pattern Grid Links */}
            <Grid fullWidth narrow>
              <Column sm={4} md={4} lg={5}>
                <ClickableTile onClick={() => setSelectedTabIndex(1)} style={{ height: '100%' }}>
                  <Tag type="blue" size="sm">Overlay Patterns</Tag>
                  <h3 className="heading-03" style={{ margin: '0.75rem 0 0.25rem 0' }}>SidePanel & Tearsheet</h3>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
                    Contextual slide-over panels and wide multi-step configuration tearsheets.
                  </p>
                </ClickableTile>
              </Column>

              <Column sm={4} md={4} lg={5}>
                <ClickableTile onClick={() => setSelectedTabIndex(2)} style={{ height: '100%' }}>
                  <Tag type="green" size="sm">Information Architecture</Tag>
                  <h3 className="heading-03" style={{ margin: '0.75rem 0 0.25rem 0' }}>Productive & Expressive Cards</h3>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
                    Dense metric cards with overflow menus and expressive media-rich hero cards.
                  </p>
                </ClickableTile>
              </Column>

              <Column sm={4} md={4} lg={6}>
                <ClickableTile onClick={() => setSelectedTabIndex(3)} style={{ height: '100%' }}>
                  <Tag type="purple" size="sm">User Guidance</Tag>
                  <h3 className="heading-03" style={{ margin: '0.75rem 0 0.25rem 0' }}>Onboarding & Add/Select</h3>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
                    Interactive setup checklist, feature interstitial screen, and single add & select catalog dialogs.
                  </p>
                </ClickableTile>
              </Column>
            </Grid>

            {/* Live Onboarding Checklist Embedded */}
            <div>
              <h3 className="heading-03" style={{ marginBottom: '1rem' }}>Active Store Onboarding Checklist</h3>
              <Checklist
                tasks={checklistTasks}
                onToggleTask={toggleChecklistTask}
                onDismiss={() => alert('Checklist dismissed')}
              />
            </div>
          </Stack>
        )}

        {/* TAB 1: PANELS & TEARSHEETS */}
        {selectedTabIndex === 1 && (
          <Stack gap={7}>
            <div>
              <h2 className="heading-04" style={{ marginBottom: '0.5rem' }}>SidePanel & Tearsheet Patterns</h2>
              <p className="body-01" style={{ color: 'var(--cds-text-secondary)', maxWidth: '900px' }}>
                Used for non-disruptive task completion, deep editing, and multi-step configurations without losing place in the primary view.
              </p>
            </div>

            {/* Interactive Triggers */}
            <Tile style={{ padding: '2rem' }}>
              <h3 className="heading-03" style={{ marginBottom: '1rem' }}>Interactive Controls & Configuration</h3>
              <Grid fullWidth narrow>
                <Column sm={4} md={4} lg={4}>
                  <Select
                    id="sidepanel-size-select"
                    labelText="SidePanel Size"
                    value={sidePanelSize}
                    onChange={(e) => setSidePanelSize(e.target.value as any)}
                  >
                    <SelectItem value="xs" text="xs (320px)" />
                    <SelectItem value="sm" text="sm (380px)" />
                    <SelectItem value="md" text="md (480px - Default)" />
                    <SelectItem value="lg" text="lg (640px)" />
                    <SelectItem value="max" text="max (768px)" />
                  </Select>
                </Column>

                <Column sm={4} md={4} lg={4}>
                  <Select
                    id="sidepanel-pos-select"
                    labelText="Placement Anchor"
                    value={sidePanelPlacement}
                    onChange={(e) => setSidePanelPlacement(e.target.value as any)}
                  >
                    <SelectItem value="right" text="Right slide-out (Standard)" />
                    <SelectItem value="left" text="Left slide-out" />
                  </Select>
                </Column>

                <Column sm={4} md={8} lg={8}>
                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Button kind="primary" onClick={() => setIsSidePanelOpen(true)}>
                      Launch SidePanel ({sidePanelSize})
                    </Button>
                    <Button kind="secondary" onClick={() => setIsTearsheetOpen(true)}>
                      Launch Wide Tearsheet (Multi-Step)
                    </Button>
                    <Button kind="tertiary" onClick={() => setIsTearsheetNarrowOpen(true)}>
                      Launch Narrow Tearsheet
                    </Button>
                  </div>
                </Column>
              </Grid>
            </Tile>

            {/* Pattern Documentation Reference */}
            <Tile style={{ backgroundColor: 'var(--cds-layer-01)' }}>
              <h4 className="heading-02" style={{ marginBottom: '0.5rem' }}>Documentation Reference Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link href="https://ibm-products.carbondesignsystem.com/?path=/docs/components-sidepanel--overview" target="_blank" renderIcon={Launch}>
                  IBM Products SidePanel Storybook Overview
                </Link>
                <Link href="https://ibm-products.carbondesignsystem.com/?path=/docs/preview-tearsheet--overview" target="_blank" renderIcon={Launch}>
                  IBM Products Tearsheet Storybook Overview
                </Link>
                <Link href="https://ibm-products.carbondesignsystem.com/?path=/docs/components-tearsheet-tearsheetnarrow--overview" target="_blank" renderIcon={Launch}>
                  IBM Products TearsheetNarrow Storybook Overview
                </Link>
              </div>
            </Tile>
          </Stack>
        )}

        {/* TAB 2: CARDS & METRICS */}
        {selectedTabIndex === 2 && (
          <Stack gap={7}>
            <div>
              <h2 className="heading-04" style={{ marginBottom: '0.5rem' }}>Productive & Expressive Cards</h2>
              <p className="body-01" style={{ color: 'var(--cds-text-secondary)', maxWidth: '900px' }}>
                Modular content containers matching Carbon for IBM Products card specifications.
              </p>
            </div>

            {/* Productive Cards Showcase */}
            <div>
              <h3 className="heading-03" style={{ marginBottom: '1rem' }}>Productive Cards (Data Dense & Operational)</h3>
              <Grid fullWidth narrow>
                <Column sm={4} md={4} lg={4}>
                  <ProductiveCard
                    label="Terminal Hardware"
                    title="Barcode Scanner 01"
                    subtitle="USB Serial / HID"
                    statusTag={{ label: 'Connected', type: 'green' }}
                    metric="1,420"
                    metricLabel="Scans processed today"
                    description="Zebra DS2208 operating at 9600 baud rate with auto-carriage return enabled."
                    overflowActions={[
                      { label: 'Calibrate', onClick: () => alert('Calibrating') },
                      { label: 'Reset Port', onClick: () => alert('Resetting') },
                    ]}
                    primaryAction={{ label: 'Diagnostics', onClick: () => alert('Opening diagnostics') }}
                  />
                </Column>

                <Column sm={4} md={4} lg={4}>
                  <ProductiveCard
                    label="Sync Engine"
                    title="IndexedDB Store"
                    subtitle="Offline Resilient"
                    statusTag={{ label: 'Healthy', type: 'blue' }}
                    metric="0 Pending"
                    metricLabel="All records committed"
                    description="Client-side transaction queue with automatic background reconciliation on network reconnect."
                    primaryAction={{ label: 'View Queue', onClick: () => alert('Viewing queue') }}
                    secondaryAction={{ label: 'Force Sync', onClick: () => alert('Force sync triggered') }}
                  />
                </Column>

                <Column sm={4} md={4} lg={4}>
                  <ProductiveCard
                    label="Inventory"
                    title="Low Stock Watch"
                    subtitle="3 Items Critical"
                    statusTag={{ label: 'Action Needed', type: 'red' }}
                    metric="3 SKUs"
                    metricLabel="Below reorder point"
                    description="Butter Croissants, Cold Brew Bottled, and Espresso Beans require immediate supply order."
                    primaryAction={{ label: 'Order Supplies', onClick: () => navigate('/products') }}
                  />
                </Column>
              </Grid>
            </div>

            {/* Expressive Cards Showcase */}
            <div>
              <h3 className="heading-03" style={{ marginBottom: '1rem' }}>Expressive Cards (Visual & Editorial)</h3>
              <Grid fullWidth narrow>
                <Column sm={4} md={4} lg={6}>
                  <ExpressiveCard
                    label="Featured Promotion"
                    title="Summer Artisan Cold Brew Bundle"
                    subtitle="Valid until September 30, 2026"
                    tags={[
                      { label: '25% Discount', type: 'purple' },
                      { label: 'Loyalty Bonus', type: 'blue' },
                    ]}
                    description="Bundle any pastry with our cold brew bottled reserve and earn 50 additional Momken reward points automatically at checkout."
                    primaryAction={{ label: 'Apply in POS', onClick: () => navigate('/pos') }}
                    secondaryAction={{ label: 'Configure Rules', onClick: () => navigate('/promotions') }}
                  />
                </Column>

                <Column sm={4} md={4} lg={6}>
                  <ExpressiveCard
                    label="Hardware Integration"
                    title="RFID Smart Tray Integration"
                    subtitle="Simultaneous 30-item scan"
                    tags={[
                      { label: 'UHF RFID', type: 'cool-gray' },
                      { label: 'Instant Tally', type: 'green' },
                    ]}
                    description="Place items directly onto the reader tray for sub-second recognition, dynamic pricing calculation, and tamper prevention."
                    primaryAction={{ label: 'Open RFID Hub', onClick: () => navigate('/rfid') }}
                  />
                </Column>
              </Grid>
            </div>
          </Stack>
        )}

        {/* TAB 3: ONBOARDING & CATALOG */}
        {selectedTabIndex === 3 && (
          <Stack gap={7}>
            <div>
              <h2 className="heading-04" style={{ marginBottom: '0.5rem' }}>Onboarding & Add/Select Patterns</h2>
              <p className="body-01" style={{ color: 'var(--cds-text-secondary)', maxWidth: '900px' }}>
                Streamline user setup flows, introduce major releases, and provide streamlined catalog item selection.
              </p>
            </div>

            <Tile style={{ padding: '2rem' }}>
              <h3 className="heading-03" style={{ marginBottom: '1rem' }}>Test Add & Select and Interstitial Flows</h3>
              <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                Currently Selected Catalog Item: <strong>{selectedCatalogItem ? `${selectedCatalogItem.title} ($${selectedCatalogItem.price})` : 'None'}</strong>
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button kind="primary" renderIcon={Add} iconDescription="Launch SingleAddSelect Dialog" onClick={() => setIsAddSelectOpen(true)}>
                  Launch SingleAddSelect Dialog
                </Button>
                <Button kind="secondary" renderIcon={Idea} iconDescription="Launch Feature Interstitial Tour" onClick={() => setIsInterstitialOpen(true)}>
                  Launch Feature Interstitial Tour
                </Button>
              </div>
            </Tile>
          </Stack>
        )}

        {/* TAB 4: ERROR STATES & GUIDANCE */}
        {selectedTabIndex === 4 && (
          <Stack gap={7}>
            <div>
              <h2 className="heading-04" style={{ marginBottom: '0.5rem' }}>FullPageError Pattern</h2>
              <p className="body-01" style={{ color: 'var(--cds-text-secondary)', maxWidth: '900px' }}>
                Structured error templates providing clear causes, HTTP status codes, and actionable resolution steps.
              </p>
            </div>

            <Tile style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <div style={{ width: '240px' }}>
                  <Select
                    id="error-kind-select"
                    labelText="Select Error Variant"
                    value={errorPreviewKind}
                    onChange={(e) => setErrorPreviewKind(e.target.value as any)}
                  >
                    <SelectItem value="404" text="404 Not Found" />
                    <SelectItem value="403" text="403 Access Denied / Locked" />
                    <SelectItem value="500" text="500 Internal Fault" />
                    <SelectItem value="maintenance" text="Scheduled Maintenance" />
                  </Select>
                </div>

                <Button kind="danger" onClick={() => setShowFullscreenError(true)}>
                  Preview Full-Page Error
                </Button>
              </div>

              {/* Embedded Error Preview */}
              <div style={{ border: '1px solid var(--cds-border-subtle)', backgroundColor: 'var(--cds-layer-01)' }}>
                <FullPageError
                  kind={errorPreviewKind}
                  onPrimaryAction={() => alert('Return to POS clicked')}
                  onSecondaryAction={() => alert('Retry clicked')}
                  nextSteps={[
                    'Verify network connection in the global status bar.',
                    'Check user permissions under Shift Management.',
                    'Consult terminal diagnostic buffer for trace logs.',
                  ]}
                />
              </div>
            </Tile>
          </Stack>
        )}
      </div>

      {/* ========================================================================= */}
      {/* POPUP & DRAWER PATTERN INSTANCES */}
      {/* ========================================================================= */}

      {/* 1. SidePanel Instance */}
      <SidePanel
        open={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        title="Customer Profile & Quick Edit"
        subtitle="Manage loyalty tier, custom line discounts, and tax exemptions."
        size={sidePanelSize}
        placement={sidePanelPlacement}
        primaryButtonText="Save Changes"
        onPrimaryClick={() => {
          alert(`Saved profile for ${panelCustomerName}`);
          setIsSidePanelOpen(false);
        }}
        secondaryButtonText="Cancel"
      >
        <Stack gap={6}>
          <TextInput
            id="panel-customer-name"
            labelText="Customer Full Name"
            value={panelCustomerName}
            onChange={(e) => setPanelCustomerName(e.target.value)}
          />

          <Select
            id="panel-tier-select"
            labelText="Loyalty Tier"
            value={panelDiscountTier}
            onChange={(e) => setPanelDiscountTier(e.target.value)}
          >
            <SelectItem value="Bronze" text="Bronze Tier (0% Discount)" />
            <SelectItem value="Silver" text="Silver Tier (5% Discount)" />
            <SelectItem value="Gold" text="Gold Tier (10% Discount)" />
            <SelectItem value="Platinum" text="Platinum VIP (15% Discount)" />
          </Select>

          <Tile style={{ backgroundColor: 'var(--cds-layer-02)' }}>
            <h4 className="heading-01" style={{ marginBottom: '0.25rem' }}>Active Purchase Statistics</h4>
            <p className="body-01" style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
              Lifetime spend: $4,850.00 • 34 Orders • 0 Returns
            </p>
          </Tile>
        </Stack>
      </SidePanel>

      {/* 2. Wide Multi-Step Tearsheet Instance */}
      <Tearsheet
        open={isTearsheetOpen}
        onClose={() => setIsTearsheetOpen(false)}
        title="Store Shift Reconciliation & Cash Drawer Close"
        description="Follow the guided wizard to verify cash counts, audit variance, and produce fiscal end-of-day reports."
        label="Shift Management"
        steps={[
          { label: 'Cash Drawer Tally', secondaryLabel: 'Required' },
          { label: 'Card & Digital Split', secondaryLabel: 'Optional' },
          { label: 'Audit & Finalize', secondaryLabel: 'Fiscal sign-off' },
        ]}
        currentStep={tearsheetStep}
        onStepChange={setTearsheetStep}
        influencer={
          <div>
            <h4 className="heading-01" style={{ marginBottom: '0.5rem' }}>Shift Summary</h4>
            <Stack gap={4}>
              <div>
                <span className="label-01" style={{ color: 'var(--cds-text-secondary)' }}>Cashier:</span>
                <p className="body-01" style={{ margin: 0, fontWeight: 600 }}>Ahmed Hassan</p>
              </div>
              <div>
                <span className="label-01" style={{ color: 'var(--cds-text-secondary)' }}>Expected Cash:</span>
                <p className="body-01" style={{ margin: 0, fontWeight: 600 }}>$1,240.00</p>
              </div>
              <div>
                <span className="label-01" style={{ color: 'var(--cds-text-secondary)' }}>Status:</span>
                <Tag type="green" size="sm">Balanced</Tag>
              </div>
            </Stack>
          </div>
        }
        influencerPosition="right"
        primaryButtonText={tearsheetStep === 2 ? 'Close & Print Report' : 'Next Step'}
        onPrimaryClick={() => {
          if (tearsheetStep < 2) {
            setTearsheetStep((prev) => prev + 1);
          } else {
            alert('Shift reconciled successfully!');
            setIsTearsheetOpen(false);
            setTearsheetStep(0);
          }
        }}
        secondaryButtonText={tearsheetStep > 0 ? 'Previous' : 'Cancel'}
        onSecondaryClick={() => {
          if (tearsheetStep > 0) {
            setTearsheetStep((prev) => prev - 1);
          } else {
            setIsTearsheetOpen(false);
          }
        }}
      >
        <Stack gap={6}>
          {tearsheetStep === 0 && (
            <div>
              <h3 className="heading-03" style={{ marginBottom: '0.5rem' }}>Step 1: Physical Cash Count</h3>
              <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                Enter the total counted cash in the register drawer.
              </p>
              <TextInput id="cash-count-input" labelText="Counted Cash Amount ($)" defaultValue="1240.00" />
            </div>
          )}

          {tearsheetStep === 1 && (
            <div>
              <h3 className="heading-03" style={{ marginBottom: '0.5rem' }}>Step 2: Electronic Settlements</h3>
              <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                Confirm terminal batch settlement with credit card processor.
              </p>
              <TextInput id="cc-batch-input" labelText="POS Terminal Batch Total ($)" defaultValue="3890.50" />
            </div>
          )}

          {tearsheetStep === 2 && (
            <div>
              <h3 className="heading-03" style={{ marginBottom: '0.5rem' }}>Step 3: Verification & Fiscal Report</h3>
              <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                All drawer balances match expected totals. Submitting will generate Z-Report.
              </p>
              <Tag type="green" size="md">Zero Variance Detected</Tag>
            </div>
          )}
        </Stack>
      </Tearsheet>

      {/* 3. Narrow Tearsheet Instance */}
      <TearsheetNarrow
        open={isTearsheetNarrowOpen}
        onClose={() => setIsTearsheetNarrowOpen(false)}
        title="Quick Product Price Override"
        description="Override the unit price for a specific transaction batch."
        label="Terminal Override"
        primaryButtonText="Apply Override"
        onPrimaryClick={() => {
          alert('Price override applied!');
          setIsTearsheetNarrowOpen(false);
        }}
        secondaryButtonText="Cancel"
      >
        <Stack gap={5}>
          <TextInput id="override-sku" labelText="SKU Code" defaultValue="COF-ESP-001" readOnly />
          <TextInput id="override-price" labelText="New Unit Price ($)" defaultValue="390.00" />
          <TextInput id="override-reason" labelText="Override Reason" placeholder="e.g. Manager courtesy discount" />
        </Stack>
      </TearsheetNarrow>

      {/* 4. Notifications Panel Instance */}
      <NotificationsPanel
        open={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onClearAll={() => setNotifications([])}
        onDismissNotification={(id) => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }}
      />

      {/* 5. Interstitial Screen Instance */}
      <InterstitialScreen
        open={isInterstitialOpen}
        onClose={() => setIsInterstitialOpen(false)}
        onFinish={() => alert('Tour completed!')}
        headerTitle="Welcome to IBM Carbon POS v2.4"
        steps={[
          {
            title: 'Unified IBM Products Architecture',
            subtitle: 'Enterprise components designed for speed',
            description: 'Experience seamless PageHeaders, contextual SidePanels, and guided multi-step Tearsheets engineered specifically for high-volume retail transactions.',
            bullets: [
              'Zero-latency offline IndexedDB synchronization',
              'Integrated Web Serial Barcode & Scale support',
              'Sub-second keyboard shortcuts across all views',
            ],
            tag: 'New Design',
          },
          {
            title: 'Smart Loyalty & Promotions Engine',
            subtitle: 'Real-time tier calculation and customer perks',
            description: 'Reward repeat customers with dynamic tier bonuses, automated bundle pricing, and digital receipt delivery.',
            bullets: [
              'InstaPay and Digital Wallet split payments',
              'Live kitchen display system dispatch',
              'Automated Z-Report generation',
            ],
            tag: 'Revenue Engine',
          },
        ]}
      />

      {/* 6. SingleAddSelect Catalog Picker Instance */}
      <SingleAddSelect
        open={isAddSelectOpen}
        onClose={() => setIsAddSelectOpen(false)}
        items={catalogItems}
        selectedId={selectedCatalogItem?.id}
        onSelect={(item) => setSelectedCatalogItem(item)}
        onAddNewItem={(newItem) => {
          const item: CatalogItem = {
            id: newItem.id || `custom_${Date.now()}`,
            title: newItem.title || 'New Item',
            category: newItem.category || 'General',
            price: newItem.price || 0,
            sku: newItem.sku,
            subtitle: newItem.subtitle,
          };
          setCatalogItems((prev) => [item, ...prev]);
        }}
      />
    </>
  );
}
