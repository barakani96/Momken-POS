import React, { useState, useMemo } from 'react';
import {
  Stack,
  Search,
  ContentSwitcher,
  Switch,
  Tag,
  TextInput,
  NumberInput,
  Select,
  SelectItem,
  InlineNotification,
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
  Grid,
  Column,
  Button,
  Modal
} from '@carbon/react';
import {
  Add,
  Barcode as BarcodeIcon,
  Search as SearchIcon,
  Filter,
  Settings,
  Download,
  TrashCan,
  Save
} from '@carbon/icons-react';
import { mockProducts as initialProducts, Product } from '../data/mockProducts';
import { PageHeader, MetricCard, SidePanel } from '../../../shared/components/ibm-products';

const tableHeaders = [
  { key: 'id', header: 'SKU / ID' },
  { key: 'barcode', header: 'Barcode' },
  { key: 'name', header: 'Product Name' },
  { key: 'category', header: 'Category' },
  { key: 'price', header: 'Unit Price' },
  { key: 'stock', header: 'Inventory Stock' }
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('catalog_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New Product Form State
  const [newSku, setNewSku] = useState('');
  const [newBarcode, setNewBarcode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Coffee');
  const [newPrice, setNewPrice] = useState<number>(4.00);
  const [newStock, setNewStock] = useState<number>(30);

  const handleOpenCreateModal = () => {
    const autoSku = `PRD-${Date.now().toString().slice(-4)}`;
    const autoBarcode = `123456${Math.floor(100000 + Math.random() * 900000)}`;
    setNewSku(autoSku);
    setNewBarcode(autoBarcode);
    setNewName('');
    setNewCategory('Coffee');
    setNewPrice(4.00);
    setNewStock(30);
    setIsCreateOpen(true);
  };

  const handleCreateProduct = () => {
    if (!newName.trim() || !newPrice) return;
    const newProduct: Product = {
      id: newSku.trim() || `PRD-${Date.now().toString().slice(-4)}`,
      barcode: newBarcode.trim() || `123456${Math.floor(100000 + Math.random() * 900000)}`,
      name: newName.trim(),
      category: newCategory,
      price: Number(newPrice),
      stock: Number(newStock)
    };

    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('catalog_products', JSON.stringify(updated));
    setNotification(`Successfully created product "${newProduct.name}" (SKU: ${newProduct.id})`);
    setIsCreateOpen(false);
  };

  // Filtered rows for DataTable
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.barcode.includes(searchQuery) ||
                            p.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const rows = useMemo(() => {
    return filteredProducts.map(p => ({
      id: p.id,
      barcode: p.barcode,
      name: p.name,
      category: p.category,
      price: `$${Number(p.price).toFixed(2)}`,
      stock: `${p.stock ?? 25} units`
    }));
  }, [filteredProducts]);

  const totalSKUs = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock ?? 25), 0);
  const categoriesCount = new Set(products.map(p => p.category)).size;

  return (
    <>
      <PageHeader
        title="Products Catalog"
        subtitle="Manage enterprise multi-store SKUs, barcodes, and inventory pricing across retail branches."
        breadcrumbs={[
          { label: 'IBM POS', href: '#/pos' },
          { label: 'Inventory & Commerce' },
          { label: 'Product Catalog' }
        ]}
        tags={[
          { label: 'Multi-Store Catalog', type: 'blue' },
          { label: 'Barcoded SKUs', type: 'cool-gray' }
        ]}
        actionButtons={[
          {
            label: 'Add Product',
            kind: 'primary',
            renderIcon: Add,
            onClick: handleOpenCreateModal
          }
        ]}
      />

      <div style={{ padding: '2rem' }}>
        <Stack gap={6}>
          {notification && (
            <InlineNotification
              kind="success"
              title="Catalog Updated"
              subtitle={notification}
              onCloseButtonClick={() => setNotification(null)}
            />
          )}

          {/* IBM Products Metric Cards */}
          <Grid fullWidth style={{ padding: 0 }}>
            <Column sm={4} md={2} lg={4}>
              <MetricCard
                title="Total SKUs"
                value={totalSKUs.toString()}
                subtitle="Active Catalog Items"
              />
            </Column>
            <Column sm={4} md={2} lg={4}>
              <MetricCard
                title="Total Inventory Units"
                value={totalStockUnits.toLocaleString()}
                subtitle="Stock across branches"
                trend="up"
                trendValue="+8.2%"
              />
            </Column>
            <Column sm={4} md={2} lg={4}>
              <MetricCard
                title="Product Categories"
                value={categoriesCount.toString()}
                subtitle="Active Departments"
              />
            </Column>
            <Column sm={4} md={2} lg={4}>
              <MetricCard
                title="Barcode Scanner Status"
                value="Synced"
                subtitle="Web Serial Barcode Bridge"
                status="success"
              />
            </Column>
          </Grid>

          {/* Filtering and Search Controls */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ minWidth: '320px', flex: '1 1 320px' }}>
              <Search
                id="catalog-search"
                size="lg"
                labelText="Search Catalog"
                placeholder="Search products by SKU, name, or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <ContentSwitcher
                onChange={(e) => setSelectedCategory(String(e.name))}
                selectedIndex={0}
              >
                <Switch name="All" text="All Categories" />
                <Switch name="Coffee" text="Coffee" />
                <Switch name="Pastries" text="Pastries" />
                <Switch name="Beverages" text="Beverages" />
              </ContentSwitcher>
            </div>
          </div>

          {/* Carbon DataTable */}
          {rows.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4rem 2rem',
              backgroundColor: 'var(--cds-layer-01)',
              border: '1px solid var(--cds-border-subtle)',
              textAlign: 'center'
            }}>
              <SearchIcon size={48} style={{ color: 'var(--cds-icon-secondary)', marginBottom: '1rem' }} />
              <h3 className="heading-03" style={{ marginBottom: '0.5rem' }}>No matching products found</h3>
              <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                No catalog items match "{searchQuery}" in category "{selectedCategory}".
              </p>
              <Button
                kind="tertiary"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <DataTable rows={rows} headers={tableHeaders} isSortable>
              {({
                rows,
                headers,
                getHeaderProps,
                getRowProps,
                getTableProps,
                getTableContainerProps,
                getSelectionProps,
                getBatchActionProps,
                onInputChange,
                selectedRows
              }: any) => {
                const batchActionProps = getBatchActionProps();
                return (
                  <TableContainer title="Catalog Inventory" description="Live multi-branch pricing & inventory table." {...getTableContainerProps()}>
                    <TableToolbar>
                      <TableBatchActions {...batchActionProps}>
                        <TableBatchAction
                          renderIcon={TrashCan}
                          onClick={() => {
                            const selectedIds = new Set(selectedRows.map((r: any) => r.id));
                            setProducts(prev => prev.filter(p => !selectedIds.has(p.id)));
                            setNotification(`Deleted ${selectedRows.length} catalog items`);
                          }}
                        >
                          Delete Selected
                        </TableBatchAction>
                        <TableBatchAction
                          renderIcon={Save}
                          onClick={() => {
                            setNotification(`Exported ${selectedRows.length} catalog items to CSV`);
                          }}
                        >
                          Export CSV
                        </TableBatchAction>
                      </TableBatchActions>
                      <TableToolbarContent>
                        <TableToolbarSearch
                          onChange={onInputChange}
                          placeholder="Search product SKUs, barcodes, or names..."
                          persistent
                        />
                        <TableToolbarMenu iconDescription="Overflow actions menu">
                          <OverflowMenuItem
                            itemText="Export All to CSV"
                            onClick={() => setNotification('Exporting full catalog dataset...')}
                          />
                          <OverflowMenuItem
                            itemText="Print Barcode Labels"
                            onClick={() => window.print()}
                          />
                          <OverflowMenuItem
                            itemText="Re-sync RFID Tags"
                            onClick={() => setNotification('RFID tag sync initiated across branches.')}
                          />
                        </TableToolbarMenu>
                        <TableToolbarAction
                          aria-label="Filter Category"
                          title="Filter Category"
                          onClick={() => setNotification('Active Category: ' + selectedCategory)}
                        >
                          <Filter size={16} />
                        </TableToolbarAction>
                        <TableToolbarAction
                          aria-label="Column Display Settings"
                          title="Column Display Settings"
                          onClick={() => setNotification('Column configuration menu opened.')}
                        >
                          <Settings size={16} />
                        </TableToolbarAction>
                        <TableToolbarAction
                          aria-label="Download Catalog Data"
                          title="Download Catalog Data"
                          onClick={() => setNotification('Catalog JSON data download started.')}
                        >
                          <Download size={16} />
                        </TableToolbarAction>
                        <Button
                          kind="primary"
                          size="sm"
                          renderIcon={Add}
                          onClick={handleOpenCreateModal}
                        >
                          Add Product
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
                            if (cell.info.header === 'id') {
                              return (
                                <TableCell key={cell.id}>
                                  <span style={{ fontFamily: 'var(--cds-font-family-mono, monospace)', fontWeight: 600 }}>
                                    {cell.value}
                                  </span>
                                </TableCell>
                              );
                            }
                            if (cell.info.header === 'barcode') {
                              return (
                                <TableCell key={cell.id}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <BarcodeIcon size={16} style={{ color: 'var(--cds-icon-secondary)' }} />
                                    <span style={{ fontFamily: 'var(--cds-font-family-mono, monospace)' }}>{cell.value}</span>
                                  </div>
                                </TableCell>
                              );
                            }
                            if (cell.info.header === 'category') {
                              return (
                                <TableCell key={cell.id}>
                                  <Tag type={cell.value === 'Coffee' ? 'warm-gray' : cell.value === 'Pastries' ? 'cyan' : 'teal'}>
                                    {cell.value}
                                  </Tag>
                                </TableCell>
                              );
                            }
                            if (cell.info.header === 'stock') {
                              const units = parseInt(cell.value) || 0;
                              return (
                                <TableCell key={cell.id}>
                                  <Tag type={units > 20 ? 'green' : units > 10 ? 'blue' : 'red'}>
                                    {cell.value}
                                  </Tag>
                                </TableCell>
                              );
                            }
                            return (
                              <TableCell key={cell.id}>
                                {cell.value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                    </TableBody>
                  </Table>
                </TableContainer>
                );
              }}
            </DataTable>
          )}
        </Stack>
      </div>

      {/* Carbon Standard Modal */}
      <Modal
        open={isCreateOpen}
        modalHeading="Create New Product"
        modalLabel="Product Catalog"
        primaryButtonText="Create Product"
        secondaryButtonText="Cancel"
        primaryButtonDisabled={!newName.trim() || !newPrice || newPrice <= 0}
        onRequestClose={() => setIsCreateOpen(false)}
        onRequestSubmit={handleCreateProduct}
      >
        <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
          Register new merchandise or consumable items to the global POS catalog. All retail branches will instantly synchronize the new SKU.
        </p>

        <Stack gap={5}>
          <TextInput
            id="new-product-name"
            labelText="Product Name"
            placeholder="e.g. Nitro Cold Brew, Pistachio Croissant"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <TextInput
              id="new-product-sku"
              labelText="SKU Identifier"
              value={newSku}
              onChange={(e) => setNewSku(e.target.value)}
              helperText="Unique enterprise stock-keeping unit"
            />
            <TextInput
              id="new-product-barcode"
              labelText="Barcode (EAN-13 / UPC)"
              value={newBarcode}
              onChange={(e) => setNewBarcode(e.target.value)}
              helperText="Scan or enter optical code"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Select
              id="new-product-category"
              labelText="Product Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            >
              <SelectItem value="Coffee" text="Coffee" />
              <SelectItem value="Pastries" text="Pastries" />
              <SelectItem value="Beverages" text="Beverages" />
              <SelectItem value="Merchandise" text="Merchandise" />
            </Select>

            <NumberInput
              id="new-product-price"
              label="Retail Unit Price ($)"
              value={newPrice}
              min={0.50}
              step={0.25}
              onChange={(e, { value }) => setNewPrice(Number(value) || 0)}
            />
          </div>

          <NumberInput
            id="new-product-stock"
            label="Initial Warehouse Stock (Units)"
            value={newStock}
            min={0}
            step={5}
            onChange={(e, { value }) => setNewStock(Number(value) || 0)}
          />
        </Stack>
      </Modal>
    </>
  );
}
