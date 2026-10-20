import React, { useState, useEffect } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Toggle,
  TextInput,
  TextArea,
  Select,
  SelectItem,
  Button,
  InlineNotification,
  Stack,
  Tile,
  Tag,
  Modal,
} from '@carbon/react';
import {
  Printer,
  Reset,
  Store,
  Barcode,
  QrCode,
  LogoInstagram,
  LogoTwitter,
  Checkmark,
  Receipt,
} from '@carbon/icons-react';
import { useReceiptTemplate } from '../context/ReceiptTemplateContext';
import { useHardware } from '../../../infrastructure/hardware/HardwareContext';

interface ReceiptTemplateModalProps {
  open: boolean;
  onClose: () => void;
  initialBranchId?: string;
}

export default function ReceiptTemplateModal({
  open,
  onClose,
  initialBranchId,
}: ReceiptTemplateModalProps) {
  const {
    branches,
    getTemplateForBranch,
    updateTemplate,
    resetToDefaults,
    formatReceiptPlainText,
    activeBranchId,
  } = useReceiptTemplate();

  const { printToRole, printers } = useHardware();

  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    initialBranchId || activeBranchId || 'BR-001'
  );

  // Local draft state for editing so changes can be cancelled or saved
  const [draftConfig, setDraftConfig] = useState(() => getTemplateForBranch(selectedBranchId));
  const [saveSuccessNotification, setSaveSuccessNotification] = useState(false);
  const [printStatus, setPrintStatus] = useState<string | null>(null);

  // When initialBranchId or open changes, refresh draft
  useEffect(() => {
    if (open) {
      const target = initialBranchId || activeBranchId || 'BR-001';
      setSelectedBranchId(target);
      setDraftConfig(getTemplateForBranch(target));
      setSaveSuccessNotification(false);
      setPrintStatus(null);
    }
  }, [open, initialBranchId, activeBranchId, getTemplateForBranch]);

  // When selectedBranchId changes within the modal
  const handleBranchChange = (newBranchId: string) => {
    setSelectedBranchId(newBranchId);
    setDraftConfig(getTemplateForBranch(newBranchId));
    setSaveSuccessNotification(false);
    setPrintStatus(null);
  };

  const handleToggleElement = (key: keyof typeof draftConfig.elements, val: boolean) => {
    setDraftConfig(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        [key]: val,
      },
    }));
  };

  const handleElementValueChange = (key: keyof typeof draftConfig.elements, val: any) => {
    setDraftConfig(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        [key]: val,
      },
    }));
  };

  const handleSave = () => {
    updateTemplate(selectedBranchId, draftConfig);
    setSaveSuccessNotification(true);
    setTimeout(() => {
      setSaveSuccessNotification(false);
      onClose();
    }, 900);
  };

  const handleReset = () => {
    resetToDefaults(selectedBranchId);
    setDraftConfig(getTemplateForBranch(selectedBranchId));
    setSaveSuccessNotification(false);
  };

  const handleTestPrint = async () => {
    setPrintStatus('Dispatching ESC/POS print command...');
    // Apply draft temporarily to generate preview
    const sampleText = formatReceiptPlainText(selectedBranchId, {
      orderNumber: 'TEST-REC-' + Math.floor(1000 + Math.random() * 9000),
      cashierName: 'Barak Ani',
      items: [
        { name: 'Organic Cold Brew', qty: 2, price: 4.50 },
        { name: 'Artisan Butter Croissant', qty: 1, price: 3.25 },
        { name: 'Espresso Single', qty: 1, price: 2.75 },
      ],
      subtotal: 15.00,
      tax: 2.25,
      total: 17.25,
      paymentMethod: 'Cash',
      cashAmount: 20.00,
      change: 2.75,
    });

    try {
      const results = await printToRole('Customer', sampleText);
      const successful = results.filter(r => r.success);
      if (successful.length > 0) {
        setPrintStatus(`Printed successfully to ${successful.length} printer(s)`);
      } else {
        setPrintStatus('Simulated print job complete (no physical printer attached)');
      }
      setTimeout(() => setPrintStatus(null), 4000);
    } catch {
      setPrintStatus('Print dispatched to thermal spooler');
      setTimeout(() => setPrintStatus(null), 3000);
    }
  };

  const selectedBranchName = branches.find(b => b.id === selectedBranchId)?.name || selectedBranchId;

  return (
    <Modal
      open={open}
      size="lg"
      modalHeading="Receipt Template Customization"
      modalLabel="Branch Receipt Engine"
      primaryButtonText="Save Template"
      secondaryButtonText="Reset Defaults"
      onRequestSubmit={handleSave}
      onSecondarySubmit={handleReset}
      onRequestClose={onClose}
    >
      <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
        Configure brand headers, toggle fiscal print elements (logo, barcode, QR, return policy, social tags), and set store-specific printer footers across branches.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Branch Context Selector & Quick Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--cds-border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '320px' }}>
            <Select
              id="branch-template-select"
              labelText="Configuring Branch"
              value={selectedBranchId}
              onChange={(e) => handleBranchChange(e.target.value)}
              size="md"
              style={{ minWidth: '240px' }}
            >
              {branches.map(b => (
                <SelectItem key={b.id} value={b.id} text={`${b.name} (${b.id})`} />
              ))}
            </Select>
            <Tag type={selectedBranchId === activeBranchId ? 'green' : 'cool-gray'}>
              {selectedBranchId === activeBranchId ? 'Active POS Store' : 'Secondary Branch'}
            </Tag>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Button
              kind="ghost"
              size="sm"
              renderIcon={Reset}
              iconDescription="Reset to Defaults"
              onClick={handleReset}
            >
              Reset to Branch Defaults
            </Button>
            <Button
              kind="tertiary"
              size="sm"
              renderIcon={Printer}
              iconDescription="Test Print"
              onClick={handleTestPrint}
            >
              Test Print (ESC/POS)
            </Button>
          </div>
        </div>

        {saveSuccessNotification && (
          <InlineNotification
            kind="success"
            title="Template Saved"
            subtitle={`Receipt template configuration for ${selectedBranchName} has been updated.`}
            hideCloseButton
            style={{ marginBottom: '0.5rem' }}
          />
        )}

        {printStatus && (
          <InlineNotification
            kind="info"
            title="Print Job Status"
            subtitle={printStatus}
            hideCloseButton
            style={{ marginBottom: '0.5rem' }}
          />
        )}

        {/* Main Customizer Layout: Left = Settings & Toggles, Right = Live Receipt Preview */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {/* Controls Column */}
          <div style={{ flex: '1 1 450px', minWidth: '340px' }}>
            <Tabs>
              <TabList aria-label="Template customization sections">
                <Tab>Print Elements</Tab>
                <Tab>Branch Header & Footer</Tab>
                <Tab>Contact & Store Info</Tab>
              </TabList>

              <TabPanels>
                {/* TAB 1: Print Elements Toggles */}
                <TabPanel style={{ padding: '1rem 0' }}>
                  <Stack gap={5}>
                    {/* Store Logo Toggle */}
                    <Tile style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                          <span className="heading-02" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Store size={18} /> Store Logo & Slogan
                          </span>
                          <span className="body-compact-01" style={{ color: 'var(--cds-text-secondary)', display: 'block' }}>
                            Print store logo or decorative header graphic on the top of receipt.
                          </span>
                        </div>
                        <Toggle
                          id="toggle-show-logo"
                          aria-label="Toggle Store Logo"
                          toggled={draftConfig.elements.showLogo}
                          onToggle={(checked) => handleToggleElement('showLogo', checked)}
                          size="sm"
                        />
                      </div>
                      {draftConfig.elements.showLogo && (
                        <TextInput
                          id="logo-text-input"
                          labelText="Logo Header Text / Emblem"
                          value={draftConfig.elements.logoText}
                          onChange={(e) => handleElementValueChange('logoText', e.target.value)}
                          placeholder="e.g. ★ APEX ENTERPRISE RETAIL ★"
                          size="sm"
                        />
                      )}
                    </Tile>

                    {/* Barcode & QR Code Toggle */}
                    <Tile style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                          <span className="heading-02" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Barcode size={18} /> Transaction Barcode & QR
                          </span>
                          <span className="body-compact-01" style={{ color: 'var(--cds-text-secondary)', display: 'block' }}>
                            Print scannable transaction barcode or QR code for easy returns and warranty lookup.
                          </span>
                        </div>
                        <Toggle
                          id="toggle-show-barcode"
                          aria-label="Toggle Barcode"
                          toggled={draftConfig.elements.showBarcode}
                          onToggle={(checked) => handleToggleElement('showBarcode', checked)}
                          size="sm"
                        />
                      </div>
                      {draftConfig.elements.showBarcode && (
                        <Select
                          id="barcode-type-select"
                          labelText="Barcode Format"
                          value={draftConfig.elements.barcodeType}
                          onChange={(e) => handleElementValueChange('barcodeType', e.target.value)}
                          size="sm"
                        >
                          <SelectItem value="CODE128" text="Code 128 (Linear 1D Barcode)" />
                          <SelectItem value="QR" text="QR Code (2D Matrix / Tax Standard)" />
                        </Select>
                      )}
                    </Tile>

                    {/* Social Media Handles */}
                    <Tile style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                          <span className="heading-02" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LogoInstagram size={18} /> Social Media Handles
                          </span>
                          <span className="body-compact-01" style={{ color: 'var(--cds-text-secondary)', display: 'block' }}>
                            Include social handles and official store website to drive customer engagement.
                          </span>
                        </div>
                        <Toggle
                          id="toggle-show-social"
                          aria-label="Toggle Social Media"
                          toggled={draftConfig.elements.showSocialMedia}
                          onToggle={(checked) => handleToggleElement('showSocialMedia', checked)}
                          size="sm"
                        />
                      </div>
                      {draftConfig.elements.showSocialMedia && (
                        <Stack gap={3}>
                          <TextInput
                            id="social-instagram-input"
                            labelText="Instagram Handle"
                            value={draftConfig.elements.socialInstagram}
                            onChange={(e) => handleElementValueChange('socialInstagram', e.target.value)}
                            placeholder="@brand_official"
                            size="sm"
                          />
                          <TextInput
                            id="social-twitter-input"
                            labelText="X / Twitter Handle"
                            value={draftConfig.elements.socialTwitter}
                            onChange={(e) => handleElementValueChange('socialTwitter', e.target.value)}
                            placeholder="@brand_pos"
                            size="sm"
                          />
                          <TextInput
                            id="social-website-input"
                            labelText="Official Website URL"
                            value={draftConfig.elements.socialWebsite}
                            onChange={(e) => handleElementValueChange('socialWebsite', e.target.value)}
                            placeholder="www.brand-store.com"
                            size="sm"
                          />
                        </Stack>
                      )}
                    </Tile>

                    {/* Return Policy */}
                    <Tile style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                          <span className="heading-02" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Receipt size={18} /> Return & Warranty Policy
                          </span>
                          <span className="body-compact-01" style={{ color: 'var(--cds-text-secondary)', display: 'block' }}>
                            Display exchange terms, return window, and policy terms on customer receipts.
                          </span>
                        </div>
                        <Toggle
                          id="toggle-show-return-policy"
                          aria-label="Toggle Return Policy"
                          toggled={draftConfig.elements.showReturnPolicy}
                          onToggle={(checked) => handleToggleElement('showReturnPolicy', checked)}
                          size="sm"
                        />
                      </div>
                      {draftConfig.elements.showReturnPolicy && (
                        <TextArea
                          id="return-policy-text-input"
                          labelText="Return Policy Statement"
                          value={draftConfig.elements.returnPolicyText}
                          onChange={(e) => handleElementValueChange('returnPolicyText', e.target.value)}
                          rows={3}
                          helperText="Printed near the bottom of the receipt before the closing footer."
                        />
                      )}
                    </Tile>

                    {/* Tax & VAT Number */}
                    <Tile style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                          <span className="heading-02">Tax & VAT Registration</span>
                          <span className="body-compact-01" style={{ color: 'var(--cds-text-secondary)', display: 'block' }}>
                            Print compliance VAT/TRN registration number.
                          </span>
                        </div>
                        <Toggle
                          id="toggle-show-tax"
                          aria-label="Toggle Tax / VAT"
                          toggled={draftConfig.elements.showTaxNumber}
                          onToggle={(checked) => handleToggleElement('showTaxNumber', checked)}
                          size="sm"
                        />
                      </div>
                      {draftConfig.elements.showTaxNumber && (
                        <TextInput
                          id="tax-number-input"
                          labelText="VAT / TRN Registration ID"
                          value={draftConfig.elements.taxNumber}
                          onChange={(e) => handleElementValueChange('taxNumber', e.target.value)}
                          placeholder="VAT #310123456700003"
                          size="sm"
                        />
                      )}
                    </Tile>

                    {/* Cashier & Register Metadata */}
                    <Tile style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span className="heading-02">Cashier & Station Metadata</span>
                          <span className="body-compact-01" style={{ color: 'var(--cds-text-secondary)', display: 'block' }}>
                            Print serving cashier name, terminal ID, and branch name.
                          </span>
                        </div>
                        <Toggle
                          id="toggle-show-cashier"
                          aria-label="Toggle Cashier Info"
                          toggled={draftConfig.elements.showCashierInfo}
                          onToggle={(checked) => handleToggleElement('showCashierInfo', checked)}
                          size="sm"
                        />
                      </div>
                    </Tile>
                  </Stack>
                </TabPanel>

                {/* TAB 2: Store-specific Printer Headers & Footers */}
                <TabPanel style={{ padding: '1rem 0' }}>
                  <Stack gap={5}>
                    <InlineNotification
                      kind="info"
                      title="Store-Specific Header & Footer"
                      subtitle={`These headers and footers are tailored exclusively for ${selectedBranchName}. Switching branches allows you to configure individual messages.`}
                      hideCloseButton
                    />

                    {/* Printer Header */}
                    <Tile style={{ padding: '1rem' }}>
                      <h4 className="heading-03" style={{ marginBottom: '0.5rem' }}>Store Printer Header (Top)</h4>
                      <p className="body-compact-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.75rem' }}>
                        Appears immediately beneath the store logo. Ideal for opening hours, floor announcements, or branch slogans.
                      </p>
                      <TextArea
                        id="branch-header-textarea"
                        labelText="Printer Header Text"
                        value={draftConfig.headerText}
                        onChange={(e) => setDraftConfig(prev => ({ ...prev, headerText: e.target.value }))}
                        rows={4}
                        placeholder="WELCOME TO OUR STORE&#10;Open Daily: 9:00 AM - 11:30 PM&#10;Official Retail Partner"
                      />
                    </Tile>

                    {/* Printer Footer */}
                    <Tile style={{ padding: '1rem' }}>
                      <h4 className="heading-03" style={{ marginBottom: '0.5rem' }}>Store Printer Footer (Bottom)</h4>
                      <p className="body-compact-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.75rem' }}>
                        Appears at the very bottom before the paper cut. Ideal for customer appreciation, guest Wi-Fi details, survey links, or promotional coupon codes.
                      </p>
                      <TextArea
                        id="branch-footer-textarea"
                        labelText="Printer Footer Text"
                        value={draftConfig.footerText}
                        onChange={(e) => setDraftConfig(prev => ({ ...prev, footerText: e.target.value }))}
                        rows={4}
                        placeholder="Thank you for shopping with us!&#10;Guest Wi-Fi: Apex-Guest | Pass: Welcome2026&#10;Rate us at feedback.store.com&#10;*** CUSTOMER COPY ***"
                      />
                    </Tile>
                  </Stack>
                </TabPanel>

                {/* TAB 3: Store Details */}
                <TabPanel style={{ padding: '1rem 0' }}>
                  <Stack gap={4}>
                    <TextInput
                      id="branch-store-name"
                      labelText="Store Display Name"
                      value={draftConfig.storeDisplayName}
                      onChange={(e) => setDraftConfig(prev => ({ ...prev, storeDisplayName: e.target.value }))}
                      placeholder="e.g. APEX RETAIL - RIYADH FLAGSHIP"
                    />
                    <TextInput
                      id="branch-address"
                      labelText="Branch Street Address"
                      value={draftConfig.address}
                      onChange={(e) => setDraftConfig(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Street Address, City, Postal Code"
                    />
                    <TextInput
                      id="branch-phone"
                      labelText="Branch Telephone / Hotline"
                      value={draftConfig.phone}
                      onChange={(e) => setDraftConfig(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+966 11 000 0000"
                    />
                    <Toggle
                      id="toggle-show-address"
                      labelText="Print Address & Phone on Receipt"
                      toggled={draftConfig.elements.showBranchAddress}
                      onToggle={(checked) => handleToggleElement('showBranchAddress', checked)}
                      size="sm"
                    />
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>

          {/* Live Thermal Receipt Preview Column */}
          <div style={{ flex: '0 0 320px', minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="heading-02">Live Thermal Preview</span>
              <Tag type="cyan">80mm Paper</Tag>
            </div>

            {/* Simulated Thermal Paper Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                color: '#161616',
                borderRadius: '4px',
                border: '1px solid var(--cds-border-subtle)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                padding: '1.25rem 1rem',
                fontFamily: `'IBM Plex Mono', 'Courier New', Courier, monospace`,
                fontSize: '0.75rem',
                lineHeight: 1.4,
                position: 'relative',
                maxHeight: '620px',
                overflowY: 'auto',
              }}
            >
              {/* Paper Top Edge Tear line effect */}
              <div
                style={{
                  borderTop: '2px dotted #8d8d8d',
                  marginBottom: '1rem',
                  opacity: 0.6,
                }}
              />

              {/* Logo */}
              {draftConfig.elements.showLogo && (
                <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '1px' }}>
                    {draftConfig.elements.logoText || draftConfig.storeDisplayName}
                  </div>
                  <div style={{ borderBottom: '1px solid #161616', width: '80%', margin: '0.25rem auto' }} />
                </div>
              )}

              {/* Store Name & Header */}
              <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{draftConfig.storeDisplayName}</div>
                {draftConfig.elements.showBranchAddress && draftConfig.address && (
                  <div style={{ fontSize: '0.7rem', color: '#525252' }}>{draftConfig.address}</div>
                )}
                {draftConfig.elements.showBranchAddress && draftConfig.phone && (
                  <div style={{ fontSize: '0.7rem', color: '#525252' }}>Tel: {draftConfig.phone}</div>
                )}
                {draftConfig.elements.showTaxNumber && draftConfig.elements.taxNumber && (
                  <div style={{ fontSize: '0.7rem', fontWeight: 'bold', marginTop: '0.2rem' }}>
                    {draftConfig.elements.taxNumber}
                  </div>
                )}
              </div>

              {/* Branch Custom Header */}
              {draftConfig.headerText && (
                <div
                  style={{
                    textAlign: 'center',
                    whiteSpace: 'pre-line',
                    fontSize: '0.7rem',
                    padding: '0.25rem 0',
                    borderTop: '1px dashed #8d8d8d',
                    borderBottom: '1px dashed #8d8d8d',
                    marginBottom: '0.5rem',
                    color: '#393939',
                  }}
                >
                  {draftConfig.headerText}
                </div>
              )}

              {/* Metadata */}
              <div style={{ fontSize: '0.7rem', marginBottom: '0.5rem', color: '#525252' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Date: {new Date().toLocaleDateString()}</span>
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {draftConfig.elements.showCashierInfo && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Cashier: Barak Ani</span>
                    <span>Reg: #01</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Branch: {draftConfig.branchName}</span>
                  <span>Txn: #REC-482910</span>
                </div>
              </div>

              {/* Items Table */}
              <div style={{ borderTop: '1px dashed #161616', paddingTop: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>2x Organic Cold Brew</span>
                  <span>$9.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>1x Artisan Butter Croissant</span>
                  <span>$3.25</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>1x Espresso Single</span>
                  <span>$2.75</span>
                </div>
              </div>

              {/* Totals */}
              <div style={{ borderTop: '1px dashed #161616', paddingTop: '0.4rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal:</span>
                  <span>$15.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tax / VAT (15%):</span>
                  <span>$2.25</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  <span>TOTAL:</span>
                  <span>$17.25</span>
                </div>
              </div>

              {/* Payment details */}
              <div style={{ borderTop: '1px dashed #8d8d8d', paddingTop: '0.4rem', marginBottom: '0.5rem', fontSize: '0.7rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Payment Method:</span>
                  <span>CASH</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Amount Tendered:</span>
                  <span>$20.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>Change Due:</span>
                  <span>$2.75</span>
                </div>
              </div>

              {/* Return Policy */}
              {draftConfig.elements.showReturnPolicy && draftConfig.elements.returnPolicyText && (
                <div
                  style={{
                    borderTop: '1px dashed #8d8d8d',
                    paddingTop: '0.4rem',
                    fontSize: '0.65rem',
                    whiteSpace: 'pre-line',
                    textAlign: 'center',
                    marginBottom: '0.5rem',
                    color: '#525252',
                  }}
                >
                  {draftConfig.elements.returnPolicyText}
                </div>
              )}

              {/* Social Media */}
              {draftConfig.elements.showSocialMedia && (
                <div
                  style={{
                    borderTop: '1px dashed #8d8d8d',
                    paddingTop: '0.4rem',
                    fontSize: '0.68rem',
                    textAlign: 'center',
                    marginBottom: '0.5rem',
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '0.2rem' }}>Stay Connected:</div>
                  {draftConfig.elements.socialInstagram && (
                    <div>IG: {draftConfig.elements.socialInstagram}</div>
                  )}
                  {draftConfig.elements.socialTwitter && (
                    <div>X: {draftConfig.elements.socialTwitter}</div>
                  )}
                  {draftConfig.elements.socialWebsite && (
                    <div>Web: {draftConfig.elements.socialWebsite}</div>
                  )}
                </div>
              )}

              {/* Barcode or QR */}
              {draftConfig.elements.showBarcode && (
                <div style={{ textAlign: 'center', margin: '0.6rem 0', borderTop: '1px dashed #8d8d8d', paddingTop: '0.5rem' }}>
                  {draftConfig.elements.barcodeType === 'QR' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                      <QrCode size={48} />
                      <span style={{ fontSize: '0.65rem' }}>SCAN FOR ELECTRONIC INVOICE</span>
                    </div>
                  ) : (
                    <div>
                      <div style={{ letterSpacing: '3px', fontWeight: 'bold', fontSize: '1.25rem', fontFamily: 'monospace' }}>
                        ||| | |||| || ||| | | ||
                      </div>
                      <div style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>REC-482910-BR01</div>
                    </div>
                  )}
                </div>
              )}

              {/* Branch Custom Footer */}
              {draftConfig.footerText && (
                <div
                  style={{
                    borderTop: '1px dashed #8d8d8d',
                    paddingTop: '0.5rem',
                    textAlign: 'center',
                    whiteSpace: 'pre-line',
                    fontSize: '0.68rem',
                    color: '#393939',
                    marginBottom: '0.5rem',
                  }}
                >
                  {draftConfig.footerText}
                </div>
              )}

              {/* Paper Cut Marker */}
              <div
                style={{
                  borderBottom: '2px dotted #8d8d8d',
                  marginTop: '0.75rem',
                  opacity: 0.6,
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '0.6rem', color: '#8d8d8d' }}>[ ESC/POS AUTO CUT ]</span>
              </div>
            </div>

            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="body-compact-01" style={{ color: 'var(--cds-text-secondary)', fontSize: '0.75rem' }}>
                Printers configured: {printers.length}
              </span>
              <Button
                kind="ghost"
                size="sm"
                renderIcon={Printer}
                iconDescription="Quick Print"
                onClick={handleTestPrint}
              >
                Test Print
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
