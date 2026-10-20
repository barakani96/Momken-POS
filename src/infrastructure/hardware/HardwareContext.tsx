import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

export interface ScanEvent {
  id: string;
  barcode: string;
  timestamp: Date;
}

export interface NetworkPrinter {
  id: string;
  name: string;
  ip: string;
  port: number;
  model: 'Epson TM-T88VI' | 'Star TSP654II' | 'Bixolon SRP-330II' | 'Generic ESC/POS';
  paperWidth: '80mm' | '58mm';
  autoCut: boolean;
  cashDrawer: boolean;
  buzzer: boolean;
  role: 'Customer' | 'Kitchen' | 'Both';
  isOnline: boolean;
  latency?: number;
}

interface HardwareContextType {
  isScannerSupported: boolean;
  isScannerConnected: boolean;
  connectScanner: () => Promise<void>;
  disconnectScanner: () => Promise<void>;
  scanQueue: ScanEvent[];
  consumeScan: (id: string) => void;
  simulateScan: (barcode: string) => void; // for testing if needed
  
  // Network Printers
  printers: NetworkPrinter[];
  addPrinter: (printer: Omit<NetworkPrinter, 'id' | 'isOnline' | 'latency'>) => void;
  updatePrinter: (id: string, updates: Partial<NetworkPrinter>) => void;
  removePrinter: (id: string) => void;
  discoverPrinters: () => Promise<void>;
  pingPrinter: (id: string) => Promise<void>;
  printToRole: (role: 'Customer' | 'Kitchen', content: string) => Promise<{ success: boolean; bytes: string; printerName: string }[]>;
}

const HardwareContext = createContext<HardwareContextType | undefined>(undefined);

export function HardwareProvider({ children }: { children: React.ReactNode }) {
  const [isScannerSupported] = useState<boolean>('serial' in navigator);
  const [isScannerConnected, setIsScannerConnected] = useState(false);
  const [scanQueue, setScanQueue] = useState<ScanEvent[]>([]);
  const readerRef = useRef<ReadableStreamDefaultReader<string> | null>(null);

  const [printers, setPrinters] = useState<NetworkPrinter[]>([
    {
      id: 'P-1001',
      name: 'Front Desk Thermal',
      ip: '192.168.1.150',
      port: 9100,
      model: 'Epson TM-T88VI',
      paperWidth: '80mm',
      autoCut: true,
      cashDrawer: true,
      buzzer: false,
      role: 'Customer',
      isOnline: true,
      latency: 12
    }
  ]);

  const addPrinter = useCallback((printerData: Omit<NetworkPrinter, 'id' | 'isOnline' | 'latency'>) => {
    const newPrinter: NetworkPrinter = {
      ...printerData,
      id: `P-${Math.floor(Math.random() * 10000)}`,
      isOnline: true, // Assume online until ping fails
      latency: Math.floor(Math.random() * 20) + 5
    };
    setPrinters(prev => [...prev, newPrinter]);
  }, []);

  const updatePrinter = useCallback((id: string, updates: Partial<NetworkPrinter>) => {
    setPrinters(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const removePrinter = useCallback((id: string) => {
    setPrinters(prev => prev.filter(p => p.id !== id));
  }, []);

  const discoverPrinters = useCallback(async () => {
    // Simulate subnet scan for port 9100
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const discovered: NetworkPrinter = {
          id: `P-${Math.floor(Math.random() * 10000)}`,
          name: 'Kitchen Display Printer',
          ip: `192.168.1.${Math.floor(Math.random() * 100) + 150}`,
          port: 9100,
          model: 'Star TSP654II',
          paperWidth: '80mm',
          autoCut: true,
          cashDrawer: false,
          buzzer: true,
          role: 'Kitchen',
          isOnline: true,
          latency: Math.floor(Math.random() * 40) + 10
        };
        // Avoid adding if we already have a kitchen printer for this simulation
        setPrinters(prev => {
          if (!prev.some(p => p.role === 'Kitchen' || p.role === 'Both')) {
            return [...prev, discovered];
          }
          return prev;
        });
        resolve();
      }, 1500);
    });
  }, []);

  const pingPrinter = useCallback(async (id: string) => {
    return new Promise<void>((resolve) => {
      setPrinters(prev => prev.map(p => p.id === id ? { ...p, latency: undefined } : p)); // Clear latency while testing
      setTimeout(() => {
        setPrinters(prev => prev.map(p => {
          if (p.id === id) {
            const isOnline = Math.random() > 0.1; // 90% chance of success
            return { ...p, isOnline, latency: isOnline ? Math.floor(Math.random() * 30) + 5 : undefined };
          }
          return p;
        }));
        resolve();
      }, 800);
    });
  }, []);

  const printToRole = useCallback(async (role: 'Customer' | 'Kitchen', content: string) => {
    const targets = printers.filter(p => p.role === role || p.role === 'Both');
    const results = [];
    
    for (const printer of targets) {
      if (!printer.isOnline) {
        results.push({ success: false, bytes: '', printerName: printer.name });
        continue;
      }
      
      // Simulate raw ESC/POS byte sequence generation
      let bytesPreview = `[ESC] @\n`; // Init
      if (printer.buzzer) bytesPreview += `[ESC] ( A (Buzzer)\n`;
      bytesPreview += `[Raw Text: ${content.substring(0, 30)}...]\n`;
      if (printer.autoCut) bytesPreview += `[GS] V 0 (Cut)\n`;
      if (printer.cashDrawer) bytesPreview += `[ESC] p 0 25 250 (Kick Drawer)\n`;
      
      results.push({ success: true, bytes: bytesPreview, printerName: printer.name });
    }
    
    return results;
  }, [printers]);

  const addScan = useCallback((barcode: string) => {
    setScanQueue(prev => [...prev, { id: Date.now().toString() + Math.random(), barcode, timestamp: new Date() }]);
    
    // Dispatch a custom event for loose coupling if needed
    const event = new CustomEvent('ITEM_LOOKUP', { detail: { barcode } });
    window.dispatchEvent(event);
  }, []);

  const consumeScan = useCallback((id: string) => {
    setScanQueue(prev => prev.filter(scan => scan.id !== id));
  }, []);

  const simulateScan = useCallback((barcode: string) => {
    addScan(barcode);
  }, [addScan]);

  const connectScanner = useCallback(async () => {
    if (!isScannerSupported) {
      alert('Web Serial API is not supported in this browser. (Use Chrome/Edge on Desktop)');
      return;
    }

    try {
      // @ts-ignore
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      setIsScannerConnected(true);

      // @ts-ignore
      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();
      readerRef.current = reader;

      let buffer = '';

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) {
            buffer += value;
            if (buffer.includes('\n') || buffer.includes('\r')) {
              const scannedCode = buffer.replace(/[\r\n]/g, '').trim();
              if (scannedCode) {
                addScan(scannedCode);
              }
              buffer = '';
            }
          }
        }
      } catch (error) {
        console.error('Error reading from serial port', error);
      } finally {
        reader.releaseLock();
        setIsScannerConnected(false);
      }
    } catch (error: any) {
      if (error?.name === 'NotFoundError') {
        console.log('Scanner port selection cancelled by user.');
        return;
      }
      console.error('Serial connection failed:', error);
      if (error?.message && error.message.includes('permissions policy')) {
        alert('Scanner connection blocked by iframe permissions. Please open the app in a new tab to use hardware features.');
      } else {
        alert('Failed to connect to scanner: ' + (error?.message || error || 'Unknown error'));
      }
    }
  }, [isScannerSupported, addScan]);

  const disconnectScanner = useCallback(async () => {
    if (readerRef.current) {
      await readerRef.current.cancel();
      readerRef.current = null;
    }
    setIsScannerConnected(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (readerRef.current) {
        readerRef.current.cancel();
      }
    };
  }, []);

  return (
    <HardwareContext.Provider value={{
      isScannerSupported,
      isScannerConnected,
      connectScanner,
      disconnectScanner,
      scanQueue,
      consumeScan,
      simulateScan,
      printers,
      addPrinter,
      updatePrinter,
      removePrinter,
      discoverPrinters,
      pingPrinter,
      printToRole
    }}>
      {children}
    </HardwareContext.Provider>
  );
}

export function useHardware() {
  const context = useContext(HardwareContext);
  if (context === undefined) {
    throw new Error('useHardware must be used within a HardwareProvider');
  }
  return context;
}
