import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { BranchReceiptConfig, DEFAULT_BRANCH_CONFIGS, ReceiptPrintElements } from '../types/receiptTemplate';

interface ReceiptTemplateContextType {
  templates: Record<string, BranchReceiptConfig>;
  activeBranchId: string;
  setActiveBranchId: (id: string) => void;
  activeTemplate: BranchReceiptConfig;
  getTemplateForBranch: (branchId: string) => BranchReceiptConfig;
  updateTemplate: (branchId: string, updates: Partial<BranchReceiptConfig>) => void;
  updateElements: (branchId: string, elementUpdates: Partial<ReceiptPrintElements>) => void;
  resetToDefaults: (branchId?: string) => void;
  isCustomizationModalOpen: boolean;
  modalTargetBranchId: string;
  openCustomizationModal: (branchId?: string) => void;
  closeCustomizationModal: () => void;
  branches: { id: string; name: string }[];
  formatReceiptPlainText: (branchId: string, orderData?: {
    orderNumber: string;
    cashierName: string;
    items: { name: string; qty: number; price: number }[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    cashAmount?: number;
    cardAmount?: number;
    change?: number;
    date?: string;
  }) => string;
}

const STORAGE_KEY = 'apex_pos_receipt_templates_v2';
const ACTIVE_BRANCH_KEY = 'apex_pos_active_branch_v2';

const BRANCH_LIST = [
  { id: 'BR-001', name: 'Riyadh Flagship' },
  { id: 'BR-002', name: 'Jeddah Mall of Arabia' },
  { id: 'BR-003', name: 'Khobar Corniche' },
  { id: 'BR-004', name: 'Dubai Mall' },
];

const ReceiptTemplateContext = createContext<ReceiptTemplateContextType | undefined>(undefined);

export function ReceiptTemplateProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<Record<string, BranchReceiptConfig>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure all defaults are merged in case new branches or properties are added
        return {
          ...DEFAULT_BRANCH_CONFIGS,
          ...parsed,
        };
      }
    } catch (e) {
      console.error('Failed to load receipt templates from storage', e);
    }
    return DEFAULT_BRANCH_CONFIGS;
  });

  const [activeBranchId, setActiveBranchIdState] = useState<string>(() => {
    try {
      return localStorage.getItem(ACTIVE_BRANCH_KEY) || 'BR-001';
    } catch {
      return 'BR-001';
    }
  });

  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [modalTargetBranchId, setModalTargetBranchId] = useState<string>('BR-001');

  const setActiveBranchId = useCallback((id: string) => {
    setActiveBranchIdState(id);
    try {
      localStorage.setItem(ACTIVE_BRANCH_KEY, id);
    } catch (e) {
      console.error('Failed to save active branch to storage', e);
    }
  }, []);

  const openCustomizationModal = useCallback((branchId?: string) => {
    if (branchId) {
      setModalTargetBranchId(branchId);
    } else {
      setModalTargetBranchId(activeBranchId);
    }
    setIsCustomizationModalOpen(true);
  }, [activeBranchId]);

  const closeCustomizationModal = useCallback(() => {
    setIsCustomizationModalOpen(false);
  }, []);

  // Save templates on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    } catch (e) {
      console.error('Failed to save receipt templates to storage', e);
    }
  }, [templates]);

  const getTemplateForBranch = useCallback((branchId: string): BranchReceiptConfig => {
    return templates[branchId] || DEFAULT_BRANCH_CONFIGS[branchId] || DEFAULT_BRANCH_CONFIGS['BR-001'];
  }, [templates]);

  const activeTemplate = useMemo(() => {
    return getTemplateForBranch(activeBranchId);
  }, [getTemplateForBranch, activeBranchId]);

  const updateTemplate = useCallback((branchId: string, updates: Partial<BranchReceiptConfig>) => {
    setTemplates(prev => {
      const current = prev[branchId] || DEFAULT_BRANCH_CONFIGS[branchId] || DEFAULT_BRANCH_CONFIGS['BR-001'];
      return {
        ...prev,
        [branchId]: {
          ...current,
          ...updates,
          elements: {
            ...current.elements,
            ...(updates.elements || {})
          }
        }
      };
    });
  }, []);

  const updateElements = useCallback((branchId: string, elementUpdates: Partial<ReceiptPrintElements>) => {
    setTemplates(prev => {
      const current = prev[branchId] || DEFAULT_BRANCH_CONFIGS[branchId] || DEFAULT_BRANCH_CONFIGS['BR-001'];
      return {
        ...prev,
        [branchId]: {
          ...current,
          elements: {
            ...current.elements,
            ...elementUpdates
          }
        }
      };
    });
  }, []);

  const resetToDefaults = useCallback((branchId?: string) => {
    if (branchId) {
      setTemplates(prev => ({
        ...prev,
        [branchId]: { ...DEFAULT_BRANCH_CONFIGS[branchId] }
      }));
    } else {
      setTemplates(DEFAULT_BRANCH_CONFIGS);
    }
  }, []);

  const formatReceiptPlainText = useCallback((branchId: string, orderData?: {
    orderNumber: string;
    cashierName: string;
    items: { name: string; qty: number; price: number }[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    cashAmount?: number;
    cardAmount?: number;
    change?: number;
    date?: string;
  }) => {
    const config = getTemplateForBranch(branchId);
    const { elements } = config;
    const lines: string[] = [];

    if (elements.showLogo) {
      lines.push('================================');
      lines.push(elements.logoText || config.storeDisplayName);
      lines.push('================================');
    } else {
      lines.push(config.storeDisplayName);
    }

    if (config.headerText) {
      lines.push(config.headerText);
    }

    if (elements.showBranchAddress && config.address) {
      lines.push(config.address);
      if (config.phone) lines.push(`Tel: ${config.phone}`);
    }

    if (elements.showTaxNumber && elements.taxNumber) {
      lines.push(elements.taxNumber);
    }

    lines.push('--------------------------------');
    lines.push(`Date: ${orderData?.date || new Date().toLocaleString()}`);
    if (elements.showCashierInfo) {
      lines.push(`Cashier: ${orderData?.cashierName || 'Barak Ani'}`);
      lines.push(`Branch: ${config.branchName}`);
    }
    lines.push(`Txn #: ${orderData?.orderNumber || 'REC-' + Math.floor(100000 + Math.random() * 900000)}`);
    lines.push('--------------------------------');

    const items = orderData?.items || [
      { name: 'Organic Cold Brew', qty: 2, price: 4.50 },
      { name: 'Artisan Croissant', qty: 1, price: 3.25 },
    ];

    items.forEach(it => {
      const lineTotal = (it.qty * it.price).toFixed(2);
      lines.push(`${it.qty}x ${it.name.padEnd(20).slice(0, 20)} $${lineTotal}`);
    });

    const sub = orderData ? orderData.subtotal : 12.25;
    const tax = orderData ? orderData.tax : 1.84;
    const tot = orderData ? orderData.total : 14.09;

    lines.push('--------------------------------');
    lines.push(`Subtotal:                    $${sub.toFixed(2)}`);
    lines.push(`Tax / VAT (15%):             $${tax.toFixed(2)}`);
    lines.push(`TOTAL:                       $${tot.toFixed(2)}`);
    lines.push('--------------------------------');

    if (orderData?.cashAmount && orderData.cashAmount > 0) {
      lines.push(`Cash Paid:                   $${orderData.cashAmount.toFixed(2)}`);
      if (orderData?.change && orderData.change > 0) {
        lines.push(`Change:                      $${orderData.change.toFixed(2)}`);
      }
    } else if (orderData?.cardAmount && orderData.cardAmount > 0) {
      lines.push(`Card Payment:                $${orderData.cardAmount.toFixed(2)}`);
      lines.push(`Auth: APPROVED`);
    }

    if (elements.showReturnPolicy && elements.returnPolicyText) {
      lines.push('--------------------------------');
      lines.push(elements.returnPolicyText);
    }

    if (elements.showSocialMedia) {
      lines.push('--------------------------------');
      if (elements.socialInstagram) lines.push(`Instagram: ${elements.socialInstagram}`);
      if (elements.socialTwitter) lines.push(`X/Twitter: ${elements.socialTwitter}`);
      if (elements.socialWebsite) lines.push(`Web: ${elements.socialWebsite}`);
    }

    if (elements.showBarcode) {
      lines.push('--------------------------------');
      lines.push(`[BARCODE: ${orderData?.orderNumber || 'REC-892011'}]`);
    }

    if (config.footerText) {
      lines.push('--------------------------------');
      lines.push(config.footerText);
    }

    lines.push('================================');
    return lines.join('\n');
  }, [getTemplateForBranch]);

  return (
    <ReceiptTemplateContext.Provider
      value={{
        templates,
        activeBranchId,
        setActiveBranchId,
        activeTemplate,
        getTemplateForBranch,
        updateTemplate,
        updateElements,
        resetToDefaults,
        isCustomizationModalOpen,
        modalTargetBranchId,
        openCustomizationModal,
        closeCustomizationModal,
        branches: BRANCH_LIST,
        formatReceiptPlainText,
      }}
    >
      {children}
    </ReceiptTemplateContext.Provider>
  );
}

export function useReceiptTemplate() {
  const context = useContext(ReceiptTemplateContext);
  if (!context) {
    throw new Error('useReceiptTemplate must be used within a ReceiptTemplateProvider');
  }
  return context;
}
