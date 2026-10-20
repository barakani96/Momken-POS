import React, { useState, useEffect } from 'react';
import { Stack, Grid, Column, Tile, Button, PasswordInput, InlineNotification, ContentSwitcher, Switch } from '@carbon/react';
import { UserAvatar, CheckmarkOutline, CloseOutline, Locked, UserAdmin } from '@carbon/icons-react';
import { mockCashiers, Cashier } from '../data/mockCashiers';
import CarbonLoginForm from './CarbonLoginForm';

interface CashierLockScreenProps {
  onLogin: (cashier: Cashier) => void;
}

export default function CashierLockScreen({ onLogin }: CashierLockScreenProps) {
  const [loginMode, setLoginMode] = useState<'enterprise' | 'pin'>('enterprise');
  const [selectedCashier, setSelectedCashier] = useState<Cashier | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  // Listen for barcode badge scans
  useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 50) {
        buffer = '';
      }
      lastKeyTime = currentTime;

      if (e.key === 'Enter') {
        if (buffer.length > 2) {
          const matched = mockCashiers.find(c => c.badgeId.toLowerCase() === buffer.toLowerCase());
          if (matched) {
            onLogin(matched);
          } else {
            setError(true);
            setTimeout(() => setError(false), 3000);
          }
        }
        buffer = '';
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onLogin]);

  const handleKeypadPress = (val: string) => {
    setError(false);
    if (val === 'clear') {
      setPin('');
    } else if (val === 'enter') {
      if (selectedCashier && pin === selectedCashier.pin) {
        onLogin(selectedCashier);
      } else {
        setError(true);
        setPin('');
      }
    } else {
      setPin(prev => (prev.length < 10 ? prev + val : prev));
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--cds-background)', padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '1.5rem', width: '100%', maxWidth: '420px' }}>
        <ContentSwitcher onChange={(e) => setLoginMode(e.name as 'enterprise' | 'pin')} selectedIndex={loginMode === 'enterprise' ? 0 : 1}>
          <Switch name="enterprise" text="Enterprise Login (Carbon Pattern)" />
          <Switch name="pin" text="Quick PIN / Badge Scanner" />
        </ContentSwitcher>
      </div>

      {loginMode === 'enterprise' ? (
        <CarbonLoginForm onLoginSuccess={onLogin} />
      ) : !selectedCashier ? (
        <Stack gap={6} style={{ width: '100%', maxWidth: '800px' }}>
          <div style={{ textAlign: 'center' }}>
            <Locked size={48} style={{ marginBottom: '1rem', color: 'var(--cds-text-secondary)' }} />
            <h1 className="heading-05">Select Cashier Profile</h1>
            <p className="body-02" style={{ color: 'var(--cds-text-secondary)', marginTop: '0.5rem' }}>Scan your badge or select your profile to enter PIN</p>
          </div>
          
          {error && (
            <InlineNotification
              kind="error"
              title="Invalid Badge"
              subtitle="The scanned badge ID does not match any cashier."
              onClose={() => setError(false)}
            />
          )}

          <Grid narrow>
            {mockCashiers.map(cashier => (
              <Column sm={4} md={4} lg={4} key={cashier.id} style={{ marginBottom: '1rem' }}>
                <Tile 
                  onClick={() => setSelectedCashier(cashier)}
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem', border: '1px solid var(--cds-border-subtle)' }}
                >
                  <div style={{ 
                    width: '64px', height: '64px', borderRadius: '50%', 
                    backgroundColor: cashier.avatarColor, color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <UserAvatar size={32} />
                  </div>
                  <h3 className="heading-03">{cashier.name}</h3>
                  <p className="label-01" style={{ color: 'var(--cds-text-secondary)' }}>{cashier.role}</p>
                </Tile>
              </Column>
            ))}
          </Grid>
        </Stack>
      ) : (
        <Stack gap={6} style={{ width: '100%', maxWidth: '400px', padding: '2rem', backgroundColor: 'var(--cds-layer-01)', border: '1px solid var(--cds-border-subtle)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '64px', height: '64px', borderRadius: '50%', 
              backgroundColor: selectedCashier.avatarColor, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <UserAvatar size={32} />
            </div>
            <h2 className="heading-04">Welcome, {selectedCashier.name}</h2>
            <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>Enter your PIN to continue</p>
          </div>

          {error && (
            <InlineNotification
              kind="error"
              title="Incorrect PIN"
              subtitle="Please try again."
              onClose={() => setError(false)}
            />
          )}

          <PasswordInput
            id="pin-input"
            labelText="PIN Code"
            value={pin}
            readOnly
            size="lg"
            placeholder="••••"
          />

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '0.5rem',
            marginTop: '1rem' 
          }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'enter'].map((key) => (
              <Button
                key={key}
                kind={key === 'enter' ? 'primary' : key === 'clear' ? 'danger--tertiary' : 'tertiary'}
                onClick={() => handleKeypadPress(key)}
                style={{ width: '100%', height: '64px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.25rem' }}
              >
                {key === 'enter' ? <CheckmarkOutline size={24} /> : key === 'clear' ? <CloseOutline size={24} /> : key}
              </Button>
            ))}
          </div>
          
          <Button kind="ghost" onClick={() => { setSelectedCashier(null); setPin(''); setError(false); }} style={{ width: '100%' }}>
            Back to Cashier List
          </Button>
        </Stack>
      )}
    </div>
  );
}
