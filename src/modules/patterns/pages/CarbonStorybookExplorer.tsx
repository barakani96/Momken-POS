import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CarbonLoginForm from '../../auth/components/CarbonLoginForm';
import CarbonNotificationCenter from '../../notifications/components/CarbonNotificationCenter';
import {
  // Navigation & Shell
  Breadcrumb,
  BreadcrumbItem,
  Pagination,
  PaginationNav,
  ContentSwitcher,
  Switch,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,

  // Layout & Structure
  Grid,
  Row,
  Column,
  Stack,
  Tile,
  ClickableTile,
  SelectableTile,
  ExpandableTile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
  RadioTile,
  TileGroup,
  Accordion,
  AccordionItem,
  AspectRatio,
  Layer,

  // Inputs & Controls
  Button,
  ButtonSet,
  TextInput,
  PasswordInput,
  NumberInput,
  TextArea,
  Select,
  SelectItem,
  SelectItemGroup,
  Dropdown,
  ComboBox,
  MultiSelect,
  FilterableMultiSelect,
  Checkbox,
  RadioButton,
  RadioButtonGroup,
  Toggle,
  Slider,
  Search,
  FileUploader,
  DatePicker,
  DatePickerInput,
  TimePicker,
  TimePickerSelect,

  // Data Display
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableToolbarMenu,
  TableToolbarAction,
  TableBatchActions,
  TableBatchAction,
  TableSelectAll,
  TableSelectRow,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
  TreeView,
  TreeNode,
  CodeSnippet,
  Tag,

  // Feedback & Overlays
  Modal,
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  InlineNotification,
  ToastNotification,
  ActionableNotification,
  Tooltip,
  Popover,
  PopoverContent,
  OverflowMenu,
  OverflowMenuItem,
  ProgressBar,
  ProgressIndicator,
  ProgressStep,
  InlineLoading,
  Loading,

  // Skeletons
  SkeletonText,
  SkeletonPlaceholder,
  SkeletonIcon,
  ButtonSkeleton,
  DataTableSkeleton,
  TabsSkeleton,

  // General
  Link
} from '@carbon/react';

import {
  Launch,
  Code,
  Copy,
  Checkmark,
  Warning,
  Information,
  TrashCan,
  Edit,
  Add,
  Save,
  Search as SearchIcon,
  Filter,
  Settings,
  ChevronRight,
  Folder,
  Document,
  Upload,
  Carbon,
  Catalog,
  User,
  Terminal,
  Renew,
  ArrowRight,
  UserAvatar
} from '@carbon/icons-react';

// Carbon Table Sample Data
const sampleTableHeaders = [
  { key: 'name', header: 'Component Name' },
  { key: 'category', header: 'Category' },
  { key: 'status', header: 'Status' },
  { key: 'accessibility', header: 'W3C A11y' },
  { key: 'version', header: 'Package' }
];

const sampleTableRows = [
  { id: '1', name: 'DataTable', category: 'Data Display', status: 'Stable', accessibility: 'AA Compliant', version: '@carbon/react@1.x' },
  { id: '2', name: 'Modal', category: 'Feedback & Overlay', status: 'Stable', accessibility: 'Focus Trap', version: '@carbon/react@1.x' },
  { id: '3', name: 'ComboBox', category: 'Inputs & Controls', status: 'Stable', accessibility: 'ARIA 1.2', version: '@carbon/react@1.x' },
  { id: '4', name: 'UI Shell Header', category: 'Navigation & Shell', status: 'Stable', accessibility: 'Landmarks', version: '@carbon/react@1.x' },
  { id: '5', name: 'ExpandableTile', category: 'Layout & Structure', status: 'Stable', accessibility: 'Keyboard Nav', version: '@carbon/react@1.x' }
];

const dropdownItems = [
  { id: 'opt-1', label: 'Option 1 - Enterprise Edition' },
  { id: 'opt-2', label: 'Option 2 - Cloud Foundry' },
  { id: 'opt-3', label: 'Option 3 - Red Hat OpenShift' },
  { id: 'opt-4', label: 'Option 4 - IBM Z Mainframe' }
];

export default function CarbonStorybookExplorer() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Interactive Component State
  const [textVal, setTextVal] = useState('IBM Cloud POS');
  const [numberVal, setNumberVal] = useState<number>(42);
  const [sliderVal, setSliderVal] = useState<number>(75);
  const [toggleVal, setToggleVal] = useState<boolean>(true);
  const [selectedRadio, setSelectedRadio] = useState<string>('radio-1');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isComposedModalOpen, setIsComposedModalOpen] = useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [selectedTile, setSelectedTile] = useState<boolean>(false);
  const [radioTileSelection, setRadioTileSelection] = useState<string>('plan-pro');
  const [activeProgressStep, setActiveProgressStep] = useState<number>(1);
  const [inlineLoadingStatus, setInlineLoadingStatus] = useState<'inactive' | 'active' | 'finished' | 'error'>('inactive');
  const [selectedTreeNodes, setSelectedTreeNodes] = useState<string[]>(['src']);
  const [contentSwitcherIdx, setContentSwitcherIdx] = useState<number>(0);
  const [tablePage, setTablePage] = useState<number>(1);
  const [tablePageSize, setTablePageSize] = useState<number>(5);
  const [toastActive, setToastActive] = useState<boolean>(false);

  const copyToClipboard = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const triggerLoading = () => {
    setInlineLoadingStatus('active');
    setTimeout(() => {
      setInlineLoadingStatus('finished');
      setTimeout(() => setInlineLoadingStatus('inactive'), 2000);
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cds-background)', color: 'var(--cds-text-primary)' }}>
      {/* Toast Notification Container */}
      {toastActive && (
        <div style={{ position: 'fixed', top: '4rem', right: '2rem', zIndex: 99999 }}>
          <ToastNotification
            kind="success"
            title="Carbon Storybook Catalog"
            subtitle="Component interactive state updated."
            caption={new Date().toLocaleTimeString()}
            timeout={3500}
            onClose={() => setToastActive(false)}
          />
        </div>
      )}

      {/* Global Explorer Header */}
      <div style={{
        padding: '2.5rem 2rem 2rem 2rem',
        backgroundColor: 'var(--cds-layer-01)',
        borderBottom: '1px solid var(--cds-border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Tag type="blue" size="md">@carbon/react v1.x</Tag>
            <Tag type="green" size="md">100% Storybook Live Catalog</Tag>
            <Tag type="cool-gray" size="md">88+ Exported Components</Tag>
          </div>
          <h1 className="heading-05" style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>
            IBM Carbon Design System — React Component Catalog
          </h1>
          <p className="body-01" style={{ color: 'var(--cds-text-secondary)', maxWidth: '850px', margin: 0 }}>
            Definitive interactive implementation of all Carbon components from{' '}
            <Link href="https://react.carbondesignsystem.com/" target="_blank" inline style={{ fontWeight: 600 }}>
              https://react.carbondesignsystem.com/ <Launch size={14} style={{ verticalAlign: 'middle' }} />
            </Link>
            . Test live props, inspect accessibility features, and copy production React JSX code snippets.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            renderIcon={Launch}
            iconDescription="Open Official Storybook"
            kind="primary"
            onClick={() => window.open('https://react.carbondesignsystem.com/', '_blank')}
          >
            Open Official Storybook
          </Button>
          <Button
            renderIcon={Carbon}
            iconDescription="Carbon Patterns Lab"
            kind="tertiary"
            onClick={() => navigate('/patterns')}
          >
            Carbon Patterns Lab
          </Button>
          <Button
            renderIcon={Terminal}
            iconDescription="Layout Reflection"
            kind="tertiary"
            onClick={() => navigate('/reflection')}
          >
            Layout Reflection
          </Button>
        </div>
      </div>

      {/* Filter & Category Toolbar */}
      <div style={{
        padding: '1.25rem 2rem',
        backgroundColor: 'var(--cds-layer-02)',
        borderBottom: '1px solid var(--cds-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="label-01" style={{ color: 'var(--cds-text-secondary)', marginRight: '0.5rem' }}>
            CATEGORY FILTER:
          </span>
          {[
            { id: 'all', label: 'All Components (88+)' },
            { id: 'inputs', label: '1. Inputs & Controls' },
            { id: 'data', label: '2. Data Display & Tables' },
            { id: 'feedback', label: '3. Feedback & Overlays' },
            { id: 'navigation', label: '4. Navigation & UI Shell' },
            { id: 'layout', label: '5. Layout, Structure & Tiles' },
            { id: 'skeletons', label: '6. Skeletons & Loading' },
            { id: 'login', label: '7. Core Building Block (Login Pattern)' },
            { id: 'notifications', label: '8. Core Building Block (Notifications Pattern)' }
          ].map((cat) => (
            <Button
              key={cat.id}
              size="sm"
              kind={activeCategory === cat.id ? 'primary' : 'ghost'}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        <div style={{ width: '320px' }}>
          <Search
            size="sm"
            labelText="Search Carbon Components"
            placeholder="Search e.g. DataTable, Modal, Slider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Catalog Body */}
      <div style={{ padding: '2rem' }}>
        <Stack gap={9}>

          {/* ========================================================================= */}
          {/* 1. INPUTS & CONTROLS SECTION */}
          {/* ========================================================================= */}
          {(activeCategory === 'all' || activeCategory === 'inputs') && (
            <div id="section-inputs" style={{ scrollMarginTop: '6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '2px solid var(--cds-border-subtle)', paddingBottom: '0.75rem' }}>
                <div>
                  <h2 className="heading-04" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Tag type="cyan">01</Tag> Inputs & Interactive Controls
                  </h2>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Standard, fluid, and specialized form controls with keyboard navigation, invalid/warn validation states, and helper messaging.
                  </p>
                </div>
                <Link href="https://react.carbondesignsystem.com/?path=/story/components-textinput--default" target="_blank">
                  Storybook Docs <Launch size={14} />
                </Link>
              </div>

              <Grid fullWidth style={{ rowGap: '2rem' }}>
                {/* TextInput & PasswordInput */}
                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="heading-02">TextInput & PasswordInput</span>
                      <Button
                        size="sm"
                        kind="ghost"
                        renderIcon={copiedCode === 'textinput' ? Checkmark : Copy}
                        iconDescription={copiedCode === 'textinput' ? 'Copied' : 'Copy JSX'}
                        onClick={() => copyToClipboard(`<TextInput id="txt" labelText="Label" helperText="Help" />\n<PasswordInput id="pwd" labelText="Secret" />`, 'textinput')}
                      >
                        {copiedCode === 'textinput' ? 'Copied' : 'Copy JSX'}
                      </Button>
                    </div>
                    <Stack gap={5}>
                      <TextInput
                        id="sb-text-input"
                        labelText="Store / Branch Identifier"
                        placeholder="e.g. Flagship Store Terminal #01"
                        helperText="Used for hardware receipt dispatch and register allocation."
                        value={textVal}
                        onChange={(e) => setTextVal(e.target.value)}
                      />
                      <PasswordInput
                        id="sb-password-input"
                        labelText="Supervisor Override PIN"
                        placeholder="••••••••"
                        helperText="Required for void transactions & manual discount overrides."
                      />
                      <TextInput
                        id="sb-invalid-text-input"
                        labelText="Tax Registry ID (Validation Error State)"
                        defaultValue="INVALID-TAX-FORMAT"
                        invalid
                        invalidText="Tax code must match standard format: EGY-TAX-9999."
                      />
                    </Stack>
                  </Tile>
                </Column>

                {/* NumberInput & Slider */}
                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="heading-02">NumberInput & Slider</span>
                      <Button
                        size="sm"
                        kind="ghost"
                        renderIcon={copiedCode === 'slider' ? Checkmark : Copy}
                        iconDescription={copiedCode === 'slider' ? 'Copied' : 'Copy JSX'}
                        onClick={() => copyToClipboard(`<NumberInput id="num" min={0} max={100} value={${numberVal}} />\n<Slider min={0} max={100} value={${sliderVal}} />`, 'slider')}
                      >
                        {copiedCode === 'slider' ? 'Copied' : 'Copy JSX'}
                      </Button>
                    </div>
                    <Stack gap={5}>
                      <NumberInput
                        id="sb-number-input"
                        label="Stock Reorder Threshold"
                        helperText="Minimum units before automated supplier purchase order triggers."
                        min={0}
                        max={500}
                        step={5}
                        value={numberVal}
                        onChange={(_e, { value }) => setNumberVal(typeof value === 'number' ? value : Number(value) || 0)}
                      />
                      <div>
                        <Slider
                          id="sb-slider"
                          labelText={`Promotional Discount Cap: ${sliderVal}%`}
                          min={0}
                          max={100}
                          step={5}
                          value={sliderVal}
                          onChange={({ value }) => setSliderVal(value)}
                        />
                      </div>
                      <TextArea
                        id="sb-text-area"
                        labelText="Fiscal Order Notes"
                        placeholder="Enter cashier audit remarks..."
                        rows={2}
                        maxCount={200}
                        enableCounter
                      />
                    </Stack>
                  </Tile>
                </Column>

                {/* Dropdown, ComboBox & MultiSelect */}
                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="heading-02">Dropdown, ComboBox & MultiSelect</span>
                      <Button
                        size="sm"
                        kind="ghost"
                        renderIcon={copiedCode === 'selects' ? Checkmark : Copy}
                        iconDescription={copiedCode === 'selects' ? 'Copied' : 'Copy JSX'}
                        onClick={() => copyToClipboard(`<Dropdown id="dd" items={items} label="Choose" />\n<ComboBox id="cb" items={items} />\n<MultiSelect id="ms" items={items} />`, 'selects')}
                      >
                        {copiedCode === 'selects' ? 'Copied' : 'Copy JSX'}
                      </Button>
                    </div>
                    <Stack gap={5}>
                      <Dropdown
                        id="sb-dropdown"
                        titleText="Active Cloud Architecture"
                        label="Select cloud platform"
                        items={dropdownItems}
                        itemToString={(item) => (item ? item.label : '')}
                        initialSelectedItem={dropdownItems[0]}
                      />
                      <ComboBox
                        id="sb-combobox"
                        titleText="Searchable Fiscal Jurisdiction (ComboBox)"
                        placeholder="Type to search e.g. OpenShift, Enterprise..."
                        items={dropdownItems}
                        itemToString={(item) => (item ? item.label : '')}
                        onChange={() => {}}
                      />
                      <MultiSelect
                        id="sb-multiselect"
                        titleText="Granted Cashier Permissions (MultiSelect)"
                        label="Select permission roles"
                        items={dropdownItems}
                        itemToString={(item) => (item ? item.label : '')}
                        initialSelectedItems={[dropdownItems[0], dropdownItems[1]]}
                      />
                    </Stack>
                  </Tile>
                </Column>

                {/* Checkbox, RadioButtonGroup, Toggle, DatePicker */}
                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="heading-02">Checkbox, Radio, Toggle & DatePicker</span>
                      <Button
                        size="sm"
                        kind="ghost"
                        renderIcon={copiedCode === 'toggles' ? Checkmark : Copy}
                        iconDescription={copiedCode === 'toggles' ? 'Copied' : 'Copy JSX'}
                        onClick={() => copyToClipboard(`<Toggle id="tg" labelText="Status" defaultToggled />\n<RadioButtonGroup name="grp" defaultSelected="opt1">\n  <RadioButton value="opt1" labelText="A" />\n</RadioButtonGroup>`, 'toggles')}
                      >
                        {copiedCode === 'toggles' ? 'Copied' : 'Copy JSX'}
                      </Button>
                    </div>
                    <Stack gap={5}>
                      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div>
                          <span className="label-01" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--cds-text-secondary)' }}>
                            HARDWARE TOGGLES
                          </span>
                          <Toggle
                            id="sb-toggle-hw"
                            labelText="ESC/POS Thermal Printer Online"
                            labelA="Offline"
                            labelB="Connected"
                            toggled={toggleVal}
                            onToggle={(checked) => setToggleVal(checked)}
                          />
                        </div>
                        <div>
                          <span className="label-01" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--cds-text-secondary)' }}>
                            RECEIPT OPTIONS
                          </span>
                          <Checkbox id="sb-chk-1" labelText="Print QR Invoice" defaultChecked />
                          <Checkbox id="sb-chk-2" labelText="SMS e-Receipt" />
                        </div>
                      </div>

                      <RadioButtonGroup
                        name="sb-payment-mode"
                        legendText="Default Settlement Gateway"
                        valueSelected={selectedRadio}
                        onChange={(val) => setSelectedRadio(String(val))}
                      >
                        <RadioButton id="radio-1" value="radio-1" labelText="Credit / Debit Card (Momken NFC)" />
                        <RadioButton id="radio-2" value="radio-2" labelText="Cash Drawer Automated Drop" />
                        <RadioButton id="radio-3" value="radio-3" labelText="InstaPay Digital Wallet" />
                      </RadioButtonGroup>

                      <DatePicker datePickerType="single">
                        <DatePickerInput
                          id="sb-datepicker"
                          placeholder="mm/dd/yyyy"
                          labelText="Fiscal Accounting Settlement Date"
                          size="md"
                        />
                      </DatePicker>
                    </Stack>
                  </Tile>
                </Column>
              </Grid>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. DATA DISPLAY & TABLES SECTION */}
          {/* ========================================================================= */}
          {(activeCategory === 'all' || activeCategory === 'data') && (
            <div id="section-data" style={{ scrollMarginTop: '6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '2px solid var(--cds-border-subtle)', paddingBottom: '0.75rem' }}>
                <div>
                  <h2 className="heading-04" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Tag type="blue">02</Tag> Data Display, Tables & Hierarchies
                  </h2>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Carbon DataTable with Batch Actions, Sorting, Search, Toolbar Menus with OverflowMenuItems, Structured Lists, and TreeViews.
                  </p>
                </div>
                <Link href="https://react.carbondesignsystem.com/?path=/story/components-datatable-toolbar--with-overflow-menu" target="_blank">
                  Storybook: Toolbar (With Overflow Menu) <Launch size={14} />
                </Link>
              </div>

              <Grid fullWidth style={{ rowGap: '2rem' }}>
                {/* Full Featured DataTable with Toolbar & Overflow Menu */}
                <Column lg={16} md={8} sm={4}>
                  <Tile>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="heading-03">DataTable Toolbar (With Overflow Menu)</span>
                        <Tag type="purple">Storybook Pattern</Tag>
                      </div>
                      <Button
                        size="sm"
                        kind="ghost"
                        renderIcon={copiedCode === 'datatable' ? Checkmark : Copy}
                        iconDescription={copiedCode === 'datatable' ? 'Copied' : 'Copy JSX'}
                        onClick={() => copyToClipboard(`<TableToolbar>\n  <TableToolbarContent>\n    <TableToolbarSearch onChange={onInputChange} />\n    <TableToolbarMenu iconDescription="Settings & Overflow Menu">\n      <OverflowMenuItem itemText="Option 1" />\n      <OverflowMenuItem itemText="Option 2" />\n      <OverflowMenuItem itemText="Option 3" />\n    </TableToolbarMenu>\n    <TableToolbarAction renderIcon={Filter} iconDescription="Filter" />\n    <Button kind="primary" size="sm">Add item</Button>\n  </TableToolbarContent>\n</TableToolbar>`, 'datatable')}
                      >
                        {copiedCode === 'datatable' ? 'Copied' : 'Copy JSX'}
                      </Button>
                    </div>

                    <DataTable rows={sampleTableRows} headers={sampleTableHeaders} isSortable>
                      {({
                        rows,
                        headers,
                        getHeaderProps,
                        getRowProps,
                        getTableProps,
                        getTableContainerProps,
                        getBatchActionProps,
                        getSelectionProps,
                        onInputChange
                      }) => {
                        const batchActionProps = getBatchActionProps();
                        return (
                          <TableContainer
                            title="IBM Carbon Component Registry"
                            description="Live DataTable featuring TableToolbar, TableToolbarMenu with OverflowMenuItem children, and Batch Actions."
                            {...getTableContainerProps()}
                          >
                            <TableToolbar>
                              <TableBatchActions {...batchActionProps}>
                                <TableBatchAction
                                  renderIcon={TrashCan}
                                  onClick={() => alert(`Deleting selected components`)}
                                >
                                  Delete
                                </TableBatchAction>
                                <TableBatchAction
                                  renderIcon={Save}
                                  onClick={() => alert(`Exporting selected components`)}
                                >
                                  Export
                                </TableBatchAction>
                              </TableBatchActions>
                              <TableToolbarContent>
                                <TableToolbarSearch onChange={onInputChange} placeholder="Search components..." persistent />
                                <TableToolbarMenu iconDescription="Settings & Overflow Menu">
                                  <OverflowMenuItem
                                    itemText="Option 1"
                                    onClick={() => alert('OverflowMenuItem Option 1 selected')}
                                  />
                                  <OverflowMenuItem
                                    itemText="Option 2"
                                    onClick={() => alert('OverflowMenuItem Option 2 selected')}
                                  />
                                  <OverflowMenuItem
                                    itemText="Option 3"
                                    onClick={() => alert('OverflowMenuItem Option 3 selected')}
                                  />
                                  <OverflowMenuItem
                                    itemText="Export Full Registry"
                                    onClick={() => alert('Exporting full registry dataset...')}
                                  />
                                </TableToolbarMenu>
                                <TableToolbarAction
                                  aria-label="Filter Table Data"
                                  title="Filter Table Data"
                                  onClick={() => alert('Filter Toolbar Action clicked')}
                                >
                                  <Filter size={16} />
                                </TableToolbarAction>
                                <TableToolbarAction
                                  aria-label="Table Column Settings"
                                  title="Table Column Settings"
                                  onClick={() => alert('Settings Toolbar Action clicked')}
                                >
                                  <Settings size={16} />
                                </TableToolbarAction>
                                <Button
                                  renderIcon={Add}
                                  iconDescription="Register Component"
                                  size="sm"
                                  kind="primary"
                                  onClick={() => setToastActive(true)}
                                >
                                  Register Component
                                </Button>
                              </TableToolbarContent>
                            </TableToolbar>

                            <Table {...getTableProps()} aria-label="Carbon Component Table">
                              <TableHead>
                                <TableRow>
                                  <TableSelectAll {...getSelectionProps()} />
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
                                      <TableSelectRow {...getSelectionProps({ row })} />
                                      {row.cells.map((cell) => {
                                        if (cell.info.header === 'status') {
                                          return (
                                            <TableCell key={cell.id}>
                                              <Tag type="green" size="sm">{cell.value}</Tag>
                                            </TableCell>
                                          );
                                        }
                                        if (cell.info.header === 'accessibility') {
                                          return (
                                            <TableCell key={cell.id}>
                                              <Tag type="blue" size="sm">{cell.value}</Tag>
                                            </TableCell>
                                          );
                                        }
                                        return <TableCell key={cell.id}>{cell.value}</TableCell>;
                                      })}
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>

                            <Pagination
                              backwardText="Previous page"
                              forwardText="Next page"
                              itemsPerPageText="Items per page:"
                              page={tablePage}
                              pageSize={tablePageSize}
                              pageSizes={[5, 10, 20]}
                              totalItems={sampleTableRows.length}
                              onChange={({ page, pageSize }) => {
                                setTablePage(page);
                                setTablePageSize(pageSize);
                              }}
                            />
                          </TableContainer>
                        );
                      }}
                    </DataTable>
                  </Tile>
                </Column>

                {/* StructuredList & TreeView */}
                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="heading-02">StructuredList</span>
                      <Tag type="cool-gray">Compact Data View</Tag>
                    </div>
                    <StructuredListWrapper selection aria-label="Structured list example">
                      <StructuredListHead>
                        <StructuredListRow head>
                          <StructuredListCell head>Service Module</StructuredListCell>
                          <StructuredListCell head>Latency</StructuredListCell>
                          <StructuredListCell head>Deployment</StructuredListCell>
                        </StructuredListRow>
                      </StructuredListHead>
                      <StructuredListBody>
                        <StructuredListRow>
                          <StructuredListCell>Fiscal Accounting Ledger</StructuredListCell>
                          <StructuredListCell>14ms</StructuredListCell>
                          <StructuredListCell><Tag type="teal" size="sm">Active v2.4</Tag></StructuredListCell>
                        </StructuredListRow>
                        <StructuredListRow>
                          <StructuredListCell>Thermal Receipt Dispatcher</StructuredListCell>
                          <StructuredListCell>3ms</StructuredListCell>
                          <StructuredListCell><Tag type="green" size="sm">Local Hardware</Tag></StructuredListCell>
                        </StructuredListRow>
                        <StructuredListRow>
                          <StructuredListCell>Inventory RFID Sync</StructuredListCell>
                          <StructuredListCell>45ms</StructuredListCell>
                          <StructuredListCell><Tag type="purple" size="sm">MQTT Broker</Tag></StructuredListCell>
                        </StructuredListRow>
                      </StructuredListBody>
                    </StructuredListWrapper>
                  </Tile>
                </Column>

                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="heading-02">TreeView (Hierarchical Architecture)</span>
                      <Tag type="purple">Carbon Tree v1.x</Tag>
                    </div>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1rem' }}>
                      Accessible hierarchical file and folder navigation with keyboard expanding.
                    </p>
                    <div style={{ backgroundColor: 'var(--cds-layer-01)', padding: '0.75rem', borderRadius: '4px' }}>
                      <TreeView
                        label="Carbon Monorepo Structure"
                        selected={selectedTreeNodes}
                        onSelect={(_e, node) => setSelectedTreeNodes([node.id])}
                      >
                        <TreeNode id="src" label="src" renderIcon={Folder} isExpanded>
                          <TreeNode id="app" label="app" renderIcon={Folder} isExpanded>
                            <TreeNode id="App.tsx" label="App.tsx" renderIcon={Document} />
                            <TreeNode id="Layout.tsx" label="Layout.tsx" renderIcon={Document} />
                          </TreeNode>
                          <TreeNode id="modules" label="modules" renderIcon={Folder} isExpanded>
                            <TreeNode id="pos" label="pos (Point of Sale)" renderIcon={Folder} />
                            <TreeNode id="patterns" label="patterns (Design System)" renderIcon={Folder} />
                            <TreeNode id="accounting" label="accounting" renderIcon={Folder} />
                          </TreeNode>
                          <TreeNode id="main.tsx" label="main.tsx" renderIcon={Document} />
                        </TreeNode>
                      </TreeView>
                    </div>
                  </Tile>
                </Column>

                {/* CodeSnippet & All Carbon Tag Variants */}
                <Column lg={16} md={8} sm={4}>
                  <Tile>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="heading-02">CodeSnippet & Complete Tag Color Spectrum</span>
                      <Tag type="high-contrast">11 Carbon Tag Types</Tag>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                      <Tag type="red">red</Tag>
                      <Tag type="magenta">magenta</Tag>
                      <Tag type="purple">purple</Tag>
                      <Tag type="blue">blue</Tag>
                      <Tag type="cyan">cyan</Tag>
                      <Tag type="teal">teal</Tag>
                      <Tag type="green">green</Tag>
                      <Tag type="cool-gray">cool-gray</Tag>
                      <Tag type="warm-gray">warm-gray</Tag>
                      <Tag type="high-contrast">high-contrast</Tag>
                      <Tag type="outline">outline</Tag>
                    </div>

                    <CodeSnippet type="multi" feedback="Copied to clipboard">
{`import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react';

export const ProductTable = ({ rows, headers }) => (
  <DataTable rows={rows} headers={headers} isSortable>
    {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
      <Table {...getTableProps()}>
        <TableHead>
          <TableRow>
            {headers.map(h => <TableHeader key={h.key} {...getHeaderProps({ header: h })}>{h.header}</TableHeader>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(r => <TableRow key={r.id} {...getRowProps({ row: r })}>{r.cells.map(c => <TableCell key={c.id}>{c.value}</TableCell>)}</TableRow>)}
        </TableBody>
      </Table>
    )}
  </DataTable>
);`}
                    </CodeSnippet>
                  </Tile>
                </Column>
              </Grid>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. FEEDBACK, STATUS & OVERLAYS SECTION */}
          {/* ========================================================================= */}
          {(activeCategory === 'all' || activeCategory === 'feedback') && (
            <div id="section-feedback" style={{ scrollMarginTop: '6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '2px solid var(--cds-border-subtle)', paddingBottom: '0.75rem' }}>
                <div>
                  <h2 className="heading-04" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Tag type="magenta">03</Tag> Feedback, Modals & Status Overlays
                  </h2>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Transactional & Composed Modals, Notifications (Inline, Toast, Actionable), Progress Indicators, Tooltips, Popovers, and Loaders.
                  </p>
                </div>
                <Link href="https://react.carbondesignsystem.com/?path=/story/components-modal--default" target="_blank">
                  Storybook Docs <Launch size={14} />
                </Link>
              </div>

              <Grid fullWidth style={{ rowGap: '2rem' }}>
                {/* Modals & Overlays Trigger */}
                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="heading-02">Modals (Passive & Composed)</span>
                      <Tag type="red">Accessibility Focus Trapped</Tag>
                    </div>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                      Test live Carbon modals with keyboard ESC dismissal, focus management, and danger action buttons.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <Button kind="danger" renderIcon={TrashCan} iconDescription="Open Destructive Modal" onClick={() => setIsModalOpen(true)}>
                        Open Destructive Modal
                      </Button>
                      <Button kind="primary" renderIcon={Edit} iconDescription="Open Composed Modal" onClick={() => setIsComposedModalOpen(true)}>
                        Open Composed Modal
                      </Button>
                    </div>

                    {/* Passive / Destructive Modal */}
                    <Modal
                      open={isModalOpen}
                      modalHeading="Confirm Fiscal Database Reset?"
                      modalLabel="Destructive System Operation"
                      primaryButtonText="Permanently Erase"
                      secondaryButtonText="Cancel"
                      danger
                      onRequestClose={() => setIsModalOpen(false)}
                      onRequestSubmit={() => {
                        setIsModalOpen(false);
                        setToastActive(true);
                      }}
                    >
                      <p className="body-01">
                        This will permanently purge all local SQLite offline transactions and hardware buffer queues. This action conforms to IBM Carbon destructive modal specifications.
                      </p>
                    </Modal>

                    {/* Composed Modal */}
                    <ComposedModal
                      open={isComposedModalOpen}
                      onClose={() => setIsComposedModalOpen(false)}
                    >
                      <ModalHeader title="Configure ESC/POS Thermal Dispatch" label="Hardware Peripherals" />
                      <ModalBody>
                        <Stack gap={5}>
                          <TextInput id="cm-ip" labelText="Network IP Address" defaultValue="192.168.1.150" />
                          <NumberInput id="cm-port" label="Port" defaultValue={9100} min={1024} max={65535} />
                          <Checkbox id="cm-auto" labelText="Enable Automatic Heartbeat Ping" defaultChecked />
                        </Stack>
                      </ModalBody>
                      <ModalFooter>
                        <Button kind="secondary" onClick={() => setIsComposedModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button kind="primary" onClick={() => setIsComposedModalOpen(false)}>
                          Save Configuration
                        </Button>
                      </ModalFooter>
                    </ComposedModal>
                  </Tile>
                </Column>

                {/* Notifications Array */}
                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="heading-02">Inline & Actionable Notifications</span>
                      <Button size="sm" kind="ghost" onClick={() => setToastActive(true)}>
                        Trigger Toast
                      </Button>
                    </div>
                    <Stack gap={4}>
                      <InlineNotification
                        kind="success"
                        title="Success:"
                        subtitle="Hardware barcode scanner connected via WebHID interface."
                        lowContrast
                      />
                      <InlineNotification
                        kind="warning"
                        title="Warning:"
                        subtitle="Fiscal tax buffer is currently operating in offline caching mode."
                        lowContrast
                      />
                      <InlineNotification
                        kind="error"
                        title="Connection Error:"
                        subtitle="Cash drawer relay pulse timed out. Check 24V RJ11 connector."
                        lowContrast
                      />
                      <ActionableNotification
                        title="Batch Export Completed"
                        subtitle="1,420 customer records ready for download."
                        actionButtonLabel="Download CSV"
                        onActionButtonClick={() => alert('Downloading CSV...')}
                        lowContrast
                      />
                    </Stack>
                  </Tile>
                </Column>

                {/* Progress Indicators, Tooltips & Popovers */}
                <Column lg={16} md={8} sm={4}>
                  <Tile>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="heading-02">ProgressIndicator, Popover & InlineLoading</span>
                      <Button size="sm" kind="tertiary" renderIcon={Renew} iconDescription="Trigger Inline Loading" onClick={triggerLoading}>
                        Trigger Inline Loading
                      </Button>
                    </div>

                    <Grid fullWidth style={{ rowGap: '1.5rem' }}>
                      <Column lg={8} md={8} sm={4}>
                        <span className="label-01" style={{ display: 'block', marginBottom: '1rem', color: 'var(--cds-text-secondary)' }}>
                          MULTI-STEP CHECKOUT WIZARD
                        </span>
                        <ProgressIndicator
                          currentIndex={activeProgressStep}
                          onChange={(step) => setActiveProgressStep(step)}
                        >
                          <ProgressStep label="Cart Review" secondaryLabel="Step 1" />
                          <ProgressStep label="Fiscal Invoice" secondaryLabel="Step 2" />
                          <ProgressStep label="Payment Settlement" secondaryLabel="Step 3" />
                          <ProgressStep label="Receipt Print" secondaryLabel="Step 4" />
                        </ProgressIndicator>

                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                          <Button
                            size="sm"
                            kind="secondary"
                            disabled={activeProgressStep === 0}
                            onClick={() => setActiveProgressStep(p => Math.max(0, p - 1))}
                          >
                            Previous Step
                          </Button>
                          <Button
                            size="sm"
                            kind="primary"
                            disabled={activeProgressStep === 3}
                            onClick={() => setActiveProgressStep(p => Math.min(3, p + 1))}
                          >
                            Next Step
                          </Button>
                        </div>
                      </Column>

                      <Column lg={8} md={8} sm={4}>
                        <Stack gap={5}>
                          <div>
                            <span className="label-01" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--cds-text-secondary)' }}>
                              PROGRESS BAR & ASYNC LOADERS
                            </span>
                            <ProgressBar
                              label="Fiscal Daily Reconciliation Progress"
                              helperText="75 of 100 transactions verified"
                              value={75}
                              max={100}
                            />
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <InlineLoading
                                status={inlineLoadingStatus}
                                description={
                                  inlineLoadingStatus === 'active'
                                    ? 'Synchronizing...'
                                    : inlineLoadingStatus === 'finished'
                                    ? 'Synchronized!'
                                    : 'Ready'
                                }
                              />
                            </div>

                            <Tooltip label="Carbon interactive definition tooltip" align="top">
                              <Button kind="ghost" size="sm" renderIcon={Information} iconDescription="Tooltip Hover Target">
                                Tooltip Hover Target
                              </Button>
                            </Tooltip>

                            <Popover open={popoverOpen} align="bottom" onRequestClose={() => setPopoverOpen(false)}>
                              <Button size="sm" kind="tertiary" onClick={() => setPopoverOpen(!popoverOpen)}>
                                Toggle Popover
                              </Button>
                              <PopoverContent style={{ padding: '1rem', maxWidth: '280px' }}>
                                <span className="heading-01" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                  Carbon Popover Layer
                                </span>
                                <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.75rem' }}>
                                  Popovers render high-contrast context panels outside standard flow.
                                </p>
                                <Button size="sm" kind="primary" onClick={() => setPopoverOpen(false)}>
                                  Dismiss
                                </Button>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </Stack>
                      </Column>
                    </Grid>
                  </Tile>
                </Column>
              </Grid>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. NAVIGATION & UI SHELL SECTION */}
          {/* ========================================================================= */}
          {(activeCategory === 'all' || activeCategory === 'navigation') && (
            <div id="section-navigation" style={{ scrollMarginTop: '6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '2px solid var(--cds-border-subtle)', paddingBottom: '0.75rem' }}>
                <div>
                  <h2 className="heading-04" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Tag type="green">04</Tag> Navigation & Carbon UI Shell
                  </h2>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Breadcrumbs, ContentSwitchers, Contained Tabs, PaginationNav, and UI Shell guidelines.
                  </p>
                </div>
                <Link href="https://react.carbondesignsystem.com/?path=/story/components-ui-shell--header" target="_blank">
                  Storybook Docs <Launch size={14} />
                </Link>
              </div>

              <Grid fullWidth style={{ rowGap: '2rem' }}>
                {/* Breadcrumb & ContentSwitcher */}
                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="heading-02">Breadcrumb & ContentSwitcher</span>
                    </div>
                    <Stack gap={5}>
                      <div>
                        <span className="label-01" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--cds-text-secondary)' }}>
                          BREADCRUMB TRAIL
                        </span>
                        <Breadcrumb noTrailingSlash>
                          <BreadcrumbItem href="#">Enterprise</BreadcrumbItem>
                          <BreadcrumbItem href="#">Store Cairo-01</BreadcrumbItem>
                          <BreadcrumbItem isCurrentPage>Register Terminal #4</BreadcrumbItem>
                        </Breadcrumb>
                      </div>

                      <div>
                        <span className="label-01" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--cds-text-secondary)' }}>
                          CONTENT SWITCHER (MODAL VIEW)
                        </span>
                        <ContentSwitcher
                          selectedIndex={contentSwitcherIdx}
                          onChange={({ index }) => setContentSwitcherIdx(index ?? 0)}
                        >
                          <Switch name="grid" text="Grid Layout" />
                          <Switch name="table" text="Table View" />
                          <Switch name="analytics" text="Analytics" />
                        </ContentSwitcher>
                      </div>

                      <div style={{ padding: '1rem', backgroundColor: 'var(--cds-layer-01)', borderRadius: '4px' }}>
                        <span className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                          Active Switcher View: <strong>{contentSwitcherIdx === 0 ? 'Grid Layout' : contentSwitcherIdx === 1 ? 'Table View' : 'Analytics'}</strong>
                        </span>
                      </div>
                    </Stack>
                  </Tile>
                </Column>

                {/* Tabs & PaginationNav */}
                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="heading-02">Contained Tabs & PaginationNav</span>
                    </div>
                    <Stack gap={5}>
                      <Tabs>
                        <TabList aria-label="Tab Navigation" contained>
                          <Tab>Overview</Tab>
                          <Tab>Hardware Health</Tab>
                          <Tab>Security Logs</Tab>
                        </TabList>
                        <TabPanels>
                          <TabPanel style={{ padding: '1rem 0' }}>
                            <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                              Overview panel displaying operational KPI cards and cashier shift balances.
                            </p>
                          </TabPanel>
                          <TabPanel style={{ padding: '1rem 0' }}>
                            <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                              Hardware status: Thermal Printer (Ready), Barcode HID (Active), Cash Drawer (Closed).
                            </p>
                          </TabPanel>
                          <TabPanel style={{ padding: '1rem 0' }}>
                            <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                              Security audit records signed with SHA-256 cryptographic hashes.
                            </p>
                          </TabPanel>
                        </TabPanels>
                      </Tabs>

                      <div>
                        <span className="label-01" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--cds-text-secondary)' }}>
                          PAGINATION NAV
                        </span>
                        <PaginationNav totalItems={10} itemsShown={5} page={3} />
                      </div>
                    </Stack>
                  </Tile>
                </Column>
              </Grid>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. LAYOUT, STRUCTURE & TILES SECTION */}
          {/* ========================================================================= */}
          {(activeCategory === 'all' || activeCategory === 'layout') && (
            <div id="section-layout" style={{ scrollMarginTop: '6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '2px solid var(--cds-border-subtle)', paddingBottom: '0.75rem' }}>
                <div>
                  <h2 className="heading-04" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Tag type="purple">05</Tag> Layout, Structure & Tile Spectrum
                  </h2>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Base Tile, ClickableTile, SelectableTile, ExpandableTile, RadioTile, Accordions, and Carbon 2x Grid containers.
                  </p>
                </div>
                <Link href="https://react.carbondesignsystem.com/?path=/story/components-tile--default" target="_blank">
                  Storybook Docs <Launch size={14} />
                </Link>
              </div>

              <Grid fullWidth style={{ rowGap: '2rem' }}>
                {/* Tile Spectrum */}
                <Column lg={4} md={4} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <span className="heading-01" style={{ display: 'block', marginBottom: '0.5rem' }}>1. Base Read-Only Tile</span>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                      Non-interactive container used for grouping structural content.
                    </p>
                  </Tile>
                </Column>

                <Column lg={4} md={4} sm={4}>
                  <ClickableTile
                    href="#section-inputs"
                    style={{ height: '100%' }}
                  >
                    <span className="heading-01" style={{ display: 'block', marginBottom: '0.5rem' }}>2. ClickableTile <ChevronRight size={16} /></span>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                      Interactive anchor tile with hover feedback. Jumps to Inputs section.
                    </p>
                  </ClickableTile>
                </Column>

                <Column lg={4} md={4} sm={4}>
                  <SelectableTile
                    id="sb-sel-tile"
                    selected={selectedTile}
                    onChange={() => setSelectedTile(!selectedTile)}
                    style={{ height: '100%' }}
                  >
                    <span className="heading-01" style={{ display: 'block', marginBottom: '0.5rem' }}>3. SelectableTile</span>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                      Toggle state with built-in checkmark indicator. Status: <strong>{selectedTile ? 'Selected' : 'Unselected'}</strong>
                    </p>
                  </SelectableTile>
                </Column>

                <Column lg={4} md={4} sm={4}>
                  <ExpandableTile style={{ height: '100%' }}>
                    <TileAboveTheFoldContent>
                      <span className="heading-01" style={{ display: 'block', marginBottom: '0.5rem' }}>4. ExpandableTile</span>
                      <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                        Click arrow to reveal fold content.
                      </p>
                    </TileAboveTheFoldContent>
                    <TileBelowTheFoldContent>
                      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--cds-border-subtle)' }}>
                        <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                          Revealed secondary telemetry logs and hardware diagnostics.
                        </p>
                      </div>
                    </TileBelowTheFoldContent>
                  </ExpandableTile>
                </Column>

                {/* RadioTile Group & Accordion */}
                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <span className="heading-02" style={{ display: 'block', marginBottom: '1rem' }}>
                      RadioTile Group (Mutually Exclusive)
                    </span>
                    <TileGroup
                      name="sb-radio-tiles"
                      legend="Select Enterprise Deployment Model"
                      valueSelected={radioTileSelection}
                      onChange={(val) => setRadioTileSelection(String(val))}
                    >
                      <div style={{ marginBottom: '0.75rem' }}>
                        <RadioTile id="plan-std" value="plan-std">
                          <span className="heading-01" style={{ display: 'block' }}>Standard POS Station</span>
                          <span className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>Single-lane terminal with local caching</span>
                        </RadioTile>
                      </div>
                      <div>
                        <RadioTile id="plan-pro" value="plan-pro">
                          <span className="heading-01" style={{ display: 'block' }}>Enterprise Flagship Hub (Selected)</span>
                          <span className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>Multi-lane clustering with MQTT IoT broker</span>
                        </RadioTile>
                      </div>
                    </TileGroup>
                  </Tile>
                </Column>

                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <span className="heading-02" style={{ display: 'block', marginBottom: '1rem' }}>
                      Accordion (Collapsible Sections)
                    </span>
                    <Accordion>
                      <AccordionItem title="Hardware ESC/POS Protocol Specifications" open>
                        <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                          Raw binary commands formatted for EPSON/Star Micronics thermal mechanisms over port 9100 or WebUSB.
                        </p>
                      </AccordionItem>
                      <AccordionItem title="Cryptographic Receipt Signature Verification">
                        <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                          Every fiscal invoice contains an HMAC-SHA256 digest verifiable against the Egyptian Tax Authority e-Receipt API.
                        </p>
                      </AccordionItem>
                      <AccordionItem title="Momken NFC Contactless Payment Specifications">
                        <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                          ISO/IEC 14443 Type A/B smart card reader interfacing with Level 2 EMV payment kernels.
                        </p>
                      </AccordionItem>
                    </Accordion>
                  </Tile>
                </Column>
              </Grid>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. SKELETONS & LOADING SECTION */}
          {/* ========================================================================= */}
          {(activeCategory === 'all' || activeCategory === 'skeletons') && (
            <div id="section-skeletons" style={{ scrollMarginTop: '6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '2px solid var(--cds-border-subtle)', paddingBottom: '0.75rem' }}>
                <div>
                  <h2 className="heading-04" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Tag type="warm-gray">06</Tag> Skeleton Placeholders & Loading States
                  </h2>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Carbon accessibility skeletons for perceived performance during data fetching.
                  </p>
                </div>
                <Link href="https://react.carbondesignsystem.com/?path=/story/components-skeleton--default" target="_blank">
                  Storybook Docs <Launch size={14} />
                </Link>
              </div>

              <Grid fullWidth style={{ rowGap: '2rem' }}>
                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <span className="heading-02" style={{ display: 'block', marginBottom: '1rem' }}>
                      SkeletonText & Placeholders
                    </span>
                    <Stack gap={4}>
                      <SkeletonText heading width="60%" />
                      <SkeletonText paragraph lineCount={3} />
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <ButtonSkeleton size="md" />
                        <SkeletonPlaceholder style={{ width: '120px', height: '40px' }} />
                      </div>
                    </Stack>
                  </Tile>
                </Column>

                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <span className="heading-02" style={{ display: 'block', marginBottom: '1rem' }}>
                      DataTableSkeleton
                    </span>
                    <DataTableSkeleton columnCount={3} rowCount={3} />
                  </Tile>
                </Column>
              </Grid>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. CORE BUILDING BLOCK - LOGIN PATTERN SECTION */}
          {/* ========================================================================= */}
          {(activeCategory === 'all' || activeCategory === 'login') && (
            <div id="section-login" style={{ scrollMarginTop: '6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '2px solid var(--cds-border-subtle)', paddingBottom: '0.75rem' }}>
                <div>
                  <h2 className="heading-04" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Tag type="purple">07</Tag> Core Building Block — Login Pattern
                  </h2>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Carbon Design System Login Building Block pattern with username/email validation, password input toggle, remember me checkbox, forgot password link, SAML/IBMid SSO, and inline notification handling.
                  </p>
                </div>
                <Link href="https://preview.carbondesignsystem.com/building-blocks/core/patterns/login" target="_blank">
                  Carbon Building Blocks: Login Pattern <Launch size={14} />
                </Link>
              </div>

              <Grid fullWidth style={{ rowGap: '2rem' }}>
                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <span className="heading-03">Live Carbon Login Form</span>
                      <Button
                        size="sm"
                        kind="ghost"
                        renderIcon={copiedCode === 'login' ? Checkmark : Copy}
                        iconDescription={copiedCode === 'login' ? 'Copied' : 'Copy JSX'}
                        onClick={() => copyToClipboard(`<Form onSubmit={handleSubmit}>\n  <TextInput id="username" labelText="Username or corporate email" />\n  <PasswordInput id="password" labelText="Password" />\n  <Checkbox id="remember-me" labelText="Remember username" />\n  <Link href="#forgot-password">Forgot password?</Link>\n  <Button type="submit" kind="primary" renderIcon={ArrowRight}>Log in</Button>\n  <Button kind="tertiary" renderIcon={UserAvatar}>Log in with IBMid / SAML SSO</Button>\n</Form>`, 'login')}
                      >
                        {copiedCode === 'login' ? 'Copied' : 'Copy JSX'}
                      </Button>
                    </div>

                    <CarbonLoginForm
                      title="Enterprise POS Access"
                      subtitle="Log in with your corporate credentials or SAML SSO."
                      showFooterLinks={true}
                    />
                  </Tile>
                </Column>

                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%', backgroundColor: 'var(--cds-layer-02)' }}>
                    <Stack gap={5}>
                      <div>
                        <span className="heading-03" style={{ display: 'block', marginBottom: '0.5rem' }}>
                          Login Building Block Specification
                        </span>
                        <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                          The Carbon Login pattern guides users through enterprise authentication while ensuring full accessibility, keyboard control, clear feedback loops, and alignment with IBM Brand design standards.
                        </p>
                      </div>

                      <div>
                        <span className="label-01" style={{ color: 'var(--cds-text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                          Key Component Anatomy:
                        </span>
                        <ul style={{ paddingLeft: '1.25rem', margin: 0, lineHeight: '1.6', fontSize: '0.875rem', color: 'var(--cds-text-primary)' }}>
                          <li><strong>TextInput (Username/Email):</strong> Fluid size="lg" with real-time validation and invalid text messaging.</li>
                          <li><strong>PasswordInput:</strong> Built-in password visibility toggle button and keyboard accessibility.</li>
                          <li><strong>Checkbox & Link:</strong> Remember Me state and Forgot Password trigger inline.</li>
                          <li><strong>Primary Action Button:</strong> Full-width primary CTA with trailing <code>ArrowRight</code> icon.</li>
                          <li><strong>SSO / Federated Login:</strong> Tertiary CTA for IBMid / SAML / OAuth single sign-on.</li>
                          <li><strong>InlineNotification:</strong> Dynamic error handling banner for invalid credentials.</li>
                        </ul>
                      </div>

                      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--cds-border-subtle)' }}>
                        <span className="label-01" style={{ color: 'var(--cds-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                          Official Carbon Spec Link:
                        </span>
                        <CodeSnippet type="single" feedback="Copied link">
                          https://preview.carbondesignsystem.com/building-blocks/core/patterns/login
                        </CodeSnippet>
                      </div>
                    </Stack>
                  </Tile>
                </Column>
              </Grid>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 8. CORE BUILDING BLOCK - NOTIFICATIONS PATTERN SECTION */}
          {/* ========================================================================= */}
          {(activeCategory === 'all' || activeCategory === 'notifications') && (
            <div id="section-notifications" style={{ scrollMarginTop: '6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '2px solid var(--cds-border-subtle)', paddingBottom: '0.75rem' }}>
                <div>
                  <h2 className="heading-04" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Tag type="purple">08</Tag> Core Building Block — Notifications Pattern
                  </h2>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Carbon Design System Notifications Core Pattern with Toast, Inline, and Actionable Notifications, plus an interactive Notification Center Drawer.
                  </p>
                </div>
                <Link href="https://preview.carbondesignsystem.com/building-blocks/core/patterns/notifications" target="_blank">
                  Carbon Building Blocks: Notifications Pattern <Launch size={14} />
                </Link>
              </div>

              <Grid fullWidth style={{ rowGap: '2rem' }}>
                {/* Notification Center Drawer Demo */}
                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <span className="heading-03">Notification Center Drawer</span>
                      <Button
                        size="sm"
                        kind="ghost"
                        renderIcon={copiedCode === 'notif-center' ? Checkmark : Copy}
                        iconDescription={copiedCode === 'notif-center' ? 'Copied' : 'Copy JSX'}
                        onClick={() => copyToClipboard(`<HeaderPanel expanded={isNotificationsExpanded}>\n  <CarbonNotificationCenter />\n</HeaderPanel>`, 'notif-center')}
                      >
                        {copiedCode === 'notif-center' ? 'Copied' : 'Copy JSX'}
                      </Button>
                    </div>

                    <CarbonNotificationCenter />
                  </Tile>
                </Column>

                {/* Toast & Actionable Notification Types */}
                <Column lg={8} md={8} sm={4}>
                  <Tile style={{ height: '100%', backgroundColor: 'var(--cds-layer-02)' }}>
                    <Stack gap={5}>
                      <div>
                        <span className="heading-03" style={{ display: 'block', marginBottom: '0.5rem' }}>
                          Notification Variants & Specifications
                        </span>
                        <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                          Carbon specifies three distinct notification types based on urgency and interaction model:
                        </p>
                      </div>

                      <Stack gap={4}>
                        <div>
                          <span className="label-01" style={{ fontWeight: 600, color: 'var(--cds-text-primary)', display: 'block', marginBottom: '0.5rem' }}>
                            1. Actionable Notification (High Priority / Interactive)
                          </span>
                          <ActionableNotification
                            kind="error"
                            title="Database Sync Lost"
                            subtitle="Primary PostgreSQL instance disconnected. 14 pending offline transactions queued."
                            actionButtonLabel="Retry Connection"
                            onActionButtonClick={() => alert('Re-establishing database sync...')}
                            lowContrast
                            style={{ width: '100%' }}
                          />
                        </div>

                        <div>
                          <span className="label-01" style={{ fontWeight: 600, color: 'var(--cds-text-primary)', display: 'block', marginBottom: '0.5rem' }}>
                            2. Toast Notification (System Pop-ups)
                          </span>
                          <ToastNotification
                            kind="success"
                            title="Inventory Order Transmitted"
                            subtitle="PO #89211 confirmed with supplier."
                            caption="10:42 AM"
                            lowContrast
                            style={{ width: '100%' }}
                          />
                        </div>

                        <div>
                          <span className="label-01" style={{ fontWeight: 600, color: 'var(--cds-text-primary)', display: 'block', marginBottom: '0.5rem' }}>
                            3. Inline Notification (Contextual Form Alerts)
                          </span>
                          <InlineNotification
                            kind="warning"
                            title="Shift Summary Pending"
                            subtitle="Please sign off register drawer balance before logging out."
                            lowContrast
                            style={{ width: '100%' }}
                          />
                        </div>
                      </Stack>

                      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--cds-border-subtle)' }}>
                        <span className="label-01" style={{ color: 'var(--cds-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                          Official Carbon Spec Link:
                        </span>
                        <CodeSnippet type="single" feedback="Copied link">
                          https://preview.carbondesignsystem.com/building-blocks/core/patterns/notifications
                        </CodeSnippet>
                      </div>
                    </Stack>
                  </Tile>
                </Column>
              </Grid>
            </div>
          )}

        </Stack>
      </div>

      {/* Footer reference banner */}
      <div style={{
        marginTop: '4rem',
        padding: '2.5rem 2rem',
        backgroundColor: 'var(--cds-layer-01)',
        borderTop: '1px solid var(--cds-border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <span className="heading-02" style={{ display: 'block', marginBottom: '0.25rem' }}>
            IBM Carbon Design System Storybook Integration
          </span>
          <p className="body-01" style={{ color: 'var(--cds-text-secondary)', margin: 0 }}>
            Conforms strictly to IBM Carbon Design System guidelines, W3C WAI-ARIA standards, and IBM Plex typography scales.
          </p>
        </div>
        <Button
          renderIcon={Launch}
          iconDescription="Explore All Components on Storybook"
          kind="primary"
          onClick={() => window.open('https://react.carbondesignsystem.com/', '_blank')}
        >
          Explore All Components on Storybook
        </Button>
      </div>
    </div>
  );
}
