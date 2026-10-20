import { useState, useRef, useCallback } from 'react';

interface UseSerialBarcodeScannerOptions {
  onBarcodeScanned: (barcode: string) => void;
}

export function useSerialBarcodeScanner({ onBarcodeScanned }: UseSerialBarcodeScannerOptions) {
  const [isSupported] = useState<boolean>('serial' in navigator);
  const [isConnected, setIsConnected] = useState(false);
  const readerRef = useRef<ReadableStreamDefaultReader<string> | null>(null);

  const connect = useCallback(async () => {
    if (!isSupported) {
      alert('Web Serial API is not supported in this browser. (Use Chrome/Edge on Desktop)');
      return;
    }

    try {
      // @ts-ignore - Web Serial API typings might not be fully available
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      setIsConnected(true);

      // @ts-ignore - TextDecoderStream is available in modern browsers
      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();
      readerRef.current = reader;

      let buffer = '';

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          if (value) {
            buffer += value;
            // Most serial barcode scanners terminate with a Carriage Return (\r) or Line Feed (\n)
            if (buffer.includes('\n') || buffer.includes('\r')) {
              const scannedCode = buffer.replace(/[\r\n]/g, '').trim();
              if (scannedCode) {
                onBarcodeScanned(scannedCode);
              }
              buffer = ''; // Reset buffer after successful scan
            }
          }
        }
      } catch (error) {
        console.error('Error reading from serial port', error);
      } finally {
        reader.releaseLock();
        setIsConnected(false);
      }
    } catch (error: any) {
      console.error('Serial connection failed:', error);
      if (error.name === 'NotFoundError') {
        // User cancelled port selection, do nothing silently
        console.log('Scanner port selection cancelled by user.');
      } else if (error.message && error.message.includes('permissions policy')) {
        alert('Scanner connection blocked by iframe permissions. Please open the app in a new tab to use hardware features.');
      } else {
        alert('Failed to connect to scanner: ' + error.message);
      }
    }
  }, [isSupported, onBarcodeScanned]);

  const disconnect = useCallback(async () => {
    if (readerRef.current) {
      await readerRef.current.cancel();
      readerRef.current = null;
    }
    setIsConnected(false);
  }, []);

  return {
    isSupported,
    isConnected,
    connect,
    disconnect
  };
}
