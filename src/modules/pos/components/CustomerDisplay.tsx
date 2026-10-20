import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@carbon/react';
import { CheckmarkOutline } from '@carbon/icons-react';
import { CartItem } from '../pages/POS';

interface CustomerDisplayProps {
  cart: CartItem[];
  total: number;
  tax: number;
  subtotal: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerDisplay({ cart, total, tax, subtotal, isOpen, onClose }: CustomerDisplayProps) {
  const { t } = useTranslation();

  // Handle escape key to close this full screen overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'var(--cds-layer-01)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'row'
    }}>
      {/* Left Side: Order Details */}
      <div style={{
        flex: 1,
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--cds-border-subtle)',
        backgroundColor: 'var(--cds-background)'
      }}>
        <h2 className="heading-05" style={{ marginBottom: '2rem' }}>{t('current_order')}</h2>
        
        <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '2rem' }}>
          {cart.length === 0 ? (
            <p className="heading-03" style={{ color: 'var(--cds-text-secondary)' }}>{t('welcome')}</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--cds-border-subtle)', paddingBottom: '1.5rem' }}>
                <div style={{ flexGrow: 1, paddingRight: '1rem' }}>
                  <div className="heading-04">{item.name}</div>
                  <div className="heading-03" style={{ color: 'var(--cds-text-secondary)' }}>{item.qty} x ${item.price.toFixed(2)}</div>
                </div>
                <div className="heading-04">${(item.price * item.qty).toFixed(2)}</div>
              </div>
            ))
          )}
        </div>

        <Stack gap={4} style={{ borderTop: '2px solid var(--cds-border-strong)', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="heading-03" style={{ color: 'var(--cds-text-secondary)' }}>{t('subtotal')}</span>
            <span className="heading-03">${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="heading-03" style={{ color: 'var(--cds-text-secondary)' }}>{t('tax')}</span>
            <span className="heading-03">${tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <span className="heading-06">{t('order_total')}</span>
            <span className="heading-06" style={{ color: 'var(--cds-support-success)' }}>${total.toFixed(2)}</span>
          </div>
        </Stack>
      </div>

      {/* Right Side: Promotion / Welcome */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--cds-layer-accent-01)',
        padding: '3rem',
        textAlign: 'center'
      }}>
        {cart.length > 0 && total > 0 ? (
           <CheckmarkOutline size={120} style={{ color: 'var(--cds-support-success)', marginBottom: '2rem' }} />
        ) : null}
        <h1 className="heading-07" style={{ marginBottom: '1rem' }}>{t('welcome')}</h1>
        <p className="heading-04" style={{ color: 'var(--cds-text-secondary)' }}>{t('thank_you')}</p>
        
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--cds-text-secondary)', cursor: 'pointer', fontSize: '1rem', padding: '1rem' }}
        >
          ✕ {t('cancel')}
        </button>
      </div>
    </div>
  );
}
