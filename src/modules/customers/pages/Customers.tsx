import React, { useState } from 'react';
import {
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
  OverflowMenuItem,
  Button,
  Stack,
  Grid,
  Column,
  TextInput,
  Select,
  SelectItem,
  Form
} from '@carbon/react';
import { Add, UserMultiple, UserAvatar, Star, Tag as TagIcon, Filter, Settings, Download, TrashCan, Save } from '@carbon/icons-react';
import { mockCustomers, Customer } from '../data/mockCustomers';
import { PageHeader, MetricCard, SidePanel } from '../../../shared/components/ibm-products';

const headers = [
  { key: 'name', header: 'Name / Company' },
  { key: 'type', header: 'Client Type' },
  { key: 'crNumber', header: 'CR / VAT No.' },
  { key: 'phone', header: 'Phone Number' },
  { key: 'email', header: 'Email' },
  { key: 'loyaltyPoints', header: 'Loyalty Points' },
  { key: 'creditTerm', header: 'Credit Term' },
];

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerType, setNewCustomerType] = useState<'B2C' | 'B2B'>('B2C');
  const [newCustomerCR, setNewCustomerCR] = useState('');

  const filteredCustomers = customers.filter(customer => {
    const query = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query)
    );
  });

  const totalCustomers = customers.length;
  const b2bCount = customers.filter(c => c.type === 'B2B').length;
  const b2cCount = customers.filter(c => c.type === 'B2C').length;
  const totalPoints = customers.reduce((acc, c) => acc + (c.loyaltyPoints || 0), 0);

  const handleCreateCustomer = () => {
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) return;
    const newEntry: Customer = {
      id: `CUST-${Date.now()}`,
      name: newCustomerName,
      phone: newCustomerPhone,
      email: newCustomerEmail || 'N/A',
      type: newCustomerType,
      crNumber: newCustomerCR || undefined,
      loyaltyPoints: 100, // Welcome points
      creditTerm: newCustomerType === 'B2B' ? 'Net 30' : 'Immediate'
    };
    setCustomers([newEntry, ...customers]);
    setIsAddPanelOpen(false);
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewCustomerEmail('');
    setNewCustomerCR('');
  };

  const rows = filteredCustomers.map(customer => ({
    id: customer.id,
    name: customer.name,
    type: customer.type === 'B2B' ? 'B2B Corporate' : 'B2C Retail',
    crNumber: customer.crNumber || '-',
    phone: customer.phone,
    email: customer.email,
    loyaltyPoints: customer.loyaltyPoints,
    creditTerm: customer.creditTerm || 'Immediate',
  }));

  return (
    <>
      <PageHeader
        title="Customers Directory"
        subtitle="Manage customer relationships, credit terms, and loyalty profiles."
        breadcrumbs={[
          { label: 'IBM POS', href: '#/pos' },
          { label: 'CRM & Loyalty' },
          { label: 'Directory' }
        ]}
        tags={[
          { label: 'ZATCA Compliance Ready', type: 'green' },
          { label: 'B2B & B2C Accounts', type: 'blue' }
        ]}
        actionButtons={[
          {
            label: 'Add Customer',
            kind: 'primary',
            renderIcon: Add,
            onClick: () => setIsAddPanelOpen(true)
          }
        ]}
      />

      <div style={{ padding: '2rem' }}>
        <Stack gap={6}>
          {/* IBM Products Metric Cards */}
          <Grid fullWidth style={{ padding: 0 }}>
            <Column sm={4} md={2} lg={4}>
              <MetricCard
                title="Total Accounts"
                value={totalCustomers.toString()}
                subtitle="Registered Clients"
                trend="up"
                trendValue="+12%"
              />
            </Column>
            <Column sm={4} md={2} lg={4}>
              <MetricCard
                title="B2B Corporate Accounts"
                value={b2bCount.toString()}
                subtitle="VAT / CR Validated"
                status="success"
              />
            </Column>
            <Column sm={4} md={2} lg={4}>
              <MetricCard
                title="B2C Retail Clients"
                value={b2cCount.toString()}
                subtitle="Walk-in & Loyalty"
              />
            </Column>
            <Column sm={4} md={2} lg={4}>
              <MetricCard
                title="Total Loyalty Points"
                value={totalPoints.toLocaleString()}
                subtitle="Active Balance"
                trend="up"
                trendValue="+5.4%"
              />
            </Column>
          </Grid>

          <DataTable rows={rows} headers={headers} isSortable>
            {({
              rows,
              headers,
              getHeaderProps,
              getRowProps,
              getTableProps,
              getTableContainerProps,
              getBatchActionProps,
              getSelectionProps,
              selectedRows
            }: any) => {
              const batchActionProps = getBatchActionProps();
              return (
                <TableContainer
                  title="All Customers"
                  description="View and search registered clients."
                  {...getTableContainerProps()}
                >
                  <TableToolbar>
                    <TableBatchActions {...batchActionProps}>
                      <TableBatchAction
                        renderIcon={TrashCan}
                        onClick={() => {
                          const selectedIds = new Set(selectedRows.map((r: any) => r.id));
                          setCustomers(prev => prev.filter(c => !selectedIds.has(c.id)));
                        }}
                      >
                        Delete
                      </TableBatchAction>
                      <TableBatchAction
                        renderIcon={Save}
                        onClick={() => alert(`Exported ${selectedRows.length} customer records.`)}
                      >
                        Export
                      </TableBatchAction>
                    </TableBatchActions>
                    <TableToolbarContent>
                      <TableToolbarSearch
                        value={searchQuery}
                        onChange={(e: any) => setSearchQuery(e?.target?.value ?? '')}
                        placeholder="Filter by name or phone number..."
                        persistent
                      />
                      <TableToolbarMenu iconDescription="Settings & Overflow Menu">
                        <OverflowMenuItem
                          itemText="Export B2B Corporate Clients"
                          onClick={() => alert('Exporting B2B client list...')}
                        />
                        <OverflowMenuItem
                          itemText="Print Customer Directory"
                          onClick={() => window.print()}
                        />
                        <OverflowMenuItem
                          itemText="Bulk Loyalty Allocation"
                          onClick={() => alert('Loyalty point batch tool triggered.')}
                        />
                      </TableToolbarMenu>
                      <TableToolbarAction
                        aria-label="Filter B2B / B2C"
                        title="Filter B2B / B2C"
                        onClick={() => alert('Filtering by client type')}
                      >
                        <Filter size={16} />
                      </TableToolbarAction>
                      <TableToolbarAction
                        aria-label="Table Column Settings"
                        title="Table Column Settings"
                        onClick={() => alert('Column settings opened')}
                      >
                        <Settings size={16} />
                      </TableToolbarAction>
                      <Button
                        kind="primary"
                        size="sm"
                        renderIcon={Add}
                        onClick={() => setIsAddPanelOpen(true)}
                      >
                        Add Customer
                      </Button>
                    </TableToolbarContent>
                  </TableToolbar>
                  <Table {...getTableProps()}>
                    <TableHead>
                      <TableRow>
                        <TableSelectAll {...getSelectionProps()} />
                        {headers.map((header: any) => {
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
                      {rows.map((row: any) => {
                        const { key, ...rowProps } = getRowProps({ row });
                        return (
                          <TableRow key={key} {...rowProps}>
                            <TableSelectRow {...getSelectionProps({ row })} />
                            {row.cells.map((cell: any) => {
                            if (cell.info.header === 'type') {
                              return (
                                <TableCell key={cell.id}>
                                  <span style={{ 
                                    padding: '0.2rem 0.5rem', 
                                    backgroundColor: cell.value === 'B2B Corporate' ? 'var(--cds-support-info)' : 'var(--cds-layer-selected)',
                                    color: cell.value === 'B2B Corporate' ? 'white' : 'inherit',
                                    fontSize: '12px',
                                    borderRadius: '2px'
                                  }}>
                                    {cell.value}
                                  </span>
                                </TableCell>
                              );
                            }
                            return <TableCell key={cell.id}>{cell.value}</TableCell>;
                          })}
                        </TableRow>
                      );
                    })}
                    {rows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={headers.length} style={{ textAlign: 'center', padding: '2rem' }}>
                          No customers found matching "{searchQuery}"
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              );
            }}
          </DataTable>
        </Stack>
      </div>

      {/* IBM Products SidePanel for Adding Customer */}
      <SidePanel
        open={isAddPanelOpen}
        onRequestClose={() => setIsAddPanelOpen(false)}
        title="Add New Customer"
        subtitle="Register a B2B corporate account or B2C retail client."
        primaryButtonText="Save Customer"
        secondaryButtonText="Cancel"
        onPrimaryAction={handleCreateCustomer}
        onSecondaryAction={() => setIsAddPanelOpen(false)}
      >
        <Stack gap={5} style={{ paddingTop: '1rem' }}>
          <TextInput
            id="cust-name"
            labelText="Full Name / Company Name"
            placeholder="e.g. Acme Corp or John Doe"
            value={newCustomerName}
            onChange={(e) => setNewCustomerName(e.target.value)}
            required
          />
          <TextInput
            id="cust-phone"
            labelText="Phone Number"
            placeholder="+966 50 123 4567"
            value={newCustomerPhone}
            onChange={(e) => setNewCustomerPhone(e.target.value)}
            required
          />
          <TextInput
            id="cust-email"
            labelText="Email Address"
            placeholder="client@domain.com"
            value={newCustomerEmail}
            onChange={(e) => setNewCustomerEmail(e.target.value)}
          />
          <Select
            id="cust-type"
            labelText="Account Type"
            value={newCustomerType}
            onChange={(e) => setNewCustomerType(e.target.value as 'B2C' | 'B2B')}
          >
            <SelectItem value="B2C" text="B2C Retail Client" />
            <SelectItem value="B2B" text="B2B Corporate Client" />
          </Select>
          {newCustomerType === 'B2B' && (
            <TextInput
              id="cust-cr"
              labelText="Commercial Registration (CR) / Tax Registration No."
              placeholder="e.g. 1010123456"
              value={newCustomerCR}
              onChange={(e) => setNewCustomerCR(e.target.value)}
            />
          )}
        </Stack>
      </SidePanel>
    </>
  );
}

