import React, { useState } from 'react';
import {
  Modal,
  Search,
  Tag,
  Button,
  ButtonSet,
  TextInput,
  Select,
  SelectItem,
  Stack,
  ClickableTile,
} from '@carbon/react';
import { Add, Checkmark, Filter, ArrowRight } from '@carbon/icons-react';

export interface CatalogItem {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  sku?: string;
  price?: number;
  tags?: string[];
  details?: Record<string, string>;
}

export interface SingleAddSelectProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  items: CatalogItem[];
  categories?: string[];
  selectedId?: string | null;
  onSelect: (item: CatalogItem) => void;
  onAddNewItem?: (newItem: Partial<CatalogItem>) => void;
  allowCreateNew?: boolean;
}

export const SingleAddSelect: React.FC<SingleAddSelectProps> = ({
  open,
  onClose,
  title = 'Select or Add Catalog Item',
  description = 'Choose a product or component from the central registry, or create a new entry.',
  items,
  categories = ['All', 'Beverages', 'Bakery', 'Merchandise', 'Hardware'],
  selectedId = null,
  onSelect,
  onAddNewItem,
  allowCreateNew = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(
    items.find((i) => i.id === selectedId) || null
  );

  // Mode: select vs create new
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState(categories[1] || 'General');
  const [newPrice, setNewPrice] = useState('100');
  const [newSku, setNewSku] = useState('');

  if (!open) return null;

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created: CatalogItem = {
      id: `custom_${Date.now()}`,
      title: newName.trim(),
      category: newCategory,
      price: parseFloat(newPrice) || 0,
      sku: newSku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      subtitle: `Custom added item`,
    };

    if (onAddNewItem) {
      onAddNewItem(created);
    }
    setSelectedItem(created);
    setIsCreatingNew(false);
  };

  return (
    <Modal
      open={open}
      onRequestClose={onClose}
      modalHeading={title}
      modalLabel="Add & Select Pattern"
      primaryButtonText={isCreatingNew ? 'Save & Select' : 'Select Item'}
      primaryButtonDisabled={isCreatingNew ? !newName.trim() : !selectedItem}
      secondaryButtonText={isCreatingNew ? 'Back to Catalog' : 'Cancel'}
      onSecondarySubmit={() => {
        if (isCreatingNew) {
          setIsCreatingNew(false);
        } else {
          onClose();
        }
      }}
      onRequestSubmit={() => {
        if (isCreatingNew) {
          handleCreateSubmit({ preventDefault: () => {} } as any);
        } else if (selectedItem) {
          onSelect(selectedItem);
          onClose();
        }
      }}
      size="lg"
    >
      <div style={{ margin: '0 0 1rem 0' }}>
        <p className="body-01" style={{ color: 'var(--cds-text-secondary)', margin: 0 }}>
          {description}
        </p>
      </div>

      {!isCreatingNew ? (
        <div>
          {/* Search + Category Filter Bar */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-end',
              marginBottom: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: '1 1 300px' }}>
              <Search
                size="md"
                labelText="Search catalog"
                placeholder="Search by title, SKU, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ width: '180px' }}>
              <Select
                id="single-add-category"
                labelText="Category"
                size="md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <SelectItem key={c} value={c} text={c} />
                ))}
              </Select>
            </div>

            {allowCreateNew && (
              <Button
                kind="tertiary"
                size="md"
                renderIcon={Add}
                iconDescription="Create new item"
                onClick={() => setIsCreatingNew(true)}
              >
                Create New
              </Button>
            )}
          </div>

          {/* Catalog List */}
          <div
            style={{
              maxHeight: '360px',
              overflowY: 'auto',
              border: '1px solid var(--cds-border-subtle)',
              backgroundColor: 'var(--cds-layer-01)',
            }}
          >
            {filteredItems.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center' }}>
                <p className="body-01" style={{ color: 'var(--cds-text-secondary)', margin: '0 0 1rem 0' }}>
                  No catalog items found matching "{searchTerm}".
                </p>
                {allowCreateNew && (
                  <Button kind="primary" size="sm" renderIcon={Add} iconDescription="Create new item" onClick={() => setIsCreatingNew(true)}>
                    Create new "{searchTerm}"
                  </Button>
                )}
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    style={{
                      padding: '1rem 1.25rem',
                      borderBottom: '1px solid var(--cds-border-subtle)',
                      backgroundColor: isSelected ? 'var(--cds-layer-selected, #edf5ff)' : 'transparent',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'background-color 100ms ease',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <h4 className="heading-01" style={{ margin: 0, fontWeight: 600 }}>
                          {item.title}
                        </h4>
                        <Tag size="sm" type="cool-gray">
                          {item.category}
                        </Tag>
                        {item.sku && (
                          <span className="label-01" style={{ color: 'var(--cds-text-secondary)', fontSize: '0.75rem' }}>
                            {item.sku}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="body-01" style={{ margin: 0, color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
                          {item.subtitle}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {item.price !== undefined && (
                        <span className="heading-01" style={{ fontWeight: 600 }}>
                          ${item.price.toFixed(2)}
                        </span>
                      )}
                      {isSelected ? (
                        <Checkmark size={20} style={{ fill: 'var(--cds-interactive)' }} />
                      ) : (
                        <div style={{ width: '20px' }} />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Create New Form */
        <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextInput
            id="new-item-name"
            labelText="Item Name *"
            placeholder="e.g. Arabica Reserve Dark Roast"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Select
              id="new-item-category"
              labelText="Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            >
              {categories.filter((c) => c !== 'All').map((c) => (
                <SelectItem key={c} value={c} text={c} />
              ))}
            </Select>

            <TextInput
              id="new-item-sku"
              labelText="SKU / Barcode"
              placeholder="e.g. COF-ARB-901"
              value={newSku}
              onChange={(e) => setNewSku(e.target.value)}
            />
          </div>

          <TextInput
            id="new-item-price"
            labelText="Price ($)"
            type="number"
            step="0.01"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
        </form>
      )}
    </Modal>
  );
};
