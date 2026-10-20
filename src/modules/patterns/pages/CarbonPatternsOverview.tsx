import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stack,
  Grid,
  Column,
  Tile,
  ClickableTile,
  ExpandableTile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
  Button,
  ButtonSet,
  Modal,
  InlineNotification,
  ToastNotification,
  ActionableNotification,
  Search,
  TextInput,
  NumberInput,
  Select,
  SelectItem,
  TextArea,
  Tag,
  Accordion,
  AccordionItem,
  DataTableSkeleton,
  SkeletonText,
  SkeletonPlaceholder,
  InlineLoading,
  ContentSwitcher,
  Switch,
  Link,
  CodeSnippet,
  Toggle
} from '@carbon/react';
import {
  Checkmark,
  Warning,
  Error as ErrorIcon,
  Information,
  TrashCan,
  Edit,
  Add,
  Renew,
  Launch,
  Copy,
  ChevronRight,
  Locked,
  WarningFilled,
  DocumentUnknown,
  Filter,
  Search as SearchIcon,
  Save,
  Undo,
  Carbon
} from '@carbon/icons-react';
import { PageHeader, MetricCard } from '../../../shared/components/ibm-products';

export default function CarbonPatternsOverview() {
  const navigate = useNavigate();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // Common Actions States
  const [isDestructiveModalOpen, setIsDestructiveModalOpen] = useState(false);
  const [isTransactionalModalOpen, setIsTransactionalModalOpen] = useState(false);
  const [isPassiveModalOpen, setIsPassiveModalOpen] = useState(false);

  // Loading States
  const [isLoadingActive, setIsLoadingActive] = useState(false);
  const [inlineLoadingStatus, setInlineLoadingStatus] = useState<'inactive' | 'active' | 'finished' | 'error'>('inactive');

  // Form Validation States
  const [formName, setFormName] = useState('Flagship Store Terminal');
  const [formEmail, setFormEmail] = useState('pos-admin@store.ibm.com');
  const [formDiscount, setFormDiscount] = useState<number>(10);
  const [formNotes, setFormNotes] = useState('');

  // Notifications State
  const [activeToast, setActiveToast] = useState<{ id: string; title: string; kind: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [actionableUndone, setActionableUndone] = useState(false);

  // Filtering & Search State
  const [filterSearch, setFilterSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [activeTags, setActiveTags] = useState<string[]>(['In Stock', 'Featured']);

  // Empty State Variant Selector
  const [emptyStateVariant, setEmptyStateVariant] = useState<'no-data' | 'not-found' | 'error' | 'unauthorized'>('no-data');

  const triggerAsyncAction = () => {
    setInlineLoadingStatus('active');
    setTimeout(() => {
      setInlineLoadingStatus('finished');
      setTimeout(() => setInlineLoadingStatus('inactive'), 2000);
    }, 1500);
  };

  return (
    <>
      <PageHeader
        title="IBM Products & Carbon Core Patterns"
        subtitle="Universal operational patterns, accessible interaction flows, and building block standards built strictly with IBM Carbon and IBM Products."
        breadcrumbs={[
          { label: 'IBM Design System' },
          { label: 'Core Patterns & IBM Products' }
        ]}
        tags={[
          { label: '@carbon/react v1.x', type: 'blue' },
          { label: '@carbon/ibm-products', type: 'green' }
        ]}
        actionButtons={[
          {
            label: 'React Storybook Explorer',
            kind: 'primary',
            renderIcon: Launch,
            onClick: () => navigate('/storybook')
          },
          {
            label: 'UI Shell & Layout Reflection',
            kind: 'tertiary',
            renderIcon: Carbon,
            onClick: () => navigate('/reflection')
          },
          {
            label: 'Open POS Register',
            kind: 'tertiary',
            renderIcon: Launch,
            onClick: () => navigate('/pos')
          }
        ]}
      />

      <div style={{ padding: '0 2rem 3rem 2rem' }}>
        {activeToast && (
          <div style={{ position: 'fixed', top: '4.5rem', right: '2rem', zIndex: 9999 }}>
            <ToastNotification
              kind={activeToast.kind}
              title={activeToast.title}
              subtitle="Carbon Toast Notification dispatched successfully."
              caption={new Date().toLocaleTimeString()}
              timeout={4000}
              onClose={() => setActiveToast(null)}
            />
          </div>
        )}

        <Tabs selectedIndex={selectedTabIndex} onChange={({ selectedIndex }) => setSelectedTabIndex(selectedIndex)}>
          <TabList aria-label="Carbon Universal Patterns" contained>
            <Tab>Overview & Architecture</Tab>
            <Tab>Common Actions</Tab>
            <Tab>Dialogs & Modals</Tab>
            <Tab>Empty States</Tab>
            <Tab>Forms & Validation</Tab>
            <Tab>Loading & Skeletons</Tab>
            <Tab>Filtering & Search</Tab>
            <Tab>Notifications</Tab>
            <Tab>States & Indicators</Tab>
          </TabList>

          <TabPanels>
            {/* 1. Overview & Architecture */}
            <TabPanel style={{ padding: '1.5rem 0' }}>
              <Stack gap={6}>
                <Grid>
                  <Column lg={8} md={4} sm={4}>
                    <Tile style={{ height: '100%' }}>
                      <div className="heading-03" style={{ marginBottom: '0.75rem', color: 'var(--cds-text-primary)' }}>
                        Building Blocks Hierarchy
                      </div>
                      <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.25rem' }}>
                        The Carbon Design System organizes UX architecture into three distinct layers of abstraction:
                      </p>
                      <Stack gap={4}>
                        <div style={{ borderLeft: '3px solid var(--cds-interactive-01, #0f62fe)', paddingLeft: '1rem' }}>
                          <span className="heading-02">1. Foundations</span>
                          <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
                            Core visual grammar: 2x Grid system, Color tokens (White, G10, G90, G100), IBM Plex Typography scales, Spacing tokens, and Motion bezier curves.
                          </p>
                        </div>
                        <div style={{ borderLeft: '3px solid var(--cds-support-info, #4589ff)', paddingLeft: '1rem' }}>
                          <span className="heading-02">2. Components</span>
                          <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
                            Atomic, discrete building blocks with accessible keyboards and styling (Buttons, Dropdowns, DatePickers, Tables, Tabs, Modals).
                          </p>
                        </div>
                        <div style={{ borderLeft: '3px solid var(--cds-support-success, #24a148)', paddingLeft: '1rem' }}>
                          <span className="heading-02">3. Universal Patterns</span>
                          <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
                            Reusable solutions combining multiple components and flows to achieve user tasks: Common Actions, Dialogs, Forms, Empty States, Filtering, and Notifications.
                          </p>
                        </div>
                      </Stack>
                    </Tile>
                  </Column>

                  <Column lg={8} md={4} sm={4}>
                    <Tile style={{ height: '100%', backgroundColor: 'var(--cds-layer-02)' }}>
                      <div className="heading-03" style={{ marginBottom: '0.75rem' }}>
                        Enterprise Implementation Checklist
                      </div>
                      <Stack gap={3}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Tag type="green" renderIcon={Checkmark}>Strictly No Tailwind</Tag>
                          <span className="body-01">100% Carbon SCSS tokens & layout</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Tag type="green" renderIcon={Checkmark}>UI Shell Standards</Tag>
                          <span className="body-01">HeaderContainer, SkipToContent, SideNav Rail</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Tag type="green" renderIcon={Checkmark}>IBM Products Patterns</Tag>
                          <span className="body-01">Tearsheet, Datagrid, SidePanel, CreateModal</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Tag type="green" renderIcon={Checkmark}>WCAG AA Compliant</Tag>
                          <span className="body-01">Focus management, 4.5:1 contrast, ARIA landmarks</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Tag type="green" renderIcon={Checkmark}>Hardware Protocol</Tag>
                          <span className="body-01">ESC/POS Raw 9100 + Web Serial Barcode Scanner</span>
                        </div>
                      </Stack>
                    </Tile>
                  </Column>
                </Grid>

                <Tile>
                  <div className="heading-03" style={{ marginBottom: '0.5rem' }}>Design Token Reference & Live Theme Context</div>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1rem' }}>
                    All colors, borders, and layers adapt instantly using CSS custom properties declared in <code>@carbon/styles</code>:
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--cds-background)', border: '1px solid var(--cds-border-subtle)' }}>
                      <span className="label-01" style={{ color: 'var(--cds-text-secondary)' }}>--cds-background</span>
                      <div className="heading-01" style={{ marginTop: '0.25rem' }}>Background Layer</div>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--cds-layer-01)', border: '1px solid var(--cds-border-subtle)' }}>
                      <span className="label-01" style={{ color: 'var(--cds-text-secondary)' }}>--cds-layer-01</span>
                      <div className="heading-01" style={{ marginTop: '0.25rem' }}>Primary Card Layer</div>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--cds-layer-02)', border: '1px solid var(--cds-border-subtle)' }}>
                      <span className="label-01" style={{ color: 'var(--cds-text-secondary)' }}>--cds-layer-02</span>
                      <div className="heading-01" style={{ marginTop: '0.25rem' }}>Secondary Nested Layer</div>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--cds-interactive-01, #0f62fe)', color: '#ffffff' }}>
                      <span className="label-01" style={{ opacity: 0.8 }}>--cds-interactive-01</span>
                      <div className="heading-01" style={{ marginTop: '0.25rem' }}>Primary Interactive</div>
                    </div>
                  </div>
                </Tile>
              </Stack>
            </TabPanel>

            {/* 2. Common Actions Pattern */}
            <TabPanel style={{ padding: '1.5rem 0' }}>
              <Stack gap={6}>
                <Tile>
                  <div className="heading-03" style={{ marginBottom: '0.5rem' }}>Carbon Common Actions Pattern</div>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                    Actions in Carbon establish visual hierarchy using distinct button kinds. Destructive actions require clear visual differentiation and safeguards.
                  </p>

                  <div className="heading-02" style={{ marginBottom: '0.75rem' }}>Button Hierarchy & States</div>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2rem' }}>
                    <Button kind="primary" renderIcon={Save} iconDescription="Primary Action">Primary Action</Button>
                    <Button kind="secondary" renderIcon={Edit} iconDescription="Secondary Action">Secondary Action</Button>
                    <Button kind="tertiary" renderIcon={Renew} iconDescription="Tertiary Action">Tertiary Action</Button>
                    <Button kind="ghost" renderIcon={Copy} iconDescription="Ghost Action">Ghost Action</Button>
                    <Button kind="danger" renderIcon={TrashCan} iconDescription="Destructive Action" onClick={() => setIsDestructiveModalOpen(true)}>
                      Destructive Action
                    </Button>
                    <Button kind="primary" disabled>Disabled Action</Button>
                  </div>

                  <div className="heading-02" style={{ marginBottom: '0.75rem' }}>Batch & Multi-Action Sets</div>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1rem' }}>
                    Action sets in page headers, modal footers, and floating bars keep related operations clustered:
                  </p>
                  <ButtonSet>
                    <Button kind="secondary">Cancel Selection</Button>
                    <Button kind="primary" renderIcon={Checkmark} iconDescription="Save Batch (14 items)">Save Batch (14 items)</Button>
                  </ButtonSet>
                </Tile>

                <Tile style={{ backgroundColor: 'var(--cds-layer-02)' }}>
                  <div className="heading-03" style={{ marginBottom: '0.5rem' }}>Interactive Asynchronous Inline Loading</div>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1rem' }}>
                    Buttons and submit actions provide feedback during background processing:
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Button kind="primary" onClick={triggerAsyncAction} disabled={inlineLoadingStatus === 'active'}>
                      Simulate Cloud Sync
                    </Button>
                    {inlineLoadingStatus !== 'inactive' && (
                      <InlineLoading
                        status={inlineLoadingStatus}
                        description={
                          inlineLoadingStatus === 'active'
                            ? 'Syncing ledger with central ERP...'
                            : 'Sync completed successfully!'
                        }
                      />
                    )}
                  </div>
                </Tile>
              </Stack>
            </TabPanel>

            {/* 3. Dialogs & Modals Pattern */}
            <TabPanel style={{ padding: '1.5rem 0' }}>
              <Stack gap={6}>
                <Tile>
                  <div className="heading-03" style={{ marginBottom: '0.5rem' }}>Carbon Dialogs Pattern</div>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                    Dialogs interrupt the user’s workflow to communicate critical information or request necessary input. Carbon provides passive, transactional, and destructive variants.
                  </p>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Button kind="primary" onClick={() => setIsTransactionalModalOpen(true)}>
                      Trigger Transactional Modal
                    </Button>
                    <Button kind="secondary" onClick={() => setIsPassiveModalOpen(true)}>
                      Trigger Passive Informational Dialog
                    </Button>
                    <Button kind="danger" onClick={() => setIsDestructiveModalOpen(true)}>
                      Trigger Destructive Confirmation
                    </Button>
                  </div>
                </Tile>

                <Grid>
                  <Column lg={8} md={4} sm={4}>
                    <Tile style={{ height: '100%' }}>
                      <div className="heading-02" style={{ marginBottom: '0.5rem' }}>Transactional Modals</div>
                      <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                        Require user interaction before closing. They feature a primary action button and secondary cancel button, and support form inputs with keyboard Esc/Enter focus management.
                      </p>
                    </Tile>
                  </Column>
                  <Column lg={8} md={4} sm={4}>
                    <Tile style={{ height: '100%' }}>
                      <div className="heading-02" style={{ marginBottom: '0.5rem' }}>Destructive Confirmations</div>
                      <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                        Guard against irreversible data loss (e.g. purging transaction records, resetting terminal float). Feature a high-contrast danger button and explicit consequences.
                      </p>
                    </Tile>
                  </Column>
                </Grid>
              </Stack>
            </TabPanel>

            {/* 4. Empty States Pattern */}
            <TabPanel style={{ padding: '1.5rem 0' }}>
              <Stack gap={5}>
                <Tile>
                  <div className="heading-03" style={{ marginBottom: '0.5rem' }}>Carbon Empty States Pattern</div>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1rem' }}>
                    Empty states inform users that no content exists, explain why, and offer a clear path forward. Switch between standard Carbon Empty State archetypes below:
                  </p>

                  <ContentSwitcher
                    selectedIndex={
                      emptyStateVariant === 'no-data' ? 0 :
                      emptyStateVariant === 'not-found' ? 1 :
                      emptyStateVariant === 'error' ? 2 : 3
                    }
                    onChange={(e) => setEmptyStateVariant(String(e.name) as any)}
                  >
                    <Switch name="no-data" text="No Data (First Use)" />
                    <Switch name="not-found" text="Not Found (Zero Results)" />
                    <Switch name="error" text="System Error" />
                    <Switch name="unauthorized" text="Unauthorized (RBAC)" />
                  </ContentSwitcher>
                </Tile>

                <div style={{
                  padding: '3rem 1.5rem',
                  backgroundColor: 'var(--cds-layer-01)',
                  border: '1px solid var(--cds-border-subtle)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '400px'
                }}>
                  {emptyStateVariant === 'no-data' && (
                    <div style={{ textAlign: 'center', maxWidth: '440px' }}>
                      <DocumentUnknown size={48} style={{ color: 'var(--cds-icon-secondary)', marginBottom: '1rem' }} />
                      <h3 className="heading-03" style={{ marginBottom: '0.5rem' }}>No register sales records found</h3>
                      <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                        There are no active orders for the current register shift. Start by adding products to the cart.
                      </p>
                      <Button
                        kind="primary"
                        renderIcon={Add}
                        iconDescription="Open POS Register"
                        onClick={() => setActiveToast({ id: 'pos', title: 'POS Register Triggered', kind: 'info' })}
                      >
                        Open POS Register
                      </Button>
                    </div>
                  )}

                  {emptyStateVariant === 'not-found' && (
                    <div style={{ textAlign: 'center', maxWidth: '440px' }}>
                      <SearchIcon size={48} style={{ color: 'var(--cds-icon-secondary)', marginBottom: '1rem' }} />
                      <h3 className="heading-03" style={{ marginBottom: '0.5rem' }}>No products match your search</h3>
                      <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                        No items found matching "Cold Brew 32oz". Verify spelling or clear active category filters.
                      </p>
                      <Button
                        kind="tertiary"
                        onClick={() => setActiveToast({ id: 'clear', title: 'Filters Reset', kind: 'info' })}
                      >
                        Clear Search Filters
                      </Button>
                    </div>
                  )}

                  {emptyStateVariant === 'error' && (
                    <div style={{ textAlign: 'center', maxWidth: '440px' }}>
                      <WarningFilled size={48} style={{ color: 'var(--cds-support-error)', marginBottom: '1rem' }} />
                      <h3 className="heading-03" style={{ marginBottom: '0.5rem' }}>Fiscal Gateway Communication Error</h3>
                      <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                        Failed to communicate with the ZATCA Phase 2 clearance server. Verify local network connection or try again.
                      </p>
                      <Button
                        kind="primary"
                        onClick={() => setActiveToast({ id: 'retry', title: 'Reconnection Initiated', kind: 'info' })}
                      >
                        Retry Transmission
                      </Button>
                    </div>
                  )}

                  {emptyStateVariant === 'unauthorized' && (
                    <div style={{ textAlign: 'center', maxWidth: '440px' }}>
                      <Locked size={48} style={{ color: 'var(--cds-support-warning)', marginBottom: '1rem' }} />
                      <h3 className="heading-03" style={{ marginBottom: '0.5rem' }}>Supervisor Authorization Required</h3>
                      <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                        This action requires Shift Supervisor or Admin privileges. Scan supervisory RFID badge or authenticate with override PIN.
                      </p>
                      <Button
                        kind="primary"
                        onClick={() => setActiveToast({ id: 'auth', title: 'Supervisor Prompt Displayed', kind: 'info' })}
                      >
                        Authenticate Supervisor
                      </Button>
                    </div>
                  )}
                </div>
              </Stack>
            </TabPanel>

            {/* 5. Forms & Validation Pattern */}
            <TabPanel style={{ padding: '1.5rem 0' }}>
              <Stack gap={6}>
                <Tile>
                  <div className="heading-03" style={{ marginBottom: '0.5rem' }}>Carbon Forms & Validation Pattern</div>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                    Carbon forms emphasize accessible vertical rhythmic flow using <code>Stack</code>, clear label association, helper texts, and real-time inline validation feedback.
                  </p>

                  <Grid>
                    <Column lg={8} md={4} sm={4}>
                      <Stack gap={5}>
                        <TextInput
                          id="form-demo-name"
                          labelText="Terminal Hostname"
                          placeholder="e.g. POS-RIYADH-01"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          invalid={!formName.trim()}
                          invalidText="Hostname is required and cannot be blank."
                          helperText="Unique hardware identifier on local POS LAN"
                        />

                        <TextInput
                          id="form-demo-email"
                          labelText="Supervisor Email"
                          placeholder="name@company.com"
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          warn={!formEmail.includes('@')}
                          warnText="Ensure this is an enterprise-verified email address."
                          helperText="Receives end-of-day Z-Report audit summaries"
                        />

                        <NumberInput
                          id="form-demo-discount"
                          label="Max Cashier Manual Discount (%)"
                          value={formDiscount}
                          min={0}
                          max={50}
                          step={5}
                          onChange={(e, { value }) => setFormDiscount(Number(value) || 0)}
                          helperText="Discounts exceeding 20% require supervisory approval"
                        />

                        <TextArea
                          id="form-demo-notes"
                          labelText="Hardware Notes & Location Description"
                          placeholder="Ground floor counter #3 next to main entrance..."
                          value={formNotes}
                          onChange={(e) => setFormNotes(e.target.value)}
                          maxCount={200}
                          rows={3}
                        />

                        <div>
                          <Button
                            kind="primary"
                            renderIcon={Save}
                            iconDescription="Save Configuration"
                            disabled={!formName.trim()}
                            onClick={() => setActiveToast({ id: 'saved', title: 'Form validated & saved', kind: 'success' })}
                          >
                            Save Configuration
                          </Button>
                        </div>
                      </Stack>
                    </Column>

                    <Column lg={8} md={4} sm={4}>
                      <Tile style={{ backgroundColor: 'var(--cds-layer-02)', height: '100%' }}>
                        <div className="heading-02" style={{ marginBottom: '0.75rem' }}>Validation Principles</div>
                        <Stack gap={3}>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            <ErrorIcon size={18} style={{ color: 'var(--cds-support-error)', flexShrink: 0, marginTop: '2px' }} />
                            <div>
                              <strong>Invalid State (Error):</strong>
                              <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
                                Blocks submission. Error text clearly explains what went wrong and how the user can resolve it.
                              </p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            <Warning size={18} style={{ color: 'var(--cds-support-warning)', flexShrink: 0, marginTop: '2px' }} />
                            <div>
                              <strong>Warning State:</strong>
                              <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
                                Non-blocking notification alerting the user to potential risks or suboptimal configurations.
                              </p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            <Checkmark size={18} style={{ color: 'var(--cds-support-success)', flexShrink: 0, marginTop: '2px' }} />
                            <div>
                              <strong>Valid State:</strong>
                              <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
                                Field successfully matches validation criteria without distracting visual noise.
                              </p>
                            </div>
                          </div>
                        </Stack>
                      </Tile>
                    </Column>
                  </Grid>
                </Tile>
              </Stack>
            </TabPanel>

            {/* 6. Loading & Skeletons Pattern */}
            <TabPanel style={{ padding: '1.5rem 0' }}>
              <Stack gap={6}>
                <Tile>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <div className="heading-03">Carbon Loading & Skeleton States Pattern</div>
                      <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                        Skeleton states provide low-fidelity visual wireframes of content while data is loading asynchronously.
                      </p>
                    </div>
                    <Toggle
                      id="toggle-loading-state"
                      labelText="Simulate Loading State"
                      toggled={isLoadingActive}
                      onToggle={(checked) => setIsLoadingActive(checked)}
                    />
                  </div>

                  {isLoadingActive ? (
                    <Stack gap={4}>
                      <SkeletonText heading width="30%" />
                      <SkeletonText paragraph lineCount={3} />
                      <DataTableSkeleton columnCount={4} rowCount={3} />
                    </Stack>
                  ) : (
                    <Tile style={{ backgroundColor: 'var(--cds-layer-02)' }}>
                      <div className="heading-02" style={{ marginBottom: '0.5rem' }}>Loaded Data: Riyadh Terminal Inventory</div>
                      <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1rem' }}>
                        All 45 inventory SKUs synchronized and verified against central database.
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                        <Tile>
                          <span className="label-01" style={{ color: 'var(--cds-text-secondary)' }}>Active SKUs</span>
                          <div className="heading-04" style={{ marginTop: '0.25rem' }}>148 Products</div>
                        </Tile>
                        <Tile>
                          <span className="label-01" style={{ color: 'var(--cds-text-secondary)' }}>Sync Latency</span>
                          <div className="heading-04" style={{ marginTop: '0.25rem', color: 'var(--cds-support-success)' }}>18ms</div>
                        </Tile>
                        <Tile>
                          <span className="label-01" style={{ color: 'var(--cds-text-secondary)' }}>Database Status</span>
                          <div className="heading-04" style={{ marginTop: '0.25rem' }}>Clean (0 conflict)</div>
                        </Tile>
                      </div>
                    </Tile>
                  )}
                </Tile>
              </Stack>
            </TabPanel>

            {/* 7. Filtering & Search Pattern */}
            <TabPanel style={{ padding: '1.5rem 0' }}>
              <Stack gap={6}>
                <Tile>
                  <div className="heading-03" style={{ marginBottom: '0.5rem' }}>Carbon Filtering & Search Pattern</div>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                    Filtering allows users to narrow large datasets by multiple dimensions simultaneously. Active filters are visible and easily removable.
                  </p>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ flex: '1 1 300px' }}>
                      <Search
                        id="pattern-demo-search"
                        labelText="Search Inventory"
                        placeholder="Search items by keyword, barcode, or SKU..."
                        value={filterSearch}
                        onChange={(e) => setFilterSearch(e.target.value)}
                      />
                    </div>
                    <ContentSwitcher
                      selectedIndex={filterCategory === 'All' ? 0 : filterCategory === 'Coffee' ? 1 : 2}
                      onChange={(e) => setFilterCategory(String(e.name))}
                    >
                      <Switch name="All" text="All Categories" />
                      <Switch name="Coffee" text="Coffee" />
                      <Switch name="Pastries" text="Pastries" />
                    </ContentSwitcher>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="body-compact-01" style={{ fontWeight: 600 }}>Active Filters:</span>
                    {activeTags.map((tag) => (
                      <Tag
                        key={tag}
                        type="blue"
                        filter
                        onClose={() => setActiveTags(prev => prev.filter(t => t !== tag))}
                      >
                        {tag}
                      </Tag>
                    ))}
                    {activeTags.length === 0 && (
                      <span className="body-compact-01" style={{ color: 'var(--cds-text-secondary)' }}>No tag filters active.</span>
                    )}
                    {activeTags.length > 0 && (
                      <Button kind="ghost" size="sm" onClick={() => setActiveTags([])}>
                        Clear All Tags
                      </Button>
                    )}
                  </div>
                </Tile>
              </Stack>
            </TabPanel>

            {/* 8. Notifications Pattern */}
            <TabPanel style={{ padding: '1.5rem 0' }}>
              <Stack gap={6}>
                <Tile>
                  <div className="heading-03" style={{ marginBottom: '0.5rem' }}>Carbon Notifications Pattern</div>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                    Notifications communicate system status, task confirmations, or errors without completely blocking the user’s workflow.
                  </p>

                  <div className="heading-02" style={{ marginBottom: '1rem' }}>Inline Notifications (Low Contrast & High Contrast)</div>
                  <Stack gap={3} style={{ marginBottom: '2rem' }}>
                    <InlineNotification
                      kind="success"
                      title="Shift Reconciled"
                      subtitle="Cash drawer balanced with $0.00 variance."
                      lowContrast
                    />
                    <InlineNotification
                      kind="info"
                      title="Automatic Central Sync Active"
                      subtitle="Background transactions transmitted to central accounting."
                      lowContrast
                    />
                    <InlineNotification
                      kind="warning"
                      title="Thermal Paper Low"
                      subtitle="Receipt spooler at Riyadh Flagship register #1 has ~15 prints remaining."
                      lowContrast
                    />
                    <InlineNotification
                      kind="error"
                      title="Scanner Communication Timeout"
                      subtitle="Web Serial barcode scanner disconnected on COM3 port."
                      lowContrast
                    />
                  </Stack>

                  <div className="heading-02" style={{ marginBottom: '1rem' }}>Actionable Notification (With Undo/Retry Action)</div>
                  {!actionableUndone ? (
                    <ActionableNotification
                      kind="warning"
                      title="Line Item Removed"
                      subtitle='Product "Caramel Macchiato" removed from current customer cart.'
                      actionButtonLabel="Undo Action"
                      onActionButtonClick={() => setActionableUndone(true)}
                    />
                  ) : (
                    <InlineNotification
                      kind="success"
                      title="Action Reverted"
                      subtitle='Restored "Caramel Macchiato" to the order cart.'
                      lowContrast
                    />
                  )}

                  <div className="heading-02" style={{ marginTop: '2rem', marginBottom: '1rem' }}>Toast Notification Triggers</div>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Button kind="secondary" size="md" onClick={() => setActiveToast({ id: 't1', title: 'Payment Authorized', kind: 'success' })}>
                      Trigger Success Toast
                    </Button>
                    <Button kind="secondary" size="md" onClick={() => setActiveToast({ id: 't2', title: 'Network Lag Detected', kind: 'warning' })}>
                      Trigger Warning Toast
                    </Button>
                    <Button kind="secondary" size="md" onClick={() => setActiveToast({ id: 't3', title: 'Gateway Error', kind: 'error' })}>
                      Trigger Error Toast
                    </Button>
                  </div>
                </Tile>
              </Stack>
            </TabPanel>

            {/* 9. States & Indicators Pattern */}
            <TabPanel style={{ padding: '1.5rem 0' }}>
              <Stack gap={6}>
                <Tile>
                  <div className="heading-03" style={{ marginBottom: '0.5rem' }}>Carbon Status Indicators & Semantic Tags Pattern</div>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                    Status indicators communicate state and severity at a glance across enterprise tables, dashboards, and hardware panels.
                  </p>

                  <Grid>
                    <Column lg={8} md={4} sm={4}>
                      <div className="heading-02" style={{ marginBottom: '1rem' }}>Semantic Status Tags</div>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                        <Tag type="green">Operational / Online</Tag>
                        <Tag type="blue">Syncing / Info</Tag>
                        <Tag type="red">Critical / Error</Tag>
                        <Tag type="warm-gray">Idle / Offline</Tag>
                        <Tag type="purple">Certified ZATCA</Tag>
                        <Tag type="cyan">Draft Mode</Tag>
                        <Tag type="teal">Batch Closed</Tag>
                      </div>
                    </Column>

                    <Column lg={8} md={4} sm={4}>
                      <div className="heading-02" style={{ marginBottom: '1rem' }}>Disclosures & Accordion Pattern</div>
                      <Accordion>
                        <AccordionItem title="ESC/POS Thermal Spooler Configuration">
                          <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                            Supports Raw 9100 TCP sockets, Star Micronics raster mode, and 58mm/80mm dual printable widths with hardware paper-cut commands.
                          </p>
                        </AccordionItem>
                        <AccordionItem title="ZATCA Phase 2 Cryptographic Clearance">
                          <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                            Implements ECDSA secp256k1 signing, SHA-256 invoice hashing, and TLV-encoded QR tags compliant with KSA tax legislation.
                          </p>
                        </AccordionItem>
                      </Accordion>
                    </Column>
                  </Grid>

                  <div className="heading-02" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                    Expandable Tile Progressive Disclosure Pattern
                  </div>
                  <ExpandableTile id="pattern-expandable-tile">
                    <TileAboveTheFoldContent>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div className="heading-02">Hardware Peripheral Diagnostics</div>
                          <span className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>Click to reveal connected USB & Network devices</span>
                        </div>
                        <Tag type="green">3 Connected</Tag>
                      </div>
                    </TileAboveTheFoldContent>
                    <TileBelowTheFoldContent>
                      <Stack gap={2} style={{ marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Epson TM-T88VI Network Thermal Printer</span>
                          <Tag type="green">Port 9100 Ready</Tag>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Honeywell Voyager 1400g Barcode Scanner</span>
                          <Tag type="green">COM3 Serial Synced</Tag>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>MagTek Mini-MICR Cash Drawer Kickout</span>
                          <Tag type="green">RJ12 Connected</Tag>
                        </div>
                      </Stack>
                    </TileBelowTheFoldContent>
                  </ExpandableTile>
                </Tile>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      {/* Transactional Modal */}
      <Modal
        open={isTransactionalModalOpen}
        onRequestClose={() => setIsTransactionalModalOpen(false)}
        modalHeading="Configure Hardware Peripheral"
        modalLabel="Device Manager"
        primaryButtonText="Save Configuration"
        secondaryButtonText="Cancel"
        onRequestSubmit={() => {
          setIsTransactionalModalOpen(false);
          setActiveToast({ id: 'm-tx', title: 'Hardware settings applied', kind: 'success' });
        }}
      >
        <Stack gap={4} style={{ padding: '1rem 0' }}>
          <TextInput
            id="modal-device-name"
            labelText="Device Name"
            defaultValue="Epson Receipt Spooler #01"
          />
          <Select id="modal-baud" labelText="Baud Rate (Serial)" defaultValue="9600">
            <SelectItem value="9600" text="9600 bps" />
            <SelectItem value="19200" text="19200 bps" />
            <SelectItem value="115200" text="115200 bps" />
          </Select>
        </Stack>
      </Modal>

      {/* Passive Informational Modal */}
      <Modal
        open={isPassiveModalOpen}
        onRequestClose={() => setIsPassiveModalOpen(false)}
        passiveModal
        modalHeading="System Notification"
        modalLabel="Firmware Update"
      >
        <p className="body-01" style={{ color: 'var(--cds-text-secondary)', padding: '1rem 0' }}>
          New fiscal security certificates (ZATCA 2026-Q3) will be automatically downloaded during the next shift change. No user interruption required.
        </p>
      </Modal>

      {/* Destructive Confirmation Modal */}
      <Modal
        open={isDestructiveModalOpen}
        onRequestClose={() => setIsDestructiveModalOpen(false)}
        danger
        modalHeading="Reset Cash Drawer Float?"
        modalLabel="Warning: Irreversible Action"
        primaryButtonText="Yes, Reset Float"
        secondaryButtonText="Cancel"
        onRequestSubmit={() => {
          setIsDestructiveModalOpen(false);
          setActiveToast({ id: 'm-danger', title: 'Drawer float zeroed out', kind: 'error' });
        }}
      >
        <p className="body-01" style={{ color: 'var(--cds-text-secondary)', padding: '1rem 0' }}>
          This will wipe all pending unregistered cash transactions and reset the current shift opening balance to $0.00. This action is logged for financial audit.
        </p>
      </Modal>
    </>
  );
}
