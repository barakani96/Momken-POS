import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import POS from '../modules/pos/pages/POS';
import Products from '../modules/products/pages/Products';
import Customers from '../modules/customers/pages/Customers';
import Settings from '../modules/settings/pages/Settings';
import AccountingDashboard from '../modules/accounting/pages/AccountingDashboard';
import BranchManager from '../modules/branches/pages/BranchManager';
import PromotionsEngine from '../modules/promotions/pages/PromotionsEngine';
import LoyaltyHub from '../modules/loyalty/pages/LoyaltyHub';
import RFIDHub from '../modules/rfid/pages/RFIDHub';
import KitchenDisplaySystem from '../modules/kitchen/pages/KitchenDisplaySystem';
import EcosystemDashboard from '../modules/dashboard/pages/EcosystemDashboard';
import CarbonPatternsOverview from '../modules/patterns/pages/CarbonPatternsOverview';
import CarbonLayoutReflection from '../modules/patterns/pages/CarbonLayoutReflection';
import CarbonStorybookExplorer from '../modules/patterns/pages/CarbonStorybookExplorer';
import CarbonIBMProductsExplorer from '../modules/patterns/pages/CarbonIBMProductsExplorer';
import PlaceholderModule from '../shared/components/PlaceholderModule';
import { CashierProvider, useCashier } from '../modules/auth/context/CashierContext';
import CashierLockScreen from '../modules/auth/components/CashierLockScreen';
import { HardwareProvider } from '../infrastructure/hardware/HardwareContext';
import { ReceiptTemplateProvider, useReceiptTemplate } from '../modules/settings/context/ReceiptTemplateContext';
import ReceiptTemplateModal from '../modules/settings/components/ReceiptTemplateModal';

function AppContent() {
  const { activeCashier, login } = useCashier();
  const { isCustomizationModalOpen, closeCustomizationModal, modalTargetBranchId } = useReceiptTemplate();

  if (!activeCashier) {
    return <CashierLockScreen onLogin={login} />;
  }

  return (
    <>
      <Routes>
        {/* Standalone POS Terminal Route */}
        <Route path="/pos/standalone" element={<POS isStandalone={true} />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/pos" replace />} />
          
          {/* Operations */}
          <Route path="/pos" element={<POS />} />
          <Route path="/crm" element={<Customers />} />
          <Route path="/kds" element={<KitchenDisplaySystem />} />
          
          {/* Inventory & Fulfillment */}
          <Route path="/products" element={<Products />} />
          <Route path="/inventory" element={<PlaceholderModule translationKey="inventory" />} />
          <Route path="/rfid" element={<RFIDHub />} />
          <Route path="/ecommerce" element={<PlaceholderModule translationKey="ecommerce" />} />
          
          {/* Marketing */}
          <Route path="/promotions" element={<PromotionsEngine />} />
          <Route path="/loyalty" element={<LoyaltyHub />} />
          
          {/* Enterprise */}
          <Route path="/multi-store" element={<BranchManager />} />
          <Route path="/accounting" element={<AccountingDashboard />} />
          <Route path="/dashboard" element={<EcosystemDashboard />} />
          <Route path="/patterns" element={<CarbonPatternsOverview />} />
          <Route path="/ibm-products" element={<CarbonIBMProductsExplorer />} />
          <Route path="/ibm-patterns" element={<CarbonIBMProductsExplorer />} />
          <Route path="/storybook" element={<CarbonStorybookExplorer />} />
          <Route path="/components" element={<CarbonStorybookExplorer />} />
          <Route path="/reflection" element={<CarbonLayoutReflection />} />
          <Route path="/layout" element={<CarbonLayoutReflection />} />
          <Route path="/layout-reflection" element={<CarbonLayoutReflection />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>

      <ReceiptTemplateModal
        open={isCustomizationModalOpen}
        onClose={closeCustomizationModal}
        initialBranchId={modalTargetBranchId}
      />
    </>
  );
}

export default function App() {
  return (
    <HardwareProvider>
      <ReceiptTemplateProvider>
        <CashierProvider>
          <AppContent />
        </CashierProvider>
      </ReceiptTemplateProvider>
    </HardwareProvider>
  );
}

