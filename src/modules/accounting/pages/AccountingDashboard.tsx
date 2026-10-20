import React, { useState } from 'react';
import { 
  Tabs, TabList, Tab, TabPanels, TabPanel,
  DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell,
  Grid, Column, InlineNotification, Stack, TextInput, NumberInput
} from '@carbon/react';
import { Receipt, DocumentExport, Checkmark } from '@carbon/icons-react';
import { useTranslation } from 'react-i18next';
import { PageHeader, MetricCard, SidePanel } from '../../../shared/components/ibm-products';

const mockLedger = [
  { id: 'TXN-001', date: '2026-09-06 08:30', account: '1010 Cash on Hand', debit: 150.00, credit: 0, description: 'Cash Sale #1042' },
  { id: 'TXN-002', date: '2026-09-06 08:30', account: '4010 Retail Sales', debit: 0, credit: 130.43, description: 'Cash Sale #1042' },
  { id: 'TXN-003', date: '2026-09-06 08:30', account: '2010 VAT Payable', debit: 0, credit: 19.57, description: 'VAT (15%)' },
  { id: 'TXN-004', date: '2026-09-06 09:15', account: '1020 Mada Clearing', debit: 45.00, credit: 0, description: 'Card Sale #1043' },
  { id: 'TXN-005', date: '2026-09-06 09:15', account: '4010 Retail Sales', debit: 0, credit: 39.13, description: 'Card Sale #1043' },
  { id: 'TXN-006', date: '2026-09-06 09:15', account: '2010 VAT Payable', debit: 0, credit: 5.87, description: 'VAT (15%)' },
];

const headers = [
  { key: 'date', header: 'Date & Time' },
  { key: 'id', header: 'Transaction ID' },
  { key: 'account', header: 'GL Account' },
  { key: 'description', header: 'Description' },
  { key: 'debit', header: 'Debit' },
  { key: 'credit', header: 'Credit' },
];

export default function AccountingDashboard() {
  const { t } = useTranslation();
  const [isZReportOpen, setIsZReportOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [openingFloat, setOpeningFloat] = useState(200.00);
  const [countedCash, setCountedCash] = useState(1450.00);

  const handleConfirmZReport = () => {
    setIsZReportOpen(false);
    setNotification('End-of-Day Z-Report successfully generated and fiscal register closed.');
  };

  return (
    <>
      <PageHeader
        title="Accounting & General Ledger"
        subtitle="Manage double-entry fiscal journals, GL balances, ZATCA tax liabilities, and Z-Reports."
        breadcrumbs={[
          { label: 'IBM POS', href: '#/pos' },
          { label: 'Enterprise' },
          { label: 'Fiscal Accounting' }
        ]}
        tags={[
          { label: 'ZATCA VAT 15%', type: 'green' },
          { label: 'Double-Entry Ledger', type: 'blue' }
        ]}
        actionButtons={[
          {
            label: 'Generate Z-Report (End of Day)',
            kind: 'primary',
            renderIcon: Receipt,
            onClick: () => setIsZReportOpen(true)
          }
        ]}
      />

      <div style={{ padding: '2rem' }}>
        <Stack gap={6}>
          {notification && (
            <InlineNotification
              kind="success"
              title="Fiscal Reconciliation Completed"
              subtitle={notification}
              onCloseButtonClick={() => setNotification(null)}
            />
          )}

          {/* IBM Products Metric Cards */}
          <Grid fullWidth style={{ padding: 0 }}>
            <Column sm={4} md={2} lg={4}>
              <MetricCard
                title="Cash on Hand (1010)"
                value="$1,250.00"
                subtitle="Drawer Balance"
                status="success"
              />
            </Column>
            <Column sm={4} md={2} lg={4}>
              <MetricCard
                title="Mada / Card Clearing (1020)"
                value="$3,420.50"
                subtitle="Terminal POS Batch"
                trend="up"
                trendValue="+14.2%"
              />
            </Column>
            <Column sm={4} md={2} lg={4}>
              <MetricCard
                title="VAT Payable (2010)"
                value="$609.20"
                subtitle="15% ZATCA Output Tax"
              />
            </Column>
            <Column sm={4} md={2} lg={4}>
              <MetricCard
                title="Gross Sales Revenue (4010)"
                value="$4,061.30"
                subtitle="Total Today"
                trend="up"
                trendValue="+18.5%"
              />
            </Column>
          </Grid>

          <Tabs>
            <TabList aria-label="Accounting Tabs">
              <Tab>General Ledger</Tab>
              <Tab>Expenses & Petty Cash</Tab>
              <Tab>Z-Reports Archive</Tab>
            </TabList>
            <TabPanels>
              <TabPanel style={{ padding: '1rem 0' }}>
                <DataTable rows={mockLedger} headers={headers}>
                  {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
                    <TableContainer title="Double-Entry Journal" description="Real-time automated transaction allocations.">
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
                                {row.cells.map((cell) => {
                                  if (cell.info.header === 'debit' || cell.info.header === 'credit') {
                                    return (
                                      <TableCell key={cell.id}>
                                        {cell.value > 0 ? `$${cell.value.toFixed(2)}` : '-'}
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
                    </TableContainer>
                  )}
                </DataTable>
              </TabPanel>
              <TabPanel style={{ padding: '1rem 0' }}>
                <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                  Petty cash receipts and store expense logging are tracked and balanced here.
                </p>
              </TabPanel>
              <TabPanel style={{ padding: '1rem 0' }}>
                <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                  Historical Z-Report ZATCA XML exports and daily audit hashes are archived here.
                </p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </div>

      {/* IBM Products SidePanel for Z-Report */}
      <SidePanel
        open={isZReportOpen}
        onRequestClose={() => setIsZReportOpen(false)}
        title="Generate End-of-Day Z-Report"
        subtitle="Reconcile drawer cash, verify Mada card totals, and lock daily register."
        primaryButtonText="Confirm & Close Register"
        secondaryButtonText="Cancel"
        onPrimaryAction={handleConfirmZReport}
        onSecondaryAction={() => setIsZReportOpen(false)}
      >
        <Stack gap={5} style={{ paddingTop: '1rem' }}>
          <NumberInput
            id="opening-float"
            label="Opening Till Float ($)"
            value={openingFloat}
            onChange={(_, { value }) => setOpeningFloat(Number(value))}
            readOnly
          />
          <NumberInput
            id="counted-cash"
            label="Physical Counted Cash ($)"
            value={countedCash}
            onChange={(_, { value }) => setCountedCash(Number(value))}
            min={0}
            step={10}
          />
          <TextInput
            id="z-notes"
            labelText="Fiscal Audit Notes"
            placeholder="e.g. Terminal drawer verified with zero variance."
          />
        </Stack>
      </SidePanel>
    </>
  );
}

