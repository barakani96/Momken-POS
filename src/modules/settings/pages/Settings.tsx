import React, { useState } from 'react';
import { 
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel, 
  Button, 
  Tile,
  InlineNotification
} from '@carbon/react';
import { Barcode, Link, Receipt, Store, Edit } from '@carbon/icons-react';
import { useHardware } from '../../../infrastructure/hardware/HardwareContext';
import { useReceiptTemplate } from '../context/ReceiptTemplateContext';
import PrinterManagement from '../components/PrinterManagement';

export default function Settings() {
  const { isScannerSupported, isScannerConnected, connectScanner, disconnectScanner } = useHardware();
  const { openCustomizationModal, activeTemplate, activeBranchId, setActiveBranchId, branches } = useReceiptTemplate();

  return (
    <div style={{ padding: '2rem' }}>
      <h1 className="heading-05" style={{ marginBottom: '1.5rem' }}>System Settings</h1>
      
      <Tabs>
        <TabList aria-label="Settings navigation">
          <Tab>General</Tab>
          <Tab>Device Configuration</Tab>
          <Tab>Appearance</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div style={{ maxWidth: '640px' }}>
              <h2 className="heading-04" style={{ marginBottom: '1rem' }}>Store Operations & Branding</h2>
              
              <Tile style={{ marginBottom: '1rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 className="heading-03" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Receipt size={24} /> Receipt Template Customization
                    </h3>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginTop: '0.5rem', maxWidth: '420px' }}>
                      Customize store-specific printer headers and footers for each branch, and toggle print elements (store logo, social media handles, return policy, and transaction barcodes).
                    </p>
                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="body-compact-01" style={{ color: 'var(--cds-text-secondary)' }}>Current Store:</span>
                      <strong>{activeTemplate.branchName}</strong>
                    </div>
                  </div>
                  <Button 
                    kind="primary" 
                    renderIcon={Edit} 
                    iconDescription="Customize Receipt Template"
                    onClick={() => openCustomizationModal(activeBranchId)}
                  >
                    Customize Template
                  </Button>
                </div>
              </Tile>
            </div>
          </TabPanel>
          <TabPanel>
            <div style={{ maxWidth: '600px' }}>
              <h2 className="heading-04" style={{ marginBottom: '1rem' }}>Hardware Integrations</h2>
              
              <Tile style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="heading-03" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Barcode size={24} /> Barcode Scanner
                  </h3>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginTop: '0.5rem' }}>
                    Connect a standard USB/Serial barcode scanner to dispatch ITEM_LOOKUP events.
                  </p>
                </div>
                <div>
                  {!isScannerSupported ? (
                    <InlineNotification
                      kind="warning"
                      title="Not Supported"
                      subtitle="Web Serial API not available."
                      hideCloseButton
                    />
                  ) : isScannerConnected ? (
                    <Button kind="danger--tertiary" onClick={disconnectScanner}>
                      Disconnect
                    </Button>
                  ) : (
                    <Button kind="primary" renderIcon={Link} iconDescription="Connect Scanner" onClick={connectScanner}>
                      Connect Scanner
                    </Button>
                  )}
                </div>
              </Tile>
              
              {isScannerConnected && (
                <InlineNotification
                  kind="success"
                  title="Scanner Connected"
                  subtitle="Listening for hardware scan events globally."
                  hideCloseButton
                />
              )}

              <PrinterManagement />
            </div>
          </TabPanel>
          <TabPanel>
            <p>Appearance settings go here.</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
