import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Row,
  Column,
  Stack,
  Tile,
  Tag,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Toggle,
  CodeSnippet,
  InlineNotification,
  ContentSwitcher,
  Switch,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  RadioButtonGroup,
  RadioButton,
  Link
} from '@carbon/react';
import {
  Application as HeaderIcon,
  SidePanelClose,
  Switcher as SwitcherIcon,
  Grid as GridIcon,
  ArrowRight,
  ArrowLeft,
  Information,
  CheckmarkFilled,
  Code,
  Launch,
  AlignBoxTopLeft,
  TextAlignRight,
  TextAlignLeft,
  ViewMode_1,
  ColorPalette,
  ShoppingCart,
  Box,
  Document
} from '@carbon/icons-react';

export default function CarbonLayoutReflection() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  // Layout states for live inspection
  const [activeTab, setActiveTab] = useState(0);
  const [simulatedSideNavExpanded, setSimulatedSideNavExpanded] = useState(false);
  const [simulatedSideNavMode, setSimulatedSideNavMode] = useState<'rail' | 'persistent' | 'overlay'>('rail');
  const [simulatedRightPanelOpen, setSimulatedRightPanelOpen] = useState(false);
  const [gridGutterMode, setGridGutterMode] = useState<'default' | 'narrow' | 'condensed'>('default');
  const [selectedBreakpoint, setSelectedBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xlg'>('lg');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const isRTL = i18n.language === 'ar' || document.documentElement.dir === 'rtl';

  const toggleDirection = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const notifyCopy = (section: string) => {
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  // Sample data for Data Table grid reflection
  const sampleHeaders = [
    { key: 'component', header: 'Shell Component' },
    { key: 'role', header: 'Architectural Role' },
    { key: 'rtlBehavior', header: 'Bi-Directional Reflection (RTL)' },
    { key: 'status', header: 'Status' }
  ];

  const sampleRows = [
    {
      id: '1',
      component: 'HeaderContainer & Header',
      role: 'Top global region, state manager, platform title, and domain home',
      rtlBehavior: 'Brand title & hamburger mirror to right; global bar mirrors to left',
      status: 'Fully Compliant'
    },
    {
      id: '2',
      component: 'SideNav (Left Panel)',
      role: 'Local route navigation, hierarchical submenus, persistent rail',
      rtlBehavior: 'Anchors to inset-inline-start (screen right); collapses with +16rem translate',
      status: 'Fully Compliant'
    },
    {
      id: '3',
      component: 'HeaderPanel (Right Panel)',
      role: 'Global utility overlay for App Switcher and System Notifications',
      rtlBehavior: 'Slides in from inset-inline-end (screen left) with accessible focus trap',
      status: 'Fully Compliant'
    },
    {
      id: '4',
      component: '2x Grid (16 Columns)',
      role: 'Mathematical layout structure, fluid container boundaries',
      rtlBehavior: 'Columns flow start-to-end logically; subgrids align naturally',
      status: 'Fully Compliant'
    }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header Banner */}
      <div style={{
        padding: '2.5rem 2rem 2rem 2rem',
        backgroundColor: 'var(--cds-layer-01)',
        borderBottom: '1px solid var(--cds-border-subtle)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Tag type="blue">Carbon Design System</Tag>
              <Tag type="cool-gray">@carbon/react v1.x</Tag>
              <Tag type={isRTL ? 'purple' : 'teal'}>
                {isRTL ? 'RTL Layout Active (Arabic)' : 'LTR Layout Active (English)'}
              </Tag>
            </div>
            <h1 className="heading-05" style={{ marginBottom: '0.5rem' }}>
              UI Shell & Layout Reflection
            </h1>
            <p className="body-01" style={{ color: 'var(--cds-text-secondary)', maxWidth: '820px' }}>
              Architectural inspection and bi-directional layout reflection of the IBM Carbon UI Shell components:
              Global Header, Left Panel (Side Navigation), Right Panel (Header Panel Overlay), and 2x Grid system.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button
              kind="primary"
              renderIcon={isRTL ? TextAlignLeft : TextAlignRight}
              iconDescription={isRTL ? 'Reflect to LTR (English)' : 'Reflect to RTL (Arabic)'}
              onClick={toggleDirection}
            >
              {isRTL ? 'Reflect to LTR (English)' : 'Reflect to RTL (Arabic)'}
            </Button>
            <Button
              kind="tertiary"
              renderIcon={ShoppingCart}
              iconDescription="Back to POS"
              onClick={() => navigate('/pos')}
            >
              Back to POS
            </Button>
            <Button
              kind="ghost"
              renderIcon={Launch}
              iconDescription="Carbon GitHub"
              onClick={() => window.open('https://github.com/carbon-design-system/carbon', '_blank')}
            >
              Carbon GitHub
            </Button>
          </div>
        </div>
      </div>

      {copiedSection && (
        <InlineNotification
          kind="success"
          title="Pattern Copied"
          subtitle={`The ${copiedSection} specification snippet has been copied.`}
          style={{ marginBottom: '1.5rem' }}
        />
      )}

      {/* Main Tabs */}
      <Tabs selectedIndex={activeTab} onChange={({ selectedIndex }) => setActiveTab(selectedIndex)}>
        <TabList aria-label="Layout Reflection Sections" contained>
          <Tab renderIcon={HeaderIcon}>UI Shell Anatomy</Tab>
          <Tab renderIcon={SidePanelClose}>Left Panel (SideNav)</Tab>
          <Tab renderIcon={SwitcherIcon}>Right Panel (HeaderPanel)</Tab>
          <Tab renderIcon={GridIcon}>Carbon 2x Grid & Stack</Tab>
          <Tab renderIcon={isRTL ? ArrowLeft : ArrowRight}>Bi-Directional RTL Reflection</Tab>
          <Tab renderIcon={Code}>Implementation Code</Tab>
        </TabList>

        <TabPanels>
          {/* TAB 1: UI Shell Anatomy */}
          <TabPanel style={{ padding: '2rem 0' }}>
            <Stack gap={7}>
              {/* Architecture Overview Cards */}
              <Grid>
                <Column lg={5} md={8} sm={4}>
                  <Tile style={{ height: '100%', borderTop: '4px solid var(--cds-interactive-01, #0f62fe)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <HeaderIcon size={24} style={{ color: 'var(--cds-interactive-01, #0f62fe)' }} />
                      <h3 className="heading-03">1. Global Header</h3>
                    </div>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1rem' }}>
                      The topmost horizontal region of the application. Establishes product context, houses the domain home link, primary category navigation, and global system utilities.
                    </p>
                    <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--cds-text-primary)' }}>
                      <li><strong>HeaderContainer:</strong> Manages side panel expansion state.</li>
                      <li><strong>HeaderName:</strong> Links directly to domain home.</li>
                      <li><strong>SkipToContent:</strong> Accessible bypass link.</li>
                      <li><strong>HeaderGlobalBar:</strong> Holds utility actions (Spotlight, Theme, Switcher).</li>
                    </ul>
                  </Tile>
                </Column>

                <Column lg={5} md={8} sm={4}>
                  <Tile style={{ height: '100%', borderTop: '4px solid var(--cds-support-info, #4589ff)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <SidePanelClose size={24} style={{ color: 'var(--cds-support-info, #4589ff)' }} />
                      <h3 className="heading-03">2. Left Panel (SideNav)</h3>
                    </div>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1rem' }}>
                      Provides hierarchical local navigation across application workflows. Supports persistent rail icons, full expansion, and nested submenus.
                    </p>
                    <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--cds-text-primary)' }}>
                      <li><strong>Bound Content:</strong> Strictly finite items (no unbound user lists).</li>
                      <li><strong>Rail & Persistence:</strong> 3rem condensed rail or 16rem expanded.</li>
                      <li><strong>Active Routing:</strong> Dynamic <code>isActive</code> visual placement.</li>
                      <li><strong>Accessible Keyboard:</strong> Full ARIA tree navigation.</li>
                    </ul>
                  </Tile>
                </Column>

                <Column lg={6} md={8} sm={4}>
                  <Tile style={{ height: '100%', borderTop: '4px solid var(--cds-support-success, #24a148)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <SwitcherIcon size={24} style={{ color: 'var(--cds-support-success, #24a148)' }} />
                      <h3 className="heading-03">3. Right Panel (HeaderPanel)</h3>
                    </div>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1rem' }}>
                      A slide-out overlay for system-level utilities (App Switcher, Notifications, Theme Settings). Preserves user context without disturbing page tasks.
                    </p>
                    <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--cds-text-primary)' }}>
                      <li><strong>Toggle Icon:</strong> Tied to <code>HeaderGlobalAction</code>.</li>
                      <li><strong>Focus Management:</strong> Automatic accessibility focus trap.</li>
                      <li><strong>Scope Discipline:</strong> Strictly global tools, never local forms.</li>
                      <li><strong>Switcher & Divider:</strong> Rapid product switching.</li>
                    </ul>
                  </Tile>
                </Column>
              </Grid>

              {/* Interactive Live Shell Simulator */}
              <Tile>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--cds-border-subtle)' }}>
                  <div>
                    <h3 className="heading-03">Live UI Shell Reflection Simulator</h3>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                      Test how the 3 shell regions interact with state toggles, navigation items, and layout dimensions.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Toggle
                      id="toggle-sim-sidenav"
                      labelText="Expand SideNav"
                      toggled={simulatedSideNavExpanded}
                      onToggle={(val) => setSimulatedSideNavExpanded(val)}
                      size="sm"
                    />
                    <Toggle
                      id="toggle-sim-rightpanel"
                      labelText="Open Right Panel"
                      toggled={simulatedRightPanelOpen}
                      onToggle={(val) => setSimulatedRightPanelOpen(val)}
                      size="sm"
                    />
                  </div>
                </div>

                {/* Simulated Wireframe Frame */}
                <div style={{
                  border: '1px solid var(--cds-border-strong)',
                  backgroundColor: 'var(--cds-background)',
                  minHeight: '380px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* Simulated Header */}
                  <div style={{
                    height: '48px',
                    backgroundColor: 'var(--cds-layer-01)',
                    borderBottom: '1px solid var(--cds-border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 1rem',
                    zIndex: 10
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Button
                        kind="ghost"
                        hasIconOnly
                        iconDescription="Toggle Menu"
                        renderIcon={SidePanelClose}
                        size="sm"
                        onClick={() => setSimulatedSideNavExpanded(!simulatedSideNavExpanded)}
                      />
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        <strong style={{ color: 'var(--cds-interactive-01, #0f62fe)' }}>IBM</strong> Carbon POS
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem', marginInlineStart: '1rem' }}>
                        <Tag size="sm" type="blue">Point of Sale</Tag>
                        <Tag size="sm" type="cool-gray">Catalog</Tag>
                        <Tag size="sm" type="cool-gray">Accounting</Tag>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Tag size="sm" type="green">Online</Tag>
                      <Button
                        kind="ghost"
                        hasIconOnly
                        iconDescription="Toggle Switcher"
                        renderIcon={SwitcherIcon}
                        size="sm"
                        onClick={() => setSimulatedRightPanelOpen(!simulatedRightPanelOpen)}
                      />
                    </div>
                  </div>

                  {/* Simulated Body Container */}
                  <div style={{ display: 'flex', flexGrow: 1, position: 'relative', minHeight: '330px' }}>
                    {/* Simulated SideNav */}
                    <div style={{
                      width: simulatedSideNavExpanded ? '240px' : '48px',
                      backgroundColor: 'var(--cds-layer-01)',
                      borderInlineEnd: '1px solid var(--cds-border-subtle)',
                      transition: 'width 0.2s ease-in-out',
                      padding: '0.75rem 0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', backgroundColor: 'var(--cds-layer-selected-01, #e0e0e0)', borderRadius: '2px' }}>
                        <ShoppingCart size={20} style={{ flexShrink: 0, color: 'var(--cds-interactive-01)' }} />
                        {simulatedSideNavExpanded && <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>POS Register</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem' }}>
                        <Box size={20} style={{ flexShrink: 0 }} />
                        {simulatedSideNavExpanded && <span style={{ fontSize: '0.8125rem' }}>Products Catalog</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem' }}>
                        <Document size={20} style={{ flexShrink: 0 }} />
                        {simulatedSideNavExpanded && <span style={{ fontSize: '0.8125rem' }}>Fiscal Invoices</span>}
                      </div>
                    </div>

                    {/* Simulated Page Content */}
                    <div style={{ flexGrow: 1, padding: '1.5rem', backgroundColor: 'var(--cds-background)' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <h4 className="heading-02" style={{ marginBottom: '0.25rem' }}>Active Workspace Area</h4>
                        <p className="body-01" style={{ color: 'var(--cds-text-secondary)', fontSize: '0.8125rem' }}>
                          Fluid content region automatically adjusts <code>margin-inline-start</code> when SideNav rail expands or collapses.
                        </p>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        <Tile style={{ padding: '1rem' }}>
                          <span className="label-01" style={{ color: 'var(--cds-text-secondary)' }}>Daily Transactions</span>
                          <div className="heading-04" style={{ marginTop: '0.25rem' }}>248 Orders</div>
                        </Tile>
                        <Tile style={{ padding: '1rem' }}>
                          <span className="label-01" style={{ color: 'var(--cds-text-secondary)' }}>Shift Revenue</span>
                          <div className="heading-04" style={{ marginTop: '0.25rem' }}>$14,290.50</div>
                        </Tile>
                        <Tile style={{ padding: '1rem' }}>
                          <span className="label-01" style={{ color: 'var(--cds-text-secondary)' }}>ZATCA Clearance</span>
                          <div className="heading-04" style={{ marginTop: '0.25rem', color: 'var(--cds-support-success)' }}>100% Signed</div>
                        </Tile>
                      </div>
                    </div>

                    {/* Simulated Right Panel Overlay */}
                    {simulatedRightPanelOpen && (
                      <div style={{
                        position: 'absolute',
                        insetBlock: 0,
                        insetInlineEnd: 0,
                        width: '240px',
                        backgroundColor: 'var(--cds-layer-02)',
                        borderInlineStart: '1px solid var(--cds-border-subtle)',
                        boxShadow: '-4px 0 12px rgba(0,0,0,0.1)',
                        padding: '1.25rem 1rem',
                        zIndex: 20
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>App Switcher</span>
                          <Button
                            kind="ghost"
                            size="sm"
                            hasIconOnly
                            iconDescription="Close Panel"
                            renderIcon={SidePanelClose}
                            onClick={() => setSimulatedRightPanelOpen(false)}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <Tile style={{ padding: '0.75rem', cursor: 'pointer' }}>Retail Point of Sale</Tile>
                          <Tile style={{ padding: '0.75rem', cursor: 'pointer' }}>Momken CRM Suite</Tile>
                          <Tile style={{ padding: '0.75rem', cursor: 'pointer' }}>Kitchen Display (KDS)</Tile>
                          <Tile style={{ padding: '0.75rem', cursor: 'pointer' }}>Fiscal Accounting</Tile>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Tile>

              {/* Compliance Verification Table */}
              <div>
                <DataTable rows={sampleRows} headers={sampleHeaders}>
                  {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                    <TableContainer title="Carbon Shell Architectural Verification" description="Audit matrix confirming component compliance against official Carbon rules.">
                      <Table {...getTableProps()}>
                        <TableHead>
                          <TableRow>
                            {headers.map((header) => {
                              const { key, ...headerProps } = getHeaderProps({ header });
                              return (
                                <TableHeader key={key} {...headerProps}>
                                  {header.header}
                                </TableHeader>
                              );
                            })}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row) => {
                            const { key, ...rowProps } = getRowProps({ row });
                            return (
                              <TableRow key={key} {...rowProps}>
                                {row.cells.map((cell) => (
                                <TableCell key={cell.id}>
                                  {cell.info.header === 'status' ? (
                                    <Tag type="green" renderIcon={CheckmarkFilled}>
                                      {cell.value}
                                    </Tag>
                                  ) : (
                                    cell.value
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          );
                        })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </DataTable>
              </div>
            </Stack>
          </TabPanel>

          {/* TAB 2: Left Panel (SideNav) */}
          <TabPanel style={{ padding: '2rem 0' }}>
            <Stack gap={6}>
              <Grid>
                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <h3 className="heading-03" style={{ marginBottom: '1rem' }}>
                      Carbon UI Shell Left Panel Rules
                    </h3>
                    <Stack gap={4}>
                      <div>
                        <div className="heading-02" style={{ color: 'var(--cds-interactive-01)' }}>Rule 1: Bound Content Mandate</div>
                        <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
                          Never place unbound content (e.g., dynamic user-created records, long transaction logs) in the side navigation. Use page-level drill-downs or data tables for variable data.
                        </p>
                      </div>

                      <div>
                        <div className="heading-02" style={{ color: 'var(--cds-interactive-01)' }}>Rule 2: Persistence State Synchronization</div>
                        <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
                          The <code>expanded</code> prop of <code>SideNav</code> must be tied to the state provided by <code>HeaderContainer</code> via the hamburger button in the global header.
                        </p>
                      </div>

                      <div>
                        <div className="heading-02" style={{ color: 'var(--cds-interactive-01)' }}>Rule 3: Dynamic Active Route Indicator</div>
                        <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
                          Ensure the <code>isActive</code> prop on <code>SideNavLink</code> or <code>SideNavMenuItem</code> is dynamically calculated based on <code>location.pathname</code> to provide clear visual orientation.
                        </p>
                      </div>
                    </Stack>
                  </Tile>
                </Column>

                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 className="heading-03">Standard React Snippet</h3>
                      <Button
                        kind="ghost"
                        size="sm"
                        renderIcon={Code}
                        iconDescription="Copy Pattern"
                        onClick={() => notifyCopy('Left Panel')}
                      >
                        Copy Pattern
                      </Button>
                    </div>
                    <CodeSnippet type="multi">
{`import React from 'react';
import {
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
} from '@carbon/react';
import { ShoppingCart, Box, Tag } from '@carbon/icons-react';

export const UILeftPanel = ({ isSideNavExpanded, currentPath }) => (
  <SideNav
    aria-label="Side navigation"
    expanded={isSideNavExpanded}
    isRail // Rail condensation mode
  >
    <SideNavItems>
      <SideNavLink 
        renderIcon={ShoppingCart} 
        isActive={currentPath === '/pos'}
        href="#/pos"
      >
        Point of Sale
      </SideNavLink>
      <SideNavMenu renderIcon={Box} title="Inventory">
        <SideNavMenuItem 
          isActive={currentPath === '/products'} 
          href="#/products"
        >
          Product Catalog
        </SideNavMenuItem>
      </SideNavMenu>
    </SideNavItems>
  </SideNav>
);`}
                    </CodeSnippet>
                  </Tile>
                </Column>
              </Grid>
            </Stack>
          </TabPanel>

          {/* TAB 3: Right Panel (HeaderPanel) */}
          <TabPanel style={{ padding: '2rem 0' }}>
            <Stack gap={6}>
              <Grid>
                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <h3 className="heading-03" style={{ marginBottom: '1rem' }}>
                      Carbon UI Shell Right Panel Rules
                    </h3>
                    <Stack gap={4}>
                      <div>
                        <div className="heading-02" style={{ color: 'var(--cds-interactive-01)' }}>Rule 1: Strict Utility Toggling</div>
                        <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
                          The Right Panel's expansion state must be strictly controlled by a corresponding <code>HeaderGlobalAction</code> icon button inside <code>HeaderGlobalBar</code>.
                        </p>
                      </div>

                      <div>
                        <div className="heading-02" style={{ color: 'var(--cds-interactive-01)' }}>Rule 2: Accessibility Focus Trap</div>
                        <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
                          When the right panel slides open, focus must be automatically moved into the panel's context so screen reader and keyboard users navigate the items smoothly.
                        </p>
                      </div>

                      <div>
                        <div className="heading-02" style={{ color: 'var(--cds-interactive-01)' }}>Rule 3: Scope Discipline</div>
                        <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
                          The panel must strictly house global, system-level tasks (App Switcher, global notifications, themes). It should never be used for complex product-level forms or page records.
                        </p>
                      </div>
                    </Stack>
                  </Tile>
                </Column>

                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 className="heading-03">Standard React Snippet</h3>
                      <Button
                        kind="ghost"
                        size="sm"
                        renderIcon={Code}
                        iconDescription="Copy Pattern"
                        onClick={() => notifyCopy('Right Panel')}
                      >
                        Copy Pattern
                      </Button>
                    </div>
                    <CodeSnippet type="multi">
{`import React, { useState } from 'react';
import {
  Header,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderPanel,
  Switcher,
  SwitcherItem,
  SwitcherDivider,
} from '@carbon/react';
import { Switcher as SwitcherIcon } from '@carbon/icons-react';

export const UIRightPanel = () => {
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  return (
    <>
      <HeaderGlobalAction
        aria-label="App Switcher"
        tooltipAlignment="end"
        isActive={isPanelExpanded}
        onClick={() => setIsPanelExpanded(!isPanelExpanded)}
      >
        <SwitcherIcon size={20} />
      </HeaderGlobalAction>

      <HeaderPanel expanded={isPanelExpanded} aria-label="App Switcher Panel">
        <Switcher aria-label="App Switcher">
          <SwitcherItem aria-label="POS Register" href="#/pos">
            Retail Point of Sale
          </SwitcherItem>
          <SwitcherDivider />
          <SwitcherItem aria-label="Accounting" href="#/accounting">
            Fiscal Accounting
          </SwitcherItem>
        </Switcher>
      </HeaderPanel>
    </>
  );
};`}
                    </CodeSnippet>
                  </Tile>
                </Column>
              </Grid>
            </Stack>
          </TabPanel>

          {/* TAB 4: Carbon 2x Grid & Stack */}
          <TabPanel style={{ padding: '2rem 0' }}>
            <Stack gap={6}>
              <Tile>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 className="heading-03">Carbon 2x Grid System Visualizer</h3>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                      Carbon uses a mathematical 16-column grid with standardized gutter widths, fluid gutters, and subgrids.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span className="label-01">Gutter Mode:</span>
                    <ContentSwitcher
                      selectedIndex={gridGutterMode === 'default' ? 0 : gridGutterMode === 'narrow' ? 1 : 2}
                      onChange={({ name }) => setGridGutterMode(name as any)}
                    >
                      <Switch name="default" text="Default (32px)" />
                      <Switch name="narrow" text="Narrow (16px)" />
                      <Switch name="condensed" text="Condensed (1px)" />
                    </ContentSwitcher>
                  </div>
                </div>

                {/* 16-Column Visualizer */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div className="label-01" style={{ marginBottom: '0.5rem', color: 'var(--cds-text-secondary)' }}>
                    16-Column Unit Grid (lg breakpoint):
                  </div>
                  <Grid narrow={gridGutterMode === 'narrow'} condensed={gridGutterMode === 'condensed'}>
                    {Array.from({ length: 16 }).map((_, i) => (
                      <Column lg={1} md={1} sm={1} key={i}>
                        <div style={{
                          backgroundColor: 'var(--cds-layer-02)',
                          border: '1px solid var(--cds-border-subtle)',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.6875rem',
                          color: 'var(--cds-text-secondary)'
                        }}>
                          {i + 1}
                        </div>
                      </Column>
                    ))}
                  </Grid>
                </div>

                {/* Common POS Grid Spans */}
                <div>
                  <div className="label-01" style={{ marginBottom: '0.5rem', color: 'var(--cds-text-secondary)' }}>
                    Typical Application Spans:
                  </div>
                  <Grid narrow={gridGutterMode === 'narrow'} condensed={gridGutterMode === 'condensed'}>
                    <Column lg={11} md={5} sm={4}>
                      <Tile style={{ backgroundColor: 'var(--cds-layer-01)', minHeight: '60px', display: 'flex', alignItems: 'center' }}>
                        <div>
                          <strong>lg={11}</strong>: Product Catalog & Touch Register Grid
                        </div>
                      </Tile>
                    </Column>
                    <Column lg={5} md={3} sm={4}>
                      <Tile style={{ backgroundColor: 'var(--cds-layer-selected-01, #e0e0e0)', minHeight: '60px', display: 'flex', alignItems: 'center' }}>
                        <div>
                          <strong>lg={5}</strong>: Active Cart & Total Panel
                        </div>
                      </Tile>
                    </Column>
                  </Grid>
                </div>
              </Tile>

              {/* Stack Layout Primitive */}
              <Grid>
                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <h3 className="heading-03" style={{ marginBottom: '0.75rem' }}>The Carbon Stack Primitive</h3>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1rem' }}>
                      Carbon's <code>Stack</code> component injects consistent mathematical vertical or horizontal rhythm between sibling elements without manual CSS margin hacks.
                    </p>
                    <Stack gap={5}>
                      <div style={{ padding: '0.75rem', backgroundColor: 'var(--cds-layer-02)', borderLeft: '3px solid var(--cds-interactive-01)' }}>
                        <strong>Stack gap={4}</strong> (1rem / 16px): Standard form element vertical spacing.
                      </div>
                      <div style={{ padding: '0.75rem', backgroundColor: 'var(--cds-layer-02)', borderLeft: '3px solid var(--cds-support-info)' }}>
                        <strong>Stack gap={6}</strong> (1.5rem / 24px): Inter-section content gap.
                      </div>
                      <div style={{ padding: '0.75rem', backgroundColor: 'var(--cds-layer-02)', borderLeft: '3px solid var(--cds-support-success)' }}>
                        <strong>Stack gap={8}</strong> (2.5rem / 40px): Major page block separator.
                      </div>
                    </Stack>
                  </Tile>
                </Column>

                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <h3 className="heading-03" style={{ marginBottom: '0.75rem' }}>Carbon Breakpoint Matrix</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--cds-border-subtle)' }}>
                        <span><strong>sm</strong> (Small / Mobile)</span>
                        <span>0–671px (4 Columns)</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--cds-border-subtle)' }}>
                        <span><strong>md</strong> (Medium / Tablet)</span>
                        <span>672–1055px (8 Columns)</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--cds-border-subtle)' }}>
                        <span><strong>lg</strong> (Large / Desktop)</span>
                        <span>1056–1311px (16 Columns)</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--cds-border-subtle)' }}>
                        <span><strong>xlg</strong> (Extra Large)</span>
                        <span>1312–1583px (16 Columns)</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                        <span><strong>max</strong> (Maximum Canvas)</span>
                        <span>1584px+ (16 Columns)</span>
                      </div>
                    </div>
                  </Tile>
                </Column>
              </Grid>
            </Stack>
          </TabPanel>

          {/* TAB 5: Bi-Directional RTL Reflection */}
          <TabPanel style={{ padding: '2rem 0' }}>
            <Stack gap={6}>
              <Tile>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 className="heading-03">Bi-Directional RTL Layout Reflection</h3>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)', maxWidth: '750px' }}>
                      Carbon Design System v11 utilizes CSS logical properties (such as <code>inset-inline-start</code>, <code>margin-inline-start</code>, and <code>padding-inline-end</code>) to automatically reflect layouts when rendering Arabic (RTL) or English (LTR).
                    </p>
                  </div>
                  <Button
                    kind="primary"
                    renderIcon={isRTL ? TextAlignLeft : TextAlignRight}
                    iconDescription={isRTL ? 'Switch to LTR Mode' : 'Switch to RTL Mode'}
                    onClick={toggleDirection}
                  >
                    {isRTL ? 'Switch to LTR Mode (Left-to-Right)' : 'Switch to RTL Mode (Right-to-Left)'}
                  </Button>
                </div>

                <Grid>
                  <Column lg={8} md={4} sm={4}>
                    <Tile style={{ height: '100%', backgroundColor: 'var(--cds-layer-01)' }}>
                      <div className="heading-02" style={{ marginBottom: '0.75rem' }}>Logical Property Reflections:</div>
                      <Stack gap={3}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid var(--cds-border-subtle)', fontSize: '0.875rem' }}>
                          <code>inset-inline-start</code>
                          <span>LTR: <strong>left: 0</strong> → RTL: <strong>right: 0</strong></span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid var(--cds-border-subtle)', fontSize: '0.875rem' }}>
                          <code>margin-inline-start</code>
                          <span>LTR: <strong>margin-left</strong> → RTL: <strong>margin-right</strong></span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid var(--cds-border-subtle)', fontSize: '0.875rem' }}>
                          <code>border-inline-start</code>
                          <span>LTR: <strong>border-left</strong> → RTL: <strong>border-right</strong></span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', fontSize: '0.875rem' }}>
                          <code>SideNav Collapse</code>
                          <span>LTR: <strong>translateX(-16rem)</strong> → RTL: <strong>translateX(+16rem)</strong></span>
                        </div>
                      </Stack>
                    </Tile>
                  </Column>

                  <Column lg={8} md={4} sm={4}>
                    <Tile style={{ height: '100%', backgroundColor: 'var(--cds-layer-01)' }}>
                      <div className="heading-02" style={{ marginBottom: '0.75rem' }}>Current Reflection State:</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <div><strong>Active Locale:</strong> {i18n.language}</div>
                        <div><strong>Document Direction:</strong> {document.documentElement.dir || 'ltr'}</div>
                        <div><strong>Side Navigation Anchor:</strong> {isRTL ? 'Right edge (inset-inline-start)' : 'Left edge (inset-inline-start)'}</div>
                        <div><strong>Right Panel Anchor:</strong> {isRTL ? 'Left edge (inset-inline-end)' : 'Right edge (inset-inline-end)'}</div>
                        <div><strong>Primary Reading Axis:</strong> {isRTL ? 'Right to Left (RTL)' : 'Left to Right (LTR)'}</div>
                      </div>
                    </Tile>
                  </Column>
                </Grid>
              </Tile>
            </Stack>
          </TabPanel>

          {/* TAB 6: Implementation Code */}
          <TabPanel style={{ padding: '2rem 0' }}>
            <Stack gap={6}>
              <Tile>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h3 className="heading-03">Complete UI Shell Implementation Blueprint</h3>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                      Production-ready Carbon UI Shell code conforming strictly to all rules in AGENTS.md.
                    </p>
                  </div>
                  <Button
                    kind="tertiary"
                    renderIcon={Code}
                    iconDescription="Copy Entire Template"
                    onClick={() => notifyCopy('Complete UI Shell')}
                  >
                    Copy Entire Template
                  </Button>
                </div>
                <CodeSnippet type="multi">
{`import React, { useState } from 'react';
import {
  HeaderContainer,
  Header,
  SkipToContent,
  HeaderName,
  HeaderMenuButton,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderPanel,
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
  Switcher,
  SwitcherItem,
  SwitcherDivider,
  Content,
  Theme
} from '@carbon/react';
import { ShoppingCart, Switcher as SwitcherIcon, Box } from '@carbon/icons-react';

export default function AppShell() {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  return (
    <Theme theme="white">
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <>
            {/* 1. Global Header */}
            <Header aria-label="IBM Carbon Enterprise POS">
              <SkipToContent />
              <HeaderMenuButton
                aria-label={isSideNavExpanded ? 'Close menu' : 'Open menu'}
                onClick={onClickSideNavExpand}
                isActive={isSideNavExpanded}
              />
              <HeaderName href="#/pos" prefix="IBM">
                Carbon POS
              </HeaderName>
              
              <HeaderNavigation aria-label="Main Navigation">
                <HeaderMenuItem href="#/pos" isActive>POS Register</HeaderMenuItem>
                <HeaderMenuItem href="#/products">Products</HeaderMenuItem>
                <HeaderMenuItem href="#/reflection">Layout Reflection</HeaderMenuItem>
              </HeaderNavigation>

              <HeaderGlobalBar>
                <HeaderGlobalAction
                  aria-label="App Switcher"
                  tooltipAlignment="end"
                  isActive={isSwitcherOpen}
                  onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                >
                  <SwitcherIcon size={20} />
                </HeaderGlobalAction>
              </HeaderGlobalBar>

              {/* 3. Right Panel */}
              <HeaderPanel expanded={isSwitcherOpen} aria-label="App Switcher Panel">
                <Switcher aria-label="App Switcher">
                  <SwitcherItem href="#/pos">Retail POS</SwitcherItem>
                  <SwitcherDivider />
                  <SwitcherItem href="#/reflection">Layout Reflection</SwitcherItem>
                </Switcher>
              </HeaderPanel>
            </Header>

            {/* 2. Left Panel */}
            <SideNav aria-label="Side navigation" expanded={isSideNavExpanded} isRail>
              <SideNavItems>
                <SideNavLink renderIcon={ShoppingCart} href="#/pos" isActive>
                  Point of Sale
                </SideNavLink>
                <SideNavMenu renderIcon={Box} title="Catalog">
                  <SideNavMenuItem href="#/products">All Products</SideNavMenuItem>
                </SideNavMenu>
              </SideNavItems>
            </SideNav>

            {/* Page Content */}
            <Content>
              {/* Main workspace rendered here */}
            </Content>
          </>
        )}
      />
    </Theme>
  );
}`}
                </CodeSnippet>
              </Tile>
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
