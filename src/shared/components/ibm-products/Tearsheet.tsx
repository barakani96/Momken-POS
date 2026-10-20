import React, { ReactNode, useEffect } from 'react';
import {
  Button,
  ButtonSet,
  IconButton,
  ProgressIndicator,
  ProgressStep,
  Stack,
  Tag,
} from '@carbon/react';
import { Close } from '@carbon/icons-react';

export interface TearsheetStep {
  label: string;
  secondaryLabel?: string;
  disabled?: boolean;
}

export interface TearsheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  label?: string;
  influencer?: ReactNode;
  influencerPosition?: 'left' | 'right';
  influencerWidth?: 'narrow' | 'wide';
  steps?: TearsheetStep[];
  currentStep?: number;
  onStepChange?: (stepIndex: number) => void;
  primaryButtonText?: string;
  primaryButtonDisabled?: boolean;
  onPrimaryClick?: () => void;
  secondaryButtonText?: string;
  onSecondaryClick?: () => void;
  children: ReactNode;
  narrow?: boolean;
}

export const Tearsheet: React.FC<TearsheetProps> = ({
  open,
  onClose,
  title,
  description,
  label,
  influencer,
  influencerPosition = 'right',
  influencerWidth = 'narrow',
  steps,
  currentStep = 0,
  onStepChange,
  primaryButtonText = 'Submit',
  primaryButtonDisabled = false,
  onPrimaryClick,
  secondaryButtonText = 'Cancel',
  onSecondaryClick,
  children,
  narrow = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const influencerWidthPx = influencerWidth === 'wide' ? '320px' : '256px';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={`c4p--tearsheet ${narrow ? 'c4p--tearsheet--narrow' : 'c4p--tearsheet--wide'}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(22, 22, 22, 0.65)',
        backdropFilter: 'blur(3px)',
        padding: narrow ? '2rem 1rem' : '1.5rem',
      }}
    >
      {/* Tearsheet Container Box */}
      <div
        style={{
          width: '100%',
          maxWidth: narrow ? '512px' : '1200px',
          height: narrow ? 'auto' : '88vh',
          maxHeight: narrow ? '90vh' : '900px',
          backgroundColor: 'var(--cds-layer-01)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 0,
          border: '1px solid var(--cds-border-subtle)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid var(--cds-border-subtle)',
            backgroundColor: 'var(--cds-layer-01)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <div style={{ flex: 1 }}>
            {label && (
              <span
                className="label-01"
                style={{
                  color: 'var(--cds-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'block',
                  marginBottom: '0.25rem',
                }}
              >
                {label}
              </span>
            )}
            <h2 className="heading-04" style={{ margin: '0 0 0.25rem 0', fontWeight: 600 }}>
              {title}
            </h2>
            {description && (
              <p
                className="body-01"
                style={{ margin: 0, color: 'var(--cds-text-secondary)', maxWidth: '780px' }}
              >
                {description}
              </p>
            )}
          </div>

          <IconButton label="Close tearsheet" kind="ghost" size="md" align="bottom" onClick={onClose}>
            <Close size={20} />
          </IconButton>
        </div>

        {/* Progress Indicator (if multi-step) */}
        {steps && steps.length > 0 && !narrow && (
          <div
            style={{
              padding: '1rem 2rem',
              borderBottom: '1px solid var(--cds-border-subtle)',
              backgroundColor: 'var(--cds-layer-02)',
            }}
          >
            <ProgressIndicator
              currentIndex={currentStep}
              onChange={(newStep) => onStepChange && onStepChange(newStep)}
            >
              {steps.map((step, idx) => (
                <ProgressStep
                  key={idx}
                  label={step.label}
                  secondaryLabel={step.secondaryLabel}
                  disabled={step.disabled}
                />
              ))}
            </ProgressIndicator>
          </div>
        )}

        {/* Middle Body Area (with optional influencer panel) */}
        <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {/* Left Influencer */}
          {influencer && influencerPosition === 'left' && !narrow && (
            <div
              style={{
                width: influencerWidthPx,
                borderRight: '1px solid var(--cds-border-subtle)',
                backgroundColor: 'var(--cds-layer-02)',
                padding: '1.5rem',
                overflowY: 'auto',
              }}
            >
              {influencer}
            </div>
          )}

          {/* Main Content Pane */}
          <div
            style={{
              flex: 1,
              padding: '1.75rem 2rem',
              overflowY: 'auto',
              backgroundColor: 'var(--cds-background)',
            }}
          >
            {children}
          </div>

          {/* Right Influencer */}
          {influencer && influencerPosition === 'right' && !narrow && (
            <div
              style={{
                width: influencerWidthPx,
                borderLeft: '1px solid var(--cds-border-subtle)',
                backgroundColor: 'var(--cds-layer-02)',
                padding: '1.5rem',
                overflowY: 'auto',
              }}
            >
              {influencer}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 2rem',
            borderTop: '1px solid var(--cds-border-subtle)',
            backgroundColor: 'var(--cds-layer-01)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <ButtonSet>
            {secondaryButtonText && (
              <Button kind="secondary" size="lg" onClick={onSecondaryClick || onClose}>
                {secondaryButtonText}
              </Button>
            )}
            {primaryButtonText && (
              <Button
                kind="primary"
                size="lg"
                onClick={onPrimaryClick}
                disabled={primaryButtonDisabled}
              >
                {primaryButtonText}
              </Button>
            )}
          </ButtonSet>
        </div>
      </div>
    </div>
  );
};

export const TearsheetNarrow: React.FC<Omit<TearsheetProps, 'narrow' | 'influencer' | 'steps'>> = (
  props
) => {
  return <Tearsheet {...props} narrow={true} />;
};
