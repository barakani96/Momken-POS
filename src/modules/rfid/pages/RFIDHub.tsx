import React, { useState } from 'react';
import { 
  Button, Tile, Grid, Row, Column,
  ProgressBar, InlineNotification
} from '@carbon/react';
import { ConnectionSignal, Usb, Tag, CloudUpload } from '@carbon/icons-react';
import { mockProducts } from '../../products/data/mockProducts';
import { useHardware } from '../../../infrastructure/hardware/HardwareContext';

export default function RFIDHub() {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedTags, setDetectedTags] = useState<any[]>([]);
  const { simulateScan } = useHardware();

  const handleBulkScan = () => {
    setIsScanning(true);
    setDetectedTags([]);
    
    // Simulate detecting 3 random items via RFID
    setTimeout(() => {
      const items = [
        mockProducts[0],
        mockProducts[3],
        mockProducts[5]
      ].filter(Boolean);
      
      setDetectedTags(items);
      setIsScanning(false);
      
      // Dispatch them to the POS context automatically
      items.forEach(item => {
        if (item.barcode) simulateScan(item.barcode);
      });
      
    }, 2500);
  };

  return (
    <div>
      <h1 className="heading-05" style={{ marginBottom: '1rem' }}>RFID UHF Control Hub</h1>
      <p className="body-01" style={{ marginBottom: '2rem', color: 'var(--cds-text-secondary)' }}>
        Manage connected EPC Gen2 readers, test signal strength, and trigger bulk tray intake.
      </p>

      <Grid fullWidth style={{ padding: 0, marginBottom: '2rem' }}>
        <Row>
          <Column sm={4} md={4} lg={8}>
            <Tile style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 className="heading-03" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Tag size={24} /> Bulk Intake Tray
                </h3>
                <Button 
                  kind={isScanning ? "danger" : "primary"} 
                  onClick={isScanning ? () => setIsScanning(false) : handleBulkScan}
                >
                  {isScanning ? 'Stop Scan' : 'Initiate Bulk Scan'}
                </Button>
              </div>

              {isScanning ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p className="body-01" style={{ marginBottom: '1rem' }}>Scanning EPC Gen2 Tags (Port 1)...</p>
                  <ProgressBar label="Active Power: 30.0 dBm" value={undefined} />
                </div>
              ) : detectedTags.length > 0 ? (
                <div style={{ flex: 1 }}>
                  <InlineNotification
                    kind="success"
                    title="Scan Complete"
                    subtitle={`Successfully ingested ${detectedTags.length} tags into the active POS Cart.`}
                    hideCloseButton
                  />
                  <div style={{ marginTop: '1rem' }}>
                    {detectedTags.map((tag, idx) => (
                      <div key={idx} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--cds-border-subtle)' }}>
                        <p className="heading-01">{tag.name}</p>
                        <p className="label-01" style={{ color: 'var(--cds-text-secondary)' }}>EPC: 3034{tag.barcode}00000000000</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--cds-text-helper)' }}>
                  <Usb size={48} style={{ marginBottom: '1rem' }} />
                  <p className="body-01">Place basket on tray and press Initiate Bulk Scan.</p>
                </div>
              )}
            </Tile>
          </Column>
          <Column sm={4} md={4} lg={4}>
            <Tile>
              <h3 className="heading-03" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ConnectionSignal size={24} /> Antenna Matrix
              </h3>
              <div style={{ marginBottom: '1rem' }}>
                <p className="label-01">Port 1 (Checkout Tray)</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--cds-support-success)' }} />
                  <span className="label-01">-45 dBm</span>
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <p className="label-01">Port 2 (Overhead Arch)</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--cds-border-subtle)' }} />
                  <span className="label-01">Offline</span>
                </div>
              </div>
            </Tile>
          </Column>
        </Row>
      </Grid>
    </div>
  );
}
