import React, { useState } from 'react';
import { 
  DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell,
  Button, Dropdown, Tag
} from '@carbon/react';
import { DataBase, Switcher, Receipt } from '@carbon/icons-react';
import { useTranslation } from 'react-i18next';
import { useReceiptTemplate } from '../../settings/context/ReceiptTemplateContext';

const branches = [
  { id: 'BR-001', name: 'Riyadh Flagship', status: 'Active', stockValue: '$45,200', online: true },
  { id: 'BR-002', name: 'Jeddah Mall of Arabia', status: 'Active', stockValue: '$32,100', online: true },
  { id: 'BR-003', name: 'Khobar Corniche', status: 'Active', stockValue: '$28,450', online: false },
  { id: 'BR-004', name: 'Dubai Mall', status: 'Active', stockValue: '$51,800', online: true },
];

const headers = [
  { key: 'id', header: 'Branch ID' },
  { key: 'name', header: 'Branch Name' },
  { key: 'status', header: 'Status' },
  { key: 'online', header: 'Connection' },
  { key: 'stockValue', header: 'Est. Stock Value' },
  { key: 'receiptTemplate', header: 'Receipt Branding' },
];

export default function BranchManager() {
  const { t } = useTranslation();
  const { openCustomizationModal, activeBranchId, setActiveBranchId } = useReceiptTemplate();
  const [selectedBranch, setSelectedBranch] = useState(activeBranchId);
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="heading-05">Multi-Store & Central Stock Matrix</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <Dropdown 
            id="active-branch" 
            titleText="Active Context"
            label={branches.find(b => b.id === selectedBranch)?.name || 'Riyadh Flagship'}
            items={branches.map(b => b.name)}
            selectedItem={branches.find(b => b.id === selectedBranch)?.name}
            onChange={({ selectedItem }) => {
              const matched = branches.find(b => b.name === selectedItem);
              if (matched) setSelectedBranch(matched.id);
            }}
            size="md"
          />
          <Button 
            renderIcon={Switcher} 
            iconDescription="Switch Branch"
            onClick={() => setActiveBranchId(selectedBranch)}
          >
            Set Active Store
          </Button>
          <Button 
            kind="secondary"
            renderIcon={Receipt} 
            iconDescription="Receipt Template Customization"
            onClick={() => openCustomizationModal(selectedBranch)}
          >
            Receipt Templates
          </Button>
        </div>
      </div>

      <DataTable rows={branches} headers={headers}>
        {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
          <TableContainer title="Corporate Branches" description="Overview of all registered branches, connection status, and receipt branding templates.">
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
                      if (cell.info.header === 'online') {
                        return (
                          <TableCell key={cell.id}>
                            <span style={{ color: cell.value ? 'var(--cds-support-success)' : 'var(--cds-support-error)', fontWeight: 'bold' }}>
                              {cell.value ? 'Online' : 'Offline'}
                            </span>
                          </TableCell>
                        );
                      }
                      if (cell.info.header === 'receiptTemplate') {
                        return (
                          <TableCell key={cell.id}>
                            <Button 
                              kind="ghost" 
                              size="sm" 
                              renderIcon={Receipt} 
                              iconDescription="Customize Branch Template"
                              onClick={() => openCustomizationModal(row.id)}
                            >
                              Edit Template
                            </Button>
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
    </div>
  );
}
