import React from 'react';
import { Button } from '@carbon/react';
import { Undo } from '@carbon/icons-react';
import { useTranslation } from 'react-i18next';

interface TouchNumericKeypadProps {
  onInput: (value: string) => void;
  onClear: () => void;
  onBackspace: () => void;
}

export default function TouchNumericKeypad({ onInput, onClear, onBackspace }: TouchNumericKeypadProps) {
  const { t } = useTranslation();

  const handleNumClick = (num: string) => {
    onInput(num);
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '0.5rem',
      maxWidth: '300px',
      margin: '0 auto'
    }}>
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
        <Button 
          key={num} 
          kind="secondary" 
          onClick={() => handleNumClick(num)}
          style={{ width: '100%', height: '3rem', fontSize: '1.25rem' }}
        >
          {num}
        </Button>
      ))}
      <Button 
        kind="danger--ghost" 
        onClick={onClear}
        style={{ width: '100%', height: '3rem', fontSize: '1rem', border: '1px solid var(--cds-border-subtle)' }}
      >
        {t('keypad_clear')}
      </Button>
      <Button 
        kind="secondary" 
        onClick={() => handleNumClick('0')}
        style={{ width: '100%', height: '3rem', fontSize: '1.25rem' }}
      >
        0
      </Button>
      <Button 
        kind="ghost" 
        onClick={onBackspace}
        renderIcon={Undo}
        iconDescription="Backspace"
        hasIconOnly
        style={{ width: '100%', height: '3rem', border: '1px solid var(--cds-border-subtle)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      />
    </div>
  );
}
