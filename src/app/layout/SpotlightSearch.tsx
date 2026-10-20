import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Search } from '@carbon/react';
import { useTranslation } from 'react-i18next';

export default function SpotlightSearch({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const lowerQuery = query.toLowerCase();
    
    // Simple routing logic based on keywords
    if (lowerQuery.includes('pos') || lowerQuery.includes('sale') || lowerQuery.includes('بيع')) {
      navigate('/pos');
    } else if (lowerQuery.includes('customer') || lowerQuery.includes('client') || lowerQuery.includes('عميل')) {
      navigate('/customers');
    } else if (lowerQuery.includes('product') || lowerQuery.includes('item') || lowerQuery.includes('منتج')) {
      navigate('/products');
    } else if (lowerQuery.includes('set') || lowerQuery.includes('config') || lowerQuery.includes('إعداد')) {
      navigate('/settings');
    } else if (lowerQuery.includes('account') || lowerQuery.includes('ledger') || lowerQuery.includes('محاسب')) {
      navigate('/accounting');
    } else if (lowerQuery.includes('promot') || lowerQuery.includes('discount') || lowerQuery.includes('عرض')) {
      navigate('/promotions');
    } else {
      // Default fallback - navigate to products with search query in state or URL
      navigate('/products', { state: { search: query } });
    }
    
    setQuery('');
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onRequestClose={onClose}
      passiveModal
      modalHeading="Spotlight Search"
      size="sm"
    >
      <form onSubmit={handleSearch} style={{ paddingBottom: '1rem' }}>
        <Search
          id="spotlight-search-input"
          labelText="Search for products, customers, or modules"
          placeholder="e.g. 'settings' or 'customers'"
          value={query}
          onChange={(e: any) => setQuery(e.target.value)}
          ref={inputRef}
          size="lg"
          autoComplete="off"
        />
      </form>
    </Modal>
  );
}
