---
name: carbon-design-system-react
description: Expert guidance for building enterprise React UIs with IBM Carbon Design System v11. Use when implementing Carbon components (@carbon/react), applying design tokens (color, spacing, typography, themes), following UX patterns (filtering, empty states, loading, forms), integrating advanced components (@carbon/ibm-products, carbon-ai-chat), building data visualizations with Carbon Charts, or troubleshooting Carbon implementation issues. Triggers on: "carbon component", "carbon design system", "carbon react", "@carbon/react", "carbon icons", "data table", "structured list", "tile", "modal", "tabs", "accordion", "breadcrumb", "loading", "inline loading", "pagination", "search", "ui shell header", "ui shell sidenav", "header container", "header global bar", "header panel", "side nav", "side nav menu", "step indicator", "wizard", "content switcher", "dropdown", "multi select", "combo box", "typeahead", "structured list", "content cards", "data viz", "charts", "notification", "toast", "tooltip", "popover", "progress bar", "button group", "icon button", "pagination nav", "content menu", "carbon ai chat", "ibm products", "carbon charts".
---

# Carbon Design System for React

Expert technical consultant for implementing IBM Carbon Design System v11 in React applications. Provides implementation-ready guidance for components, design tokens, UX patterns, advanced AI components, data visualization, and troubleshooting.

## Quick Start

```bash
npm install @carbon/react @carbon/icons-react @carbon/react-grid
``` 

## Core Package Structure

| Package | Purpose |
|---------|---------|
| `@carbon/react` | Components, layout, and styling |
| `@carbon/icons-react` | SVG icon components |
| `@carbon/react-grid` | 12-column responsive grid system |
| `@carbon/themes` | Theme definitions (White, G10, G90, G100) |
| `@carbon/charts` | Data visualization charts |

## Importing Components

Carbon uses named imports from `@carbon/react`:

```tsx
import {
  Button, TextField, DataTable, Modal, Tabs, Accordion,
  Breadcrumb, Tag, Loading, InlineLoading, Pagination, Search,
  Content, Header, HeaderName, HeaderNavigation,
  HeaderGlobalBar, HeaderGlobalAction, SideNav,
  SideNavItems, SideNavMenu, SideNavMenuItem,
  HeaderContainer, HeaderMenuButton, SkipToContent,
  Tile, StructuredList, StructuredListHead,
  StructuredListBody, StructuredListItem, StructuredListCell,
  StepIndicator, Step, ContentSwitcher, Switch,
  Dropdown, MultiSelect, ComboBox, Tab, PaginationNav,
  ButtonSet, IconButton, ProgressBar, Tooltip,
  TooltipTrigger, TooltipDefinition, TooltipIcon,
  Popover, PopoverContent, NotificationArea, LoadingOverlay,
  Slug, Grid, Row, Column, Stack,
} from '@carbon/react';
```

Icons are imported from `@carbon/icons-react`:

```tsx
import {
  Search, Notification, UserAvatar, Location, Building,
  Finance, Close, ChevronDown, FavoriteFilled, Terminal,
  Flow, UserMultiple, Add, Edit, Delete, Save, Cancel,
  Download, Upload, Filter, Sort, Refresh, Settings,
  Help, Warning, Error, Success, Information, WarningAlt,
} from '@carbon/icons-react';
```

## Design Principles

### Visual Language
- **Color**: Use semantic colors via `kind` props, not hardcoded hex values
- **Spacing**: Spacing tokens `$spacing-03` through `$spacing-07` (4px grid based)
- **Typography**: IBM Plex Sans (default), IBM Plex Mono for code
- **Iconography**: 16x16px icons in buttons, 20x20px in header actions, 24x24px for standalone

### Component Structure
Each Carbon component follows a consistent API:
1. **Props** — pass via JSX attributes directly
2. **Slots** — child elements or render props for complex content
3. **Kinds** — `primary`, `secondary`, `ghost`, `danger`, `danger--primary`, `tertiary` (buttons)
4. **Sizes** — `sm`, `md`, `lg`, `xl`, `2xl`
5. **Disabled states** — `disabled` prop
6. **Loading states** — `loading` prop or `<Loading>` wrapper

### Accessibility
- All components include `aria-label` for screen readers
- Keyboard navigation: Tab, Enter, Escape, arrow keys
- Focus management: `tabindex`, `onKeyDown` handlers
- `SkipToContent` must be the first child inside `Header`
- Icons must have `aria-label` or be wrapped in a labeled element
- Semantic HTML structure (use `header`, `nav`, `main`, `aside`, `footer`)

## Layout Patterns

### Application Shell (UI Shell)

The **HeaderContainer** pattern coordinates header + sidenav expand/collapse state:

```tsx
<HeaderContainer
  render={({ isSideNavExpanded, onClickSideNavExpand }) => (
    <>
      <Header aria-label="Application Name">
        <SkipToContent />
        <HeaderMenuButton
          aria-label={isSideNavExpanded ? 'Close navigation' : 'Open navigation'}
          onClick={onClickSideNavExpand}
          isActive={isSideNavExpanded}
        />
        <HeaderName href="#" prefix="PREFIX">App Name</HeaderName>
        <HeaderNavigation aria-label="Navigation">
          <HeaderMenuItem isCurrentPage={isActive} onClick={handleClick}>
            Menu Item
          </HeaderMenuItem>
        </HeaderNavigation>
        <HeaderGlobalBar>
          <HeaderGlobalAction aria-label="Search" tooltipAlignment="end" isActive={open} onClick={onClick}>
            <Search size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
        <HeaderPanel aria-label="Panel Label" expanded={activePanel === 'panelName'}>
          {/* Panel content */}
        </HeaderPanel>
      </Header>
    </>
  )}
/>
<SideNav aria-label="Side navigation" expanded={isSideNavExpanded}>
  <SideNavItems>
    <SideNavMenu title="Group Label" defaultExpanded>
      <SideNavMenuItem isActive={isActive} onClick={handleClick}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon size={14} style={{ color: '#0f62fe' }} />
          <span>Label</span>
        </div>
      </SideNavMenuItem>
    </SideNavMenu>
  </SideNavItems>
</SideNav>
```

### Content Area

```tsx
<Content>
  <main id="main-content" className="content-area">
    {/* Page content */}
  </main>
</Content>
```

### Grid System

Carbon's 12-column responsive grid:

```tsx
import { Grid, Row, Column } from '@carbon/react';

<Grid>
  <Row>
    <Column lg={6} md={4} sm={4}>
      {/* Column content */}
    </Column>
    <Column lg={6} md={8} sm={8}>
      {/* Column content */}
    </Column>
  </Row>
</Grid>
```

Breakpoints: `sm` (320px), `md` (672px), `lg` (1056px), `xl` (1312px), `2xl` (1536px).

### Stack Component

For consistent vertical spacing using Carbon spacing tokens:

```tsx
import { Stack } from '@carbon/react';

<Stack gap={7}>
  {/* Children spaced by $spacing-07 */}
</Stack>
```

`gap` values: `{0-7}` mapping to `$spacing-01` through `$spacing-07`.

## Component Patterns

### Data Table

```tsx
import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TextInput, TableToolbar, TableToolbarContent, TableContainer, Pagination, TableSelectedRowProvider } from '@carbon/react';

<TableContainer title="Table Title" description="Optional description">
  <TableToolbar>
    <TableToolbarContent>
      <TextInput placeholder="Search..." id="data-table-search" />
    </TableToolbarContent>
  </TableToolbar>
  <DataTable
    rows={rows}
    headers={headers}
    keyProp="id"
    pagination
    paginationComponent="inline"
    isSortable
    selection={false}
  >
    {({ rows, headers, getHeaderProps, getRowProps, getSelectionProps, onInputChange, selectedRowsCount }) => (
      <Table>
        <TableHead>
          <TableRow>
            {headers.map(header => (
              <TableHeader {...getHeaderProps({ header })} key={header.key}>
                {header.label}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow {...getRowProps({ row })} key={row.id}>
              {row.cells.map(cell => (
                <TableCell key={cell.id}>{cell.value}</TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    )}
  </DataTable>
</TableContainer>
```

### Tabs

```tsx
import { Tabs, Tab } from '@carbon/react';

<Tabs>
  <Tab id="tab-1" label="Tab 1">
    Content for Tab 1
  </Tab>
  <Tab id="tab-2" label="Tab 2">
    Content for Tab 2
  </Tab>
</Tabs>
```

### Accordion

```tsx
import { Accordion, AccordionItem } from '@carbon/react';

<Accordion>
  <AccordionItem title="Section 1" ariaLabel="Section 1 description">
    Content for section 1
  </AccordionItem>
</Accordion>
```

### Breadcrumb

```tsx
import { Breadcrumb, BreadcrumbItem } from '@carbon/react';

<Breadcrumb noTrailingSlash>
  <BreadcrumbItem isCurrentPage>Home</BreadcrumbItem>
  <BreadcrumbItem>Parent</BreadcrumbItem>
  <BreadcrumbItem isCurrentPage>Current Page</BreadcrumbItem>
</Breadcrumb>
```

### Tag

```tsx
import { Tag } from '@carbon/react';

<Tag type="green" size="sm">Success</Tag>
```

Tag types: `teal`, `gray`, `red`, `purple`, `blue`, `green`, `orange`, `warm-gray`, `cool-gray`.

### Tile & Structured List

```tsx
import { Tile, StructuredList, StructuredListHead, StructuredListBody, StructuredListItem, StructuredListCell, StructuredListWrapper } from '@carbon/react';

<Tile>
  <StructuredListWrapper>
    <StructuredListHead>
      <StructuredListItem>
        <StructuredListCell>Key</StructuredListCell>
        <StructuredListCell>Value</StructuredListCell>
      </StructuredListItem>
    </StructuredListHead>
    <StructuredListBody>
      <StructuredListItem>
        <StructuredListCell>Name</StructuredListCell>
        <StructuredListCell>John Doe</StructuredListCell>
      </StructuredListItem>
    </StructuredListBody>
  </StructuredListWrapper>
</Tile>
```

### Pagination & PaginationNav

```tsx
import { Pagination, PaginationNav } from '@carbon/react';

<Pagination
  itemsPerPageText="Items per page"
  maxPages={3}
  page={1}
  totalPages={10}
  onChange={handlePageChange}
/>

<PaginationNav
  totalPages={10}
  currentPage={1}
  maxPages={5}
  onPageClick={handlePageClick}
/>
```

## Form Components

### TextField

```tsx
<TextField
  id="id"
  labelText="Label"
  placeholder="Placeholder"
  helperText="Helper text"
  invalidText="Error message"
  invalid={false}
  disabled={false}
  value={value}
  onChange={handleChange}
/>
```

### Select

```tsx
<Select
  id="select-id"
  labelText="Select Label"
  value={value}
  onChange={handleChange}
  disabled={false}
  invalid={false}
  invalidText="Error message"
>
  <SelectItem value="option1" text="Option 1" />
  <SelectItem value="option2" text="Option 2" />
</Select>
```

### MultiSelect

```tsx
<MultiSelect
  id="multiselect-id"
  labelText="Multi Select Label"
  items={items}
  itemToString={item => item.label}
  selectedItems={selectedItems}
  onChange={setSelectedItems}
  placeholder="Select items"
/>
```

### ComboBox

```tsx
<ComboBox
  id="combo-id"
  labelText="Combo Label"
  placeholder="Select or type..."
  items={items}
  itemToString={item => item.label}
  onChange={handleChange}
  allowCustomValue
  autoAlign
/>
```

### NumberInput

```tsx
<NumberInput
  id="number-id"
  labelText="Amount"
  placeholder="0.00"
  min={0}
  max={1000}
  step={0.01}
  currency
  value={value}
  onChange={handleChange}
/>
```

### DatePicker

```tsx
<DatePicker
  datePickerStyle="single"
  value={date}
  onChange={handleDateChange}
  dateFormatStr="Y-MM-DD"
  placeholder="YYYY-MM-DD"
  open={open}
  onOpenChange={setOpen}
/>
```

### Toggle & Checkbox

```tsx
<Toggle
  labelA="Off"
  labelB="On"
  toggled={value}
  onToggle={handleChange}
  disabled={false}
/>

<Checkbox
  id="checkbox-id"
  labelText="Checkbox Label"
  checked={checked}
  onChange={handleChange}
  disabled={false}
/>
```

### RadioGroup

```tsx
<RadioGroup
  value={selectedValue}
  onChange={handleChange}
  legend="Radio Group Label"
>
  <RadioButton value="option1" labelText="Option 1" />
  <RadioButton value="option2" labelText="Option 2" />
</RadioGroup>
```

### ButtonSet

```tsx
<ButtonSet>
  <Button kind="primary" onClick={handleSave}>Save</Button>
  <Button kind="secondary" onClick={handleCancel}>Cancel</Button>
</ButtonSet>
```

## Modal Dialogs

```tsx
import { Modal, ModalWarning, ModalError } from '@carbon/react';

<Modal
  open={isOpen}
  modalHeading="Modal Title"
  primaryButtonText="Save"
  secondaryButtonText="Cancel"
  onRequestClose={handleClose}
  onRequestSubmit={handleSubmit}
  passiveModal={false}
  danger={false}
>
  Modal content goes here
</Modal>

<ModalWarning
  open={isOpen}
  title="Warning Title"
  modalHeading="Are you sure?"
  primaryButtonText="Proceed"
  secondaryButtonText="Cancel"
  onRequestClose={handleClose}
  onRequestSubmit={handleDelete}
/>

<ModalError
  open={isOpen}
  title="Error Title"
  modalHeading="Something went wrong"
  primaryButtonText="OK"
  onRequestClose={handleClose}
/>
```

## Loading States

```tsx
import { Loading, InlineLoading } from '@carbon/react';

<Loading />
<InlineLoading
  description="Loading data..."
  status="active"
  iconSize={20}
  onButtonClick={() => {}}
/>
<LoadingOverlay />
```

## Notifications & Toasts

```tsx
import { NotificationArea, NotificationButton, NotificationText } from '@carbon/react';

<NotificationArea
  kind="success"
  title="Operation Completed"
  subtitle="Your changes have been saved."
  onClose={() => {}}
/>
```

## Tooltips & Popovers

```tsx
import { Tooltip, TooltipTrigger, TooltipDefinition, TooltipIcon, Popover, PopoverContent } from '@carbon/react';

<Tooltip tooltipPosition="bottom" tooltipText="Helpful text">
  <button>Hover me</button>
</Tooltip>

<TooltipDefinition tooltipText="Detailed definition">
  Term
</TooltipDefinition>

<TooltipIcon
  tooltipText="Additional info"
  icon={<Information size={16} />}
/>

<Popover>
  <Button>Click for popover</Button>
  <PopoverContent>
    Popover content
  </PopoverContent>
</Popover>
```

## Icons

All icons from `@carbon/icons-react` accept a `size` prop (number for pixels).

- **16px** — inline icons, tree items, table cells
- **20px** — header global actions (`HeaderGlobalAction`)
- **24px** — standalone or large contexts

```tsx
<Search size={20} />
<Information size={16} />
```

## Project-Specific Patterns

### Header Icon Placement Order

Per Carbon spec, HeaderGlobalActions are placed right-to-left as:
1. **Search** (`Search` icon, 20px) — furthest left
2. **Notifications** (`Notification` icon, 20px)
3. **Help** (`Help` icon, 20px)
4. **Account/User** (`UserAvatar` icon, 20px)
5. **Switcher** (`Switcher` icon, 20px) — furthest right

Each `HeaderGlobalAction` should have:
- `aria-label` describing the action
- `tooltipAlignment="end"` for proper tooltip positioning
- `isActive` bound to panel state
- `onClick` toggling the panel

### HeaderPanel Pattern

```tsx
<HeaderPanel
  aria-label="Panel Label"
  expanded={activePanel === 'panelName'}
>
  {/* Panel content with Close handler in header */}
</HeaderPanel>
```

### SideNav Navigation

```tsx
<SideNavMenu title="Group Label" defaultExpanded>
  <SideNavMenuItem
    isActive={activePageId === 'page.id'}
    onClick={() => handleNavigate('page.id')}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Icon size={14} style={{ color: '#0f62fe' }} />
      <span>Label</span>
    </div>
  </SideNavMenuItem>
</SideNavMenu>
```

### Tag Usage

```tsx
<Tag type="teal" size="sm">PROD</Tag>
<Tag type="cool-gray" size="sm">{entity.id}</Tag>
<Tag type="blue" size="sm">{page.pageType.toUpperCase()}</Tag>
<Tag type="red">3 Pending</Tag>
```

### Button Kinds

- `kind="primary"` — primary action
- `kind="secondary"` — secondary action
- `kind="tertiary"` — subtle action (often with `style={{ width: '100%' }}`)
- `kind="ghost"` — lowest emphasis (used in shortcut buttons)
- `kind="danger--primary"` — primary destructive action

### ProgressBar for Background Jobs

```tsx
<ProgressBar
  label=""
  value={job.progress}
  status={job.status === 'Completed' ? 'finished' : 'active'}
/>
```

## Data Visualization

For charts, use Carbon's dataviz packages:

```bash
npm install @carbon/charts @carbon/charts-react
```

```tsx
import { BarChart, BarChartContent, BarChartHeader, BarChartRoot, BarChartTooltip } from '@carbon/charts-react';

<BarChartRoot
  data={chartData}
  options={chartOptions}
>
  <BarChartContent />
  <BarChartHeader />
  <BarChartTooltip />
</BarChartRoot>
```

## Testing Considerations

### Style Classes
Carbon components output classes prefixed with `cds--`. When targeting Carbon elements in CSS/SCSS:

```scss
.cds--btn--secondary {
  width: 100%;
  margin-bottom: 0.5rem;
}
```

## Common Pitfalls

1. **Missing `aria-labels`** — always provide accessible labels for icon-only actions
2. **Icon size inconsistencies** — use 16px for inline, 20px for header actions, 24px for standalone
3. **HeaderGlobalBar icon order** — follow the spec: Search, Notifications, Help, Account, Switcher (right to left)
4. **Modal `onRequestSubmit`** — use it for primary button actions; `onRequestClose` for close/cancel
5. **SideNav `expanded` state** — wire through `HeaderContainer`'s render prop for consistent toggle behavior
6. **DataTable `keyProp`** — always specify which field is the unique key for row selection
7. **Select items** — use `SelectItem` children (not render props like MultiSelect/ComboBox)
8. **Tag `type` values** — use semantic color names, not raw hex values
9. **Grid breakpoints** — `sm`, `md`, `lg`, `xl`, `2xl` as column props
10. **Stack gap values** — integers 0-7 mapping to `$spacing-01` through `$spacing-07`

## Reference Files

- [tokens.md](references/tokens.md) — Complete design token reference (color, spacing, typography, themes)
- [typography.md](references/typography.md) — Comprehensive typography guidance (type sets, scale, fonts, tokens, accessibility)
- [components.md](references/components.md) — Component implementation patterns and APIs
- [patterns.md](references/patterns.md) — UX patterns (filtering, empty states, loading, forms)
- [ai-components.md](references/ai-components.md) — IBM Products, Carbon AI Chat, and Carbon Charts
- [troubleshooting.md](references/troubleshooting.md) — Common issues, debugging, and best practices

## Version Information

This skill targets Carbon Design System **v11** (latest). Key v11 changes from v10:
- SCSS files no longer need to be imported separately — CSS is bundled
- `Header` component uses `HeaderContainer` for sidenav coordination
- Icons are imported from `@carbon/icons-react` (not `@carbon/react/icons`)
- `Content` component replaces manual content wrappers
- Components use `kind` prop values instead of separate component variants


# Component Implementation Patterns

## Core Component Categories

### Data Display
- DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell
- StructuredList, StructuredListHead, StructuredListBody, StructuredListItem, StructuredListCell
- Tile, Tag, Accordion, AccordionItem
- Pagination, PaginationNav

### Forms & Inputs
- TextField, TextArea, NumberInput, Password
- Select, SelectItem, MultiSelect, ComboBox
- DatePicker, TimePicker
- Checkbox, RadioGroup, RadioButton, Toggle, Slider
- Form, FormGroup, FormLabel

### Navigation
- Breadcrumb, BreadcrumbItem
- Tabs, Tab
- ContentSwitcher
- TreeView, TreeViewItem
- SideNav, SideNavItems, SideNavMenu, SideNavMenuItem

### Feedback & Status
- Loading, InlineLoading, LoadingOverlay
- Notification, NotificationText, NotificationButton, NotificationArea
- ProgressBar, ProgressIndicator, Step, StepIndicator
- Tooltip, TooltipTrigger, TooltipDefinition, TooltipIcon, TooltipModal
- Popover, PopoverContent
- Toggletip

### Overlays
- Modal, ModalWarning, ModalError
- SidePanel, HeaderPanel

### Layout
- Header, HeaderContainer, HeaderName, HeaderNavigation, HeaderMenuButton, HeaderGlobalBar, HeaderGlobalAction
- SkipToContent
- Content
- Grid, Row, Column
- Stack
- ButtonSet

### Actions
- Button, IconButton
- OverflowMenu, OverflowMenuItem
- Search
- Link

## Component API Patterns

### Render Props Pattern (DataTable)

```tsx
<DataTable rows={rows} headers={headers} keyProp="id">
  {({ rows, headers, getHeaderProps, getRowProps, getSelectionProps }) => (
    <Table>
      <TableHead>
        <TableRow>
          {headers.map(header => (
            <TableHeader {...getHeaderProps({ header })} key={header.key}>
              {header.label}
            </TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => (
          <TableRow {...getRowProps({ row })} key={row.id}>
            {row.cells.map(cell => (
              <TableCell key={cell.id}>{cell.value}</TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )}
</DataTable>
```

### Children Pattern (Select)

```tsx
<Select id="select-id" labelText="Select Label" value={value} onChange={handleChange}>
  <SelectItem value="option1" text="Option 1" />
  <SelectItem value="option2" text="Option 2" />
</Select>
```

### Controlled Component Pattern

```tsx
const [value, setValue] = useState('');

<TextField
  id="id"
  labelText="Label"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Slots Pattern (Modal)

```tsx
<Modal
  open={isOpen}
  modalHeading="Title"
  primaryButtonText="Save"
  secondaryButtonText="Cancel"
  onRequestClose={handleClose}
  onRequestSubmit={handleSubmit}
>
  {/* Modal content */}
</Modal>
```

## Common Props

| Prop | Description | Values |
|------|-------------|--------|
| `kind` | Visual style variant | `primary`, `secondary`, `ghost`, `danger`, `danger--primary`, `tertiary` |
| `size` | Component size | `sm`, `md`, `lg`, `xl`, `2xl` |
| `disabled` | Disabled state | `boolean` |
| `loading` | Loading state | `boolean` |
| `invalid` | Validation state | `boolean` |
| `invalidText` | Error message | `string` |
| `helperText` | Help text | `string` |
| `labelText` | Label text | `string` |
| `placeholder` | Placeholder text | `string` |
| `id` | HTML id attribute | `string` |


# UX Patterns

## Filtering Pattern

Use `Search` + `DataTable` with filter controls:

```tsx
import { Search, Button, ButtonSet } from '@carbon/react';

<TableToolbar>
  <TableToolbarContent>
    <Search
      id="search"
      labelText="Search"
      placeholder="Search..."
      onChange={handleSearch}
    />
    <Button kind="secondary" size="sm" onClick={handleFilter}>
      <Filter size={16} />
      Filter
    </Button>
    <Button kind="ghost" size="sm" onClick={handleReset}>
      Reset
    </Button>
  </TableToolbarContent>
</TableToolbar>
```

## Empty States Pattern

```tsx
import { EmptyState, Button } from '@carbon/react';

<EmptyState
  title="No items found"
  description="Get started by creating a new item or importing existing data."
  action={
    <Button kind="primary" onClick={handleCreate}>
      Create item
    </Button>
  }
/>
```

## Loading Pattern

### Inline Loading
```tsx
<InlineLoading
  description="Loading data..."
  status="active"
  iconSize={20}
/>
```

### Full Page Loading
```tsx
<Loading />
```

### Loading Overlay
```tsx
<LoadingOverlay />
```

### Skeleton Loading
```tsx
import { Skeleton, SkeletonText } from '@carbon/react';

<SkeletonText heading width="60%" />
<SkeletonText paragraph lines={3} />
```

## Status Indicators Pattern

```tsx
import { Tag } from '@carbon/react';

<Tag type="teal" size="sm">Active</Tag>
<Tag type="red" size="sm">Error</Tag>
<Tag type="yellow" size="sm">Warning</Tag>
<Tag type="blue" size="sm">Info</Tag>
<Tag type="gray" size="sm">Inactive</Tag>
```

Tag types: `teal`, `gray`, `red`, `purple`, `blue`, `green`, `orange`, `warm-gray`, `cool-gray`.

## Forms Pattern

Use `Form` with proper spacing and validation:

```tsx
<Form>
  <TextInput
    id="email"
    labelText="Email address"
    placeholder="user@example.com"
    helperText="We'll never share your email"
    invalid={hasError}
    invalidText={errorMessage}
  />
  <ButtonSet>
    <Button kind="secondary" onClick={handleCancel}>Cancel</Button>
    <Button kind="primary" onClick={handleSubmit}>Submit</Button>
  </ButtonSet>
</Form>
```

## Pagination Pattern

```tsx
<Pagination
  itemsPerPageText="Items per page"
  itemCount={totalItems}
  page={currentPage}
  totalPages={totalPages}
  onChange={handlePageChange}
  paginationComponent="inline"
/>
```

## Notification Pattern

```tsx
<Notification
  kind="success"
  title="Success"
  subtitle="Your changes have been saved."
  onClose={() => setNotification(null)}
/>
```

## Dialog Pattern

```tsx
<Modal
  open={isOpen}
  modalHeading="Confirm action"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  onRequestClose={handleClose}
  onRequestSubmit={handleConfirm}
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```


# Carbon v11 Design Tokens

## Color Palette

### Core Blues (Primary Action Family)

| Token | Hex | Use |
|-------|-----|-----|
| blue-10 | `#edf5ff` | Light backgrounds |
| blue-20 | `#d0e2ff` | Hover bg (light) |
| blue-30 | `#a6c8ff` | |
| blue-40 | `#78a9ff` | Link (dark themes) |
| blue-50 | `#4589ff` | |
| blue-60 | `#0f62fe` | **Primary action** |
| blue-70 | `#0043ce` | Active state (light) |
| blue-80 | `#002d9c` | |
| blue-90 | `#001d6c` | |
| blue-100 | `#001141` | |

### Grays (Neutral)

| Token | Hex |
|-------|-----|
| gray-10 | `#f4f4f4` |
| gray-20 | `#e0e0e0` |
| gray-30 | `#c6c6c6` |
| gray-40 | `#a8a8a8` |
| gray-50 | `#8d8d8d` |
| gray-60 | `#6f6f6f` |
| gray-70 | `#525252` |
| gray-80 | `#393939` |
| gray-90 | `#262626` |
| gray-100 | `#161616` |

### Support Colors

| Family | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 |
|--------|----|----|----|----|----|----|----|----|
| Red | `#fff1f1` | `#ffd7d9` | `#ffb3b8` | `#ff8389` | `#fa4d56` | `#da1e28` | `#a2191f` | `#750e13` |
| Green | `#defbe6` | `#a7f0ba` | `#6fdc8c` | `#42be65` | `#24a148` | `#198038` | `#0e6027` | `#044317` |
| Yellow | `#fcf4d6` | `#fddc69` | `#f1c21b` | `#d2a106` | `#b28600` | `#8e6a00` | `#684e00` | `#483700` |
| Purple | `#f6f2ff` | `#e8daff` | `#d4bbff` | `#be95ff` | `#a56eff` | `#8a3ffc` | `#6929c4` | `#491d8b` |
| Teal | `#d9fbfb` | `#9ef0f0` | `#3ddbd9` | `#08bdba` | `#009d9a` | `#007d79` | `#005d5d` | `#004144` |
| Cyan | `#e5f6ff` | `#bae6ff` | `#82cfff` | `#33b1ff` | `#1192e8` | `#0072c3` | `#00539a` | `#003a6d` |
| Magenta | `#fff0f7` | `#ffd6e8` | `#ffafd2` | `#ff7eb6` | `#ee5396` | `#d02670` | `#9f1853` | `#740937` |

## Theme Tokens

### Background & Layer Tokens

| Token | White | g10 | g90 | g100 |
|-------|-------|-----|-----|------|
| `$background` | `#ffffff` | `#f4f4f4` | `#262626` | `#161616` |
| `$layer-01` | `#f4f4f4` | `#ffffff` | `#393939` | `#262626` |
| `$layer-02` | `#ffffff` | `#f4f4f4` | `#525252` | `#393939` |
| `$layer-accent-01` | `#e0e0e0` | `#e0e0e0` | `#525252` | `#393939` |
| `$field-01` | `#f4f4f4` | `#ffffff` | `#393939` | `#262626` |
| `$field-02` | `#ffffff` | `#f4f4f4` | `#525252` | `#393939` |
| `$border-subtle-00` | `#e0e0e0` | `#c6c6c6` | `#525252` | `#393939` |
| `$border-strong-01` | `#8d8d8d` | `#8d8d8d` | `#8d8d8d` | `#6f6f6f` |

### Text Tokens

| Token | White | g10 | g90 | g100 |
|-------|-------|-----|-----|------|
| `$text-primary` | `#161616` | `#161616` | `#f4f4f4` | `#f4f4f4` |
| `$text-secondary` | `#525252` | `#525252` | `#c6c6c6` | `#c6c6c6` |
| `$text-placeholder` | `#a8a8a8` | `#a8a8a8` | `#6f6f6f` | `#6f6f6f` |
| `$text-on-color` | `#ffffff` | `#ffffff` | `#ffffff` | `#ffffff` |
| `$text-helper` | `#6f6f6f` | `#6f6f6f` | `#a8a8a8` | `#a8a8a8` |
| `$text-error` | `#da1e28` | `#da1e28` | `#ff8389` | `#ff8389` |
| `$text-inverse` | `#ffffff` | `#ffffff` | `#161616` | `#161616` |

### Interactive Tokens

| Token | White | g10 | g90 | g100 |
|-------|-------|-----|-----|------|
| `$interactive` | `#0f62fe` | `#0f62fe` | `#4589ff` | `#4589ff` |
| `$link-primary` | `#0f62fe` | `#0f62fe` | `#78a9ff` | `#78a9ff` |
| `$link-secondary` | `#0043ce` | `#0043ce` | `#a6c8ff` | `#a6c8ff` |
| `$link-visited` | `#8a3ffc` | `#8a3ffc` | `#be95ff` | `#be95ff` |
| `$link-inverse` | `#78a9ff` | `#78a9ff` | `#0f62fe` | `#0f62fe` |
| `$focus` | `#0f62fe` | `#0f62fe` | `#ffffff` | `#ffffff` |
| `$icon-primary` | `#161616` | `#161616` | `#f4f4f4` | `#f4f4f4` |
| `$icon-secondary` | `#525252` | `#525252` | `#c6c6c6` | `#c6c6c6` |

### Button Tokens

| Token | White/g10 | g90/g100 |
|-------|-----------|----------|
| `$button-primary` | `#0f62fe` | `#0f62fe` |
| `$button-primary-hover` | `#0050e6` | `#0050e6` |
| `$button-primary-active` | `#002d9c` | `#002d9c` |
| `$button-secondary` | `#393939` | `#6f6f6f` |
| `$button-secondary-hover` | `#474747` | `#606060` |
| `$button-secondary-active` | `#6f6f6f` | `#393939` |
| `$button-tertiary` | `#0f62fe` | `#ffffff` |
| `$button-danger-primary` | `#da1e28` | `#da1e28` |
| `$button-danger-secondary` | `#da1e28` | `#ff8389` |
| `$button-disabled` | `#c6c6c6` | `#525252` |

### Support / Status Tokens

| Token | White/g10 | g90/g100 |
|-------|-----------|----------|
| `$support-error` | `#da1e28` | `#ff8389` |
| `$support-success` | `#198038` | `#42be65` |
| `$support-warning` | `#f1c21b` | `#f1c21b` |
| `$support-info` | `#0043ce` | `#4589ff` |

## Typography Tokens

Carbon uses **IBM Plex** as its typeface. The typographic system uses type tokens across two type sets to manage hierarchy and readability.

### Typeface: IBM Plex

IBM Plex is the open-source typeface designed for IBM's global technology needs. It comes in three variants:

- **IBM Plex Sans** — primary UI typeface
- **IBM Plex Serif** — for long-form reading
- **IBM Plex Mono** — for code and technical content

#### Font Stacks

```css
/* Sans-serif (default) */
font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;

/* Serif */
font-family: 'IBM Plex Serif', 'Georgia', Times, serif;

/* Mono */
font-family: 'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', Courier, monospace;
```

### Type Sets: Productive vs Expressive

Carbon manages typography through two type sets:

- **Productive** (`-01` suffix): Condensed treatment for product interfaces where users need to maintain focus on tasks. Uses **fixed headings** that do not change size at breakpoints.
- **Expressive** (`-02` suffix): Larger, more dramatic styles for editorial and marketing design. Excellent for long-form reading and scanning. Uses **responsive headings** that change size at different breakpoints.

> **Note**: Within Body styles and Utility styles, the same set of styles are offered. Productive styles are named with a `-01` suffix and expressive style names have a `-02` suffix.

### Type Scale

The IBM type scale is built on a single equation: `Xn = Xn-1 + {INT[(n-2)/4] + 1} * 2`, assuming `y₀ = 12px`.

| rem | px | Usage |
|-----|-----|-------|
| 0.75 | 12 | Small captions, helper text |
| 0.875 | 14 | Secondary text, labels |
| 1 | 16 | Body text default |
| 1.125 | 18 | Large body, small headings |
| 1.25 | 20 | Section headers |
| 1.5 | 24 | Page headings |
| 1.75 | 28 | Display headings |
| 2 | 32 | Hero text |
| 2.25 | 36 | Large display |
| 2.625 | 42 | Marketing headlines |
| 3 | 48 | Editorial headlines |
| 3.375 | 54 | Large editorial |
| 3.75 | 60 | Display |
| 4.25 | 68 | Marketing display |
| 4.75 | 76 | Hero display |
| 5.25 | 84 | Large hero |
| 5.75 | 92 | Maximum display |

### Typography Styles

#### Weights

Font weight pairs with size to create hierarchy. Suggested weights for digital experiences:

- **Light (300)** — large display text
- **Regular (400)** — body text, medium headings
- **Semibold (600)** — section headers, emphasis (avoid for long text)

#### Italic

Each weight has an italic variant. Use italic only to emphasize certain words in a sentence (titles of works, technical terms, names of devices, captions).

### Type Color Guidelines

Type color should prioritize legibility and accessibility:

- **Running text**: Keep type color neutral
- **Primary actions/links**: Use primary blue (`$text-link-primary` / `$interactive`)
- **Secondary actions**: Use Gray 100 (`$text-secondary`)
- **Code snippets, warnings, alerts**: Use colored type sparingly for semantic meaning
- **Decorative color**: Avoid using color for decoration in text

### Utility Styles

| Token | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|----------------|
| `label-01` | 12px | 16px | 400 | 0.32px |
| `label-02` | 14px | 18px | 400 | 0.16px |
| `helper-text-01` | 12px | 16px | 400 | 0.32px |
| `helper-text-02` | 14px | 18px | 400 | 0.16px |
| `legal-01` | 12px | 16px | 400 | 0.32px |
| `legal-02` | 14px | 18px | 400 | 0.16px |

### Body Styles

| Token | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|----------------|
| `body-compact-01` | 14px | 18px | 400 | 0.16px |
| `body-compact-02` | 16px | 22px | 400 | 0px |
| `body-01` | 14px | 20px | 400 | 0.16px |
| `body-02` | 16px | 24px | 400 | 0px |

### Heading Styles (Productive -01)

| Token | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|----------------|
| `heading-compact-01` | 14px | 18px | 600 | 0.16px |
| `heading-compact-02` | 16px | 22px | 600 | 0px |
| `heading-03` | 20px | 28px | 400 | 0px |
| `heading-04` | 28px | 36px | 400 | 0px |
| `heading-05` | 32px | 40px | 400 | 0px |
| `heading-06` | 42px | 50px | 300 | 0px |
| `heading-07` | 54px | 64px | 300 | 0px |

### Heading Styles (Expressive -02)

Expressive headings are responsive and change size at different breakpoints. The naming follows the same pattern with `-02` suffix.

### Code Style

| Token | Family | Size | Line Height | Weight |
|-------|--------|------|-------------|--------|
| `code-01` | IBM Plex Mono | 12px | 16px | 400 |
| `code-02` | IBM Plex Mono | 14px | 20px | 400 |

## Spacing Tokens

### Component Spacing (mini-unit scale)

| Token | Value |
|-------|-------|
| `$spacing-01` | 2px |
| `$spacing-02` | 4px |
| `$spacing-03` | 8px |
| `$spacing-04` | 12px |
| `$spacing-05` | 16px |
| `$spacing-06` | 24px |
| `$spacing-07` | 32px |
| `$spacing-08` | 40px |
| `$spacing-09` | 48px |

### Layout Spacing

| Token | Value |
|-------|-------|
| `$spacing-10` | 64px |
| `$spacing-11` | 80px |
| `$spacing-12` | 96px |
| `$spacing-13` | 160px |

### Container Sizes

| Token | Value | Use |
|-------|-------|-----|
| `$container-01` | 24px | Small containers |
| `$container-02` | 32px | Default input height (sm) |
| `$container-03` | 40px | Default input height (md) |
| `$container-04` | 48px | Default input height (lg) |
| `$container-05` | 64px | Large containers |

## Icon Sizes

Carbon icons come in four sizes: 16x16, 20x20, 24x24, 32x32.

| Size | Use |
|------|-----|
| 16px | Inline, UI chrome, table actions |
| 20px | Default for most UI contexts |
| 24px | Navigation icons, larger UI |
| 32px | Feature icons, empty states |

## Layer Model

Carbon v11 uses a layering model to handle elevation. Instead of shadows, Carbon uses background-color shifts between layers.

| Layer | Light Themes | Dark Themes |
|-------|-------------|-------------|
| Background (base) | White or g10 | g100 or g90 |
| Layer 01 | One step lighter/darker than bg | One step lighter than bg |
| Layer 02 | One step from layer 01 | One step from layer 01 |
| Layer 03 | One step from layer 02 | One step from layer 02 |

In CSS, apply with `cds--layer-one`, `cds--layer-two`, `cds--layer-three` classes. Tiles, cards, and dropdowns sit on layers above the background.



# Troubleshooting & Best Practices

## Common Issues

### 1. Styles Not Applying

**Symptom**: Carbon components render without proper styling.

**Solution**:
- Ensure `@carbon/styles` is imported in your entry point:
  ```tsx
  import '@carbon/styles/css/styles.css';
  ```
- Verify the theme provider wraps your application:
  ```tsx
  <ThemeProvider theme={g100Theme}>
    <App />
  </ThemeProvider>
  ```
- Check that SCSS variables are properly configured if using custom theming.

### 2. Icon Not Rendering

**Symptom**: Icons appear as empty boxes or don't show.

**Solution**:
- Import from `@carbon/icons-react`, not `@carbon/react/icons`
- Ensure the icon component is used correctly:
  ```tsx
  import { Search } from '@carbon/icons-react';
  <Search size={20} />
  ```
- Check that `size` prop is a number, not a string.

### 3. DataTable Not Sorting

**Symptom**: Column headers don't respond to clicks.

**Solution**:
- Ensure `isSortable` prop is set:
  ```tsx
  <DataTable isSortable={true} ...>
  ```
- Verify headers have `key` and `label` properties.
- Check that `getHeaderProps` is spread onto `TableHeader`.

### 4. Modal Not Closing

**Symptom**: Modal stays open when clicking outside or pressing Escape.

**Solution**:
- Verify `onRequestClose` handler is properly wired:
  ```tsx
  <Modal
    onRequestClose={() => setIsOpen(false)}
    ...
  />
  ```
- Check that `passiveModal` is set correctly (false for standard modals).

### 5. Header/SideNav State Desync

**Symptom**: SideNav doesn't collapse when header menu button is clicked.

**Solution**:
- Use `HeaderContainer` render prop pattern:
  ```tsx
  <HeaderContainer
    render={({ isSideNavExpanded, onClickSideNavExpand }) => (
      <>
        <HeaderMenuButton
          onClick={onClickSideNavExpand}
          isActive={isSideNavExpanded}
        />
        <SideNav expanded={isSideNavExpanded}>
          ...
        </SideNav>
      </>
    )}
  />
  ```

### 6. Form Validation Not Showing

**Symptom**: Error states don't appear on form fields.

**Solution**:
- Set `invalid={true}` and provide `invalidText`:
  ```tsx
  <TextField
    invalid={hasError}
    invalidText={errorMessage}
    ...
  />
  ```
- Ensure the form field has an associated `id` and `labelText`.

## Best Practices

### Theming

- Use `ThemeProvider` from `@carbon/react` for theme switching
- Support all four themes: White, g10, g90, g100
- Use semantic color tokens, never hardcode hex values

### Accessibility

- Always provide `aria-label` for icon-only buttons
- Use semantic HTML elements (`header`, `nav`, `main`, `aside`, `footer`)
- Ensure keyboard navigation works for all interactive elements
- Include `SkipToContent` as first child in `Header`
- Maintain sufficient color contrast (WCAG AA minimum)

### Performance

- Import only the components you use (tree-shaking friendly)
- Use `React.memo` for expensive list items in DataTables
- Debounce search inputs to reduce re-renders
- Use `Stack` instead of custom margin/padding for consistent spacing

### Code Organization

- Group imports by category: components, icons, utilities
- Use consistent naming conventions for event handlers
- Extract reusable component compositions into separate files
- Keep styles close to components using CSS modules or SCSS

## Storybook References

- React Storybook: https://react.carbondesignsystem.com/
- IBM Products Storybook: https://ibm-products.carbondesignsystem.com
- AI Chat Storybook: https://chat.carbondesignsystem.com/tag/latest/docs/documents/Overview.html

## Source Code

- Carbon React: https://github.com/carbon-design-system/carbon/tree/main/packages/react
- IBM Products: https://github.com/carbon-design-system/ibm-products
- Carbon AI Chat: https://github.com/carbon-design-system/carbon-ai-chat



# Carbon v11 Typography Reference

Official guidance from [Carbon Design System](https://carbondesignsystem.com/elements/typography/overview/) and [IBM Design Language](https://www.ibm.com/design/language/typography/typeface).

## Typeface: IBM Plex

IBM Plex is the open-source typeface designed for IBM's global technology needs. It comes in four subfamilies:

- **IBM Plex Sans** — primary UI typeface
- **IBM Plex Serif** — for long-form reading and quotes
- **IBM Plex Mono** — for code and technical content
- **IBM Plex Condensed** — for space-constrained layouts

### Font Stacks

```css
/* Sans-serif (default) */
font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;

/* Serif */
font-family: 'IBM Plex Serif', 'Georgia', Times, serif;

/* Mono */
font-family: 'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', Courier, monospace;
```

### Typeface Features

IBM Plex includes OpenType features such as:
- Ligatures across Sans and Serif
- Fractions
- Arrows
- Alternate glyphs
- Global currency symbols

### Language Support

IBM Plex covers over 100 languages with extended Latin versions, including Vietnamese. Non-Latin scripts include Arabic, Chinese (Simplified/Traditional), Cyrillic, Devanagari, Greek, Hebrew, Japanese, Korean, and Thai.

## Type Sets: Productive vs Expressive

Carbon manages typography through two type sets. The naming convention uses suffixes to distinguish them:

- **Productive** (`-01` suffix): Condensed treatment for product interfaces where users need to maintain focus on tasks. Uses **fixed headings** that do not change size at breakpoints. Base type size: **14px**.
- **Expressive** (`-02` suffix): Larger, more dramatic styles for editorial and marketing design. Excellent for long-form reading and scanning. Uses **responsive/fluid headings** that change size at different breakpoints. Base type size: **16px**.

### When to Use Each

#### Productive Use Cases
- Users are focused on getting a specific job done
- Interactions are active (inputs, forms, controls)
- Users are embedded within the experience, often on one page
- Success is measured by time to complete task and abandonment rate
- Space efficiency is key

#### Expressive Use Cases
- Users are trying to learn and explore, primarily scanning and reading
- Interactions are passive through imagery, layout, and long-form reading
- Users traverse a series of pages during one session
- Success is measured by click-through rates and conversions
- Larger type sizes and editorial approach aid scanning

#### Blending Type Sets

The spaces we design for are not neatly divided. Both product and web pages can blend "moments" if the alternative type set better supports the function:

- **Productive in Expressive**: Use in mega menus, search, commerce, product configuration, account creation, filter panels
- **Expressive in Productive**: Use on home pages and page headers/banners where content is not restricted to containers

> **Guideline**: Keep type styles consistent within a discrete task, component, or region. Mixing type styles within a component could jumble hierarchy and create confusion.

## Type Scale

The IBM type scale is built on a single equation:
```
Xn = Xn-1 + {INT[(n-2)/4] + 1} * 2
```
Assuming `y₀ = 12px`.

| rem | px | Usage |
|-----|-----|-------|
| 0.75 | 12 | Small captions, helper text, code |
| 0.875 | 14 | Secondary text, labels, compact body |
| 1 | 16 | Body text default |
| 1.125 | 18 | Large body, small headings |
| 1.25 | 20 | Section headers |
| 1.5 | 24 | Page headings |
| 1.75 | 28 | Display headings |
| 2 | 32 | Hero text |
| 2.25 | 36 | Large display |
| 2.625 | 42 | Marketing headlines |
| 3 | 48 | Editorial headlines |
| 3.375 | 54 | Large editorial |
| 3.75 | 60 | Display |
| 4.25 | 68 | Marketing display |
| 4.75 | 76 | Hero display |
| 5.25 | 84 | Large hero |
| 5.75 | 92 | Maximum display |

## Typography Styles

### Weights

Font weight pairs with size to create hierarchy. Suggested weights for digital experiences:

- **Light (300)** — large display text
- **Regular (400)** — body text, medium headings
- **Semibold (600)** — section headers, emphasis (avoid for long text)

> **Note**: A bold weight will always have more emphasis than a lighter weight font of the same size. However, a lighter weight font can rank hierarchically higher than a bold font if the lighter weight type size is significantly larger.

### Italic

Each weight has an italic variant. Use italic only to emphasize certain words in a sentence (titles of works, technical terms, names of devices, captions).

### Type Color Guidelines

Type color should prioritize legibility and accessibility:

- **Running text**: Keep type color neutral
- **Primary actions/links**: Use primary blue (`$text-link-primary` / `$interactive`)
- **Secondary actions**: Use Gray 100 (`$text-secondary`)
- **Code snippets, warnings, alerts**: Use colored type sparingly for semantic meaning
- **Decorative color**: Avoid using color for decoration in text

## Style Pairings

### Productive Pairings
- `body-compact-01` + `heading-compact-01`
- `body-01` + `heading-01`

### Expressive Pairings
- `body-compact-02` + `heading-compact-02`
- `body-02` + `heading-02`

## Complete Token Reference

### Utility Styles

| Token | Type Set | Size | Line Height | Weight | Letter Spacing |
|-------|----------|------|-------------|--------|----------------|
| `code-01` | Productive | 12px / .75rem | 16px / 1rem | 400 | .32px |
| `code-02` | Expressive | 14px / .875rem | 20px / 1.25rem | 400 | .32px |
| `label-01` | Productive | 12px / .75rem | 16px / 1rem | 400 | .32px |
| `label-02` | Expressive | 14px / .875rem | 18px / 1.125rem | 400 | .16px |
| `helper-text-01` | Productive | 12px / .75rem | 16px / 1rem | 400 | .32px |
| `helper-text-02` | Expressive | 14px / .875rem | 18px / 1.125rem | 400 | .16px |
| `legal-01` | Productive | 12px / .75rem | 16px / 1rem | 400 | .32px |
| `legal-02` | Expressive | 14px / .875rem | 18px / 1.125rem | 400 | .16px |

### Body Styles

| Token | Type Set | Size | Line Height | Weight | Letter Spacing |
|-------|----------|------|-------------|--------|----------------|
| `body-compact-01` | Productive | 14px / .875rem | 18px / 1.125rem | 400 | .16px |
| `body-compact-02` | Expressive | 16px / 1rem | 22px / 1.375rem | 400 | 0px |
| `body-01` | Productive | 14px / .875rem | 20px / 1.25rem | 400 | .16px |
| `body-02` | Expressive | 16px / 1rem | 24px / 1.5rem | 400 | 0px |

### Fixed Heading Styles

| Token | Type Set | Size | Line Height | Weight | Letter Spacing |
|-------|----------|------|-------------|--------|----------------|
| `heading-compact-01` | Productive | 14px / .875rem | 18px / 1.125rem | 600 | .16px |
| `heading-compact-02` | Expressive | 16px / 1rem | 22px / 1.375rem | 600 | 0px |
| `heading-01` | Productive | 14px / .875rem | 20px / 1.25rem | 600 | .16px |
| `heading-02` | Expressive | 16px / 1rem | 24px / 1.5rem | 600 | 0px |
| `heading-03` | Productive | 20px / 1.25rem | 28px / 1.75rem | 400 | 0px |
| `heading-04` | Productive | 28px / 1.75rem | 36px / 2.25rem | 400 | 0px |
| `heading-05` | Productive | 32px / 2rem | 40px / 2.5rem | 400 | 0px |
| `heading-06` | Productive | 42px / 2.625rem | 50px / 3.125rem | 300 | 0px |
| `heading-07` | Productive | 54px / 3.375rem | 64px / 4rem | 300 | 0px |

### Fluid Heading Styles (Expressive Only)

| Token | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|----------------|
| `fluid-heading-03` | 20px / 1.25rem | 28px / 1.75rem | 400 | 0px |
| `fluid-heading-04` | 28px / 1.75rem | 36px / 2.25rem | 400 | 0px |
| `fluid-heading-05` | 42px / 2.625rem | 50px / 3.125rem | 300 | 0px |
| `fluid-heading-06` | 42px / 2.625rem | 50px / 3.125rem | 600 | 0px |

### Fluid Display Styles (Expressive Only)

| Token | Type | Size | Line Height | Weight | Letter Spacing |
|-------|------|------|-------------|--------|----------------|
| `fluid-paragraph-01` | Sans | 28px / 1.75rem | 36px / 2.25rem | 300 | 0px |
| `fluid-quotation-01` | Serif | 24px / 1.5rem | 30px / 1.875rem | 400 | 0px |
| `fluid-quotation-02` | Serif | 42px / 2.625rem | 50px / 3.125rem | 300 | 0px |
| `fluid-display-01` | Sans | 54px / 3.375rem | 64px / 4rem | 300 | 0px |
| `fluid-display-02` | Sans | 54px / 3.375rem | 64px / 4rem | 600 | 0px |
| `fluid-display-03` | Sans | 60px / 3.75rem | 70px / 4.375rem | 300 | -.64px |
| `fluid-display-04` | Sans | 92px / 5.75rem | 102px / 6.375rem | 300 | -.64px |

### Code Styles

| Token | Family | Size | Line Height | Weight |
|-------|--------|------|-------------|--------|
| `code-01` | IBM Plex Mono | 12px / .75rem | 16px / 1rem | 400 |
| `code-02` | IBM Plex Mono | 14px / .875rem | 20px / 1.25rem | 400 |

## React Component Usage

```tsx
import { Typography } from '@carbon/react';

// Productive (default)
<Typography as="h1">Heading</Typography>
<Typography as="p" className="body-01">Body text</Typography>

// Expressive
<Typography as="h1" className="heading-02">Expressive heading</Typography>
<Typography as="p" className="body-02">Expressive body</Typography>

// Specific tokens
<Typography as="span" className="label-01">Label</Typography>
<Typography as="p" className="helper-text-01">Helper text</Typography>
<Typography as="code" className="code-01">const x = 1;</Typography>
```

### Dynamic Type Set Switching

```tsx
import { useMode } from '@carbon/react';

function MyComponent() {
  const { mode } = useMode();
  const className = mode === 'expressive' ? 'body-02' : 'body-01';
  
  return <Typography as="p" className={className}>Content</Typography>;
}
```

## Accessibility Notes

- Maintain sufficient color contrast for text (WCAG AA: 4.5:1 for normal text, 3:1 for large text)
- Use semantic HTML elements (`<h1>`-`<h6>`, `<p>`, `<span>`) with Carbon typography classes
- Avoid using color alone to convey meaning in text
- Use `lang` attributes for non-Latin scripts
- IBM Plex supports over 100 languages

## Resources

- [IBM Plex on GitHub](https://github.com/IBM/plex/releases/latest)
- [IBM Plex website](https://www.ibm.com/plex/)
- [IBM Plex on Google Fonts](https://fonts.google.com/?query=ibm+plex)
- [IBM Plex on Adobe Fonts](https://www.adobe.com/foundries/ibm)
- [Carbon Type package](https://github.com/carbon-design-system/carbon/tree/main/packages/type)



# Advanced & AI Components

## IBM Products (`@carbon/ibm-products`)

Extended Carbon-powered components for IBM product teams.

### Installation

```bash
npm install @carbon/ibm-products @carbon/ibm-products-web-components
```

### Key Components

- `ProductSideNav` - Enhanced side navigation
- `ProductHeader` - Product-specific header
- `ProductTabs` - Tab navigation for product sections
- `ProductModal` - Enhanced modal dialogs
- `ProductTable` - Advanced data table with product-specific features
- `ProductTile` - Enhanced tile components

### Usage Example

```tsx
import { ProductSideNav, ProductHeader } from '@carbon/ibm-products';

<ProductHeader
  aria-label="Product Name"
  headerName="Product Name"
  headerNavigation={<ProductNavigation />}
/>
```

### Storybook

Interactive demos: https://ibm-products.carbondesignsystem.com

## Carbon AI Chat (`carbon-ai-chat`)

AI-powered chat interface components.

### Installation

```bash
npm install @carbon/ai-chat @carbon/ai-chat-react
```

### Key Components

- `AiChat` - Main chat container
- `AiMessage` - Message bubble component
- `AiInput` - Chat input with suggestions
- `AiSuggestion` - Suggested prompts
- `AiTypingIndicator` - Loading state for AI responses

### Usage Example

```tsx
import { AiChat, AiMessage, AiInput } from '@carbon/ai-chat-react';

<AiChat
  messages={messages}
  onSendMessage={handleSend}
  isLoading={isLoading}
  suggestions={suggestions}
>
  {messages.map(msg => (
    <AiMessage key={msg.id} message={msg} />
  ))}
  <AiInput onSubmit={handleSend} placeholder="Ask a question..." />
</AiChat>
```

### React Component

```tsx
import { AiChatContainer, AiChatMessage, AiChatInput } from '@carbon/ai-chat-react';

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <AiChatContainer>
      {messages.map(message => (
        <AiChatMessage key={message.id} message={message} />
      ))}
      <AiChatInput onSend={handleSend} />
    </AiChatContainer>
  );
};
```

## Carbon Charts (`@carbon/charts`)

Data visualization components.

### Installation

```bash
npm install @carbon/charts @carbon/charts-react
```

### Supported Chart Types

- BarChart, HorizontalBarChart
- LineChart, AreaChart
- ScatterChart, BubbleChart
- PieChart, DonutChart
- RadarChart
- GaugeChart
- HeatmapChart
- TreemapChart
- SankeyChart

### Usage Example

```tsx
import { BarChart } from '@carbon/charts-react';

const data = [
  { group: 'Q1', value: 100 },
  { group: 'Q2', value: 200 },
  { group: 'Q3', value: 150 },
  { group: 'Q4', value: 300 },
];

const options = {
  title: 'Quarterly Sales',
  axes: {
    left: { mapsTo: 'value' },
    bottom: { mapsTo: 'group' },
  },
  color: {
    scale: {
      Q1: '#0f62fe',
      Q2: '#4589ff',
      Q3: '#78a9ff',
      Q4: '#a6c8ff',
    },
  },
};

<BarChart data={data} options={options} />
```

### Chart Options

```tsx
const options = {
  title: 'Chart Title',
  axes: {
    left: { mapsTo: 'value', title: 'Value' },
    bottom: { mapsTo: 'category', title: 'Category' },
  },
  legend: { enabled: true },
  tooltip: { enabled: true },
  color: {
    scale: {
      category1: '#0f62fe',
      category2: '#24a148',
    },
  },
  height: '400px',
};
```

## Data Visualization Colors

Use Carbon's data visualization color palettes:

```tsx
const colorScale = {
  category1: '#0f62fe', // blue-60
  category2: '#24a148', // green-50
  category3: '#da1e28', // red-60
  category4: '#8a3ffc', // purple-60
  category5: '#007d79', // teal-60
  category6: '#f1c21b', // yellow-40
};
```

## Axes & Labels Guidelines

- Use clear, descriptive axis labels
- Maintain consistent units
- Use appropriate number formatting
- Ensure sufficient contrast for text elements
- Follow Carbon spacing tokens for label positioning
