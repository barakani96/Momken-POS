import React, { useState } from 'react';
import { 
  Tile, 
  Button, 
  InlineNotification, 
  TextInput, 
  Select, 
  SelectItem, 
  Toggle, 
  Modal, 
  Tag
} from '@carbon/react';
import { Printer, Add, Activity, Search, Receipt } from '@carbon/icons-react';
import { useHardware, NetworkPrinter } from '../../../infrastructure/hardware/HardwareContext';
import { useReceiptTemplate } from '../context/ReceiptTemplateContext';

export default function PrinterManagement() {
  const { printers, addPrinter, removePrinter, discoverPrinters, pingPrinter } = useHardware();
  const { openCustomizationModal, activeTemplate } = useReceiptTemplate();
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPrinter, setNewPrinter] = useState<Partial<NetworkPrinter>>({
    name: 'New Printer',
    ip: '192.168.1.',
    port: 9100,
    model: 'Epson TM-T88VI',
    paperWidth: '80mm',
    autoCut: true,
    cashDrawer: false,
    buzzer: false,
    role: 'Customer'
  });

  const handleScanNetwork = async () => {
    setIsDiscovering(true);
    await discoverPrinters();
    setIsDiscovering(false);
  };

  const handlePing = async (id: string) => {
    await pingPrinter(id);
  };

  const handleAddSubmit = () => {
    addPrinter(newPrinter as Omit<NetworkPrinter, 'id' | 'isOnline' | 'latency'>);
    setIsAddModalOpen(false);
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 className="heading-04">Network Printers (ESC/POS)</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button 
            kind="ghost" 
            size="sm" 
            renderIcon={Receipt} 
            iconDescription="Customize Receipt Template" 
            onClick={() => openCustomizationModal()}
          >
            Receipt Template
          </Button>
          <Button kind="secondary" size="sm" renderIcon={Search} iconDescription="Discover LAN Printers" onClick={handleScanNetwork} disabled={isDiscovering}>
            {isDiscovering ? 'Scanning Subnet...' : 'Discover LAN Printers'}
          </Button>
          <Button size="sm" renderIcon={Add} iconDescription="Add Manual IP" onClick={() => setIsAddModalOpen(true)}>
            Add Manual IP
          </Button>
        </div>
      </div>

      <Tile style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="heading-02">Active Receipt Template:</span>
            <Tag type="blue" size="sm">{activeTemplate.branchName}</Tag>
            <Tag type="cool-gray" size="sm">{activeTemplate.elements.barcodeType || 'Barcode'}</Tag>
          </div>
          <p className="body-compact-01" style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
            Logo: {activeTemplate.elements.showLogo ? 'Enabled' : 'Disabled'} • Social Handles: {activeTemplate.elements.showSocialMedia ? 'Enabled' : 'Disabled'} • Return Policy: {activeTemplate.elements.showReturnPolicy ? 'Enabled' : 'Disabled'}
          </p>
        </div>
        <Button kind="tertiary" size="sm" onClick={() => openCustomizationModal(activeTemplate.branchId)}>
          Edit Template
        </Button>
      </Tile>

      {printers.length === 0 ? (
        <Tile>
          <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>No printers configured. Scan network or add manually.</p>
        </Tile>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {printers.map(printer => (
            <Tile key={printer.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <Printer size={32} style={{ color: printer.isOnline ? 'var(--cds-support-success)' : 'var(--cds-support-error)' }} />
                <div>
                  <h4 className="heading-02" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {printer.name}
                    <Tag type={printer.role === 'Customer' ? 'blue' : printer.role === 'Kitchen' ? 'magenta' : 'purple'} size="sm">
                      {printer.role}
                    </Tag>
                    {printer.isOnline ? (
                      <Tag type="green" size="sm">Online {printer.latency ? `(${printer.latency}ms)` : ''}</Tag>
                    ) : (
                      <Tag type="red" size="sm">Offline</Tag>
                    )}
                  </h4>
                  <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
                    {printer.ip}:{printer.port} • {printer.model} • {printer.paperWidth}
                  </p>
                  <p className="label-01" style={{ color: 'var(--cds-text-helper)', marginTop: '0.25rem' }}>
                    {printer.autoCut ? 'Auto-Cut ' : ''}
                    {printer.cashDrawer ? '• Cash Drawer ' : ''}
                    {printer.buzzer ? '• Buzzer ' : ''}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button kind="ghost" size="sm" renderIcon={Activity} iconDescription="Ping Test" onClick={() => handlePing(printer.id)}>
                  Ping Test
                </Button>
                <Button kind="danger--ghost" size="sm" onClick={() => removePrinter(printer.id)}>
                  Remove
                </Button>
              </div>
            </Tile>
          ))}
        </div>
      )}

      <Modal
        open={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        onRequestSubmit={handleAddSubmit}
        modalHeading="Add Network Printer"
        primaryButtonText="Save Printer"
        secondaryButtonText="Cancel"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1rem' }}>
          <TextInput
            id="printer-name"
            labelText="Printer Name"
            value={newPrinter.name}
            onChange={e => setNewPrinter({ ...newPrinter, name: e.target.value })}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <TextInput
              id="printer-ip"
              labelText="IP Address"
              value={newPrinter.ip}
              onChange={e => setNewPrinter({ ...newPrinter, ip: e.target.value })}
              style={{ flex: 1 }}
            />
            <TextInput
              id="printer-port"
              labelText="TCP Port"
              type="number"
              value={newPrinter.port?.toString()}
              onChange={e => setNewPrinter({ ...newPrinter, port: parseInt(e.target.value, 10) })}
              style={{ width: '120px' }}
            />
          </div>
          <Select
            id="printer-model"
            labelText="Printer Model / Protocol"
            value={newPrinter.model}
            onChange={e => setNewPrinter({ ...newPrinter, model: e.target.value as any })}
          >
            <SelectItem value="Epson TM-T88VI" text="Epson TM-T88VI" />
            <SelectItem value="Star TSP654II" text="Star TSP654II" />
            <SelectItem value="Bixolon SRP-330II" text="Bixolon SRP-330II" />
            <SelectItem value="Generic ESC/POS" text="Generic ESC/POS" />
          </Select>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Select
              id="printer-role"
              labelText="Destination Routing"
              value={newPrinter.role}
              onChange={e => setNewPrinter({ ...newPrinter, role: e.target.value as any })}
              style={{ flex: 1 }}
            >
              <SelectItem value="Customer" text="Customer Receipt" />
              <SelectItem value="Kitchen" text="Kitchen / Prep Ticket" />
              <SelectItem value="Both" text="Both" />
            </Select>
            <Select
              id="printer-width"
              labelText="Paper Width"
              value={newPrinter.paperWidth}
              onChange={e => setNewPrinter({ ...newPrinter, paperWidth: e.target.value as any })}
              style={{ width: '150px' }}
            >
              <SelectItem value="80mm" text="80mm" />
              <SelectItem value="58mm" text="58mm" />
            </Select>
          </div>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
            <Toggle
              id="toggle-cut"
              labelText="Auto-Cut"
              toggled={newPrinter.autoCut}
              onToggle={val => setNewPrinter({ ...newPrinter, autoCut: val })}
            />
            <Toggle
              id="toggle-drawer"
              labelText="Kick Cash Drawer"
              toggled={newPrinter.cashDrawer}
              onToggle={val => setNewPrinter({ ...newPrinter, cashDrawer: val })}
            />
            <Toggle
              id="toggle-buzzer"
              labelText="Audible Buzzer"
              toggled={newPrinter.buzzer}
              onToggle={val => setNewPrinter({ ...newPrinter, buzzer: val })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
