import React, { useState, ReactNode } from 'react';
import {
  Button,
  ButtonSet,
  IconButton,
  Tag,
  Stack,
} from '@carbon/react';
import { Close, ArrowRight, ArrowLeft, Checkmark, Idea } from '@carbon/icons-react';

export interface InterstitialStep {
  title: string;
  subtitle?: string;
  description: string;
  media?: ReactNode;
  bullets?: string[];
  tag?: string;
}

export interface InterstitialScreenProps {
  open: boolean;
  onClose: () => void;
  onFinish?: () => void;
  headerTitle?: string;
  steps: InterstitialStep[];
}

export const InterstitialScreen: React.FC<InterstitialScreenProps> = ({
  open,
  onClose,
  onFinish,
  headerTitle = 'What’s new in Carbon POS',
  steps,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!open || steps.length === 0) return null;

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      if (onFinish) onFinish();
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={headerTitle}
      className="c4p--interstitial-screen"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(22, 22, 22, 0.7)',
        backdropFilter: 'blur(4px)',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '860px',
          backgroundColor: 'var(--cds-layer-01)',
          border: '1px solid var(--cds-border-subtle)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 2rem',
            borderBottom: '1px solid var(--cds-border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Idea size={20} style={{ fill: 'var(--cds-interactive)' }} />
            <h3 className="heading-02" style={{ margin: 0, fontWeight: 600 }}>
              {headerTitle}
            </h3>
            <Tag type="purple" size="sm">
              Step {currentStep + 1} of {steps.length}
            </Tag>
          </div>

          <IconButton label="Close" kind="ghost" size="md" align="bottom" onClick={onClose}>
            <Close size={20} />
          </IconButton>
        </div>

        {/* Content Body: Media + Text */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 1fr) minmax(320px, 1.2fr)',
            minHeight: '380px',
          }}
        >
          {/* Media / Visual Box */}
          <div
            style={{
              backgroundColor: 'var(--cds-layer-02)',
              borderRight: '1px solid var(--cds-border-subtle)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            {step.media || (
              <div
                style={{
                  width: '180px',
                  height: '180px',
                  backgroundColor: 'var(--cds-background)',
                  border: '1px solid var(--cds-border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Idea size={54} style={{ fill: 'var(--cds-interactive)' }} />
              </div>
            )}
          </div>

          {/* Text Description Box */}
          <div
            style={{
              padding: '2.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: 'var(--cds-background)',
            }}
          >
            {step.tag && (
              <Tag type="blue" size="sm" style={{ alignSelf: 'flex-start', marginBottom: '0.75rem' }}>
                {step.tag}
              </Tag>
            )}

            <h2 className="heading-04" style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>
              {step.title}
            </h2>

            {step.subtitle && (
              <p
                className="body-01"
                style={{
                  margin: '0 0 1rem 0',
                  color: 'var(--cds-text-secondary)',
                  fontWeight: 500,
                }}
              >
                {step.subtitle}
              </p>
            )}

            <p
              className="body-01"
              style={{
                margin: '0 0 1.5rem 0',
                color: 'var(--cds-text-secondary)',
                lineHeight: 1.6,
              }}
            >
              {step.description}
            </p>

            {step.bullets && step.bullets.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {step.bullets.map((b, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Checkmark size={16} style={{ fill: 'var(--cds-support-success)' }} />
                    <span className="body-01" style={{ color: 'var(--cds-text-primary)' }}>
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div
          style={{
            padding: '1.25rem 2rem',
            borderTop: '1px solid var(--cds-border-subtle)',
            backgroundColor: 'var(--cds-layer-01)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button kind="ghost" size="md" onClick={onClose}>
            Skip tour
          </Button>

          <ButtonSet>
            {!isFirstStep && (
              <Button kind="secondary" size="md" renderIcon={ArrowLeft} iconDescription="Previous step" onClick={handlePrev}>
                Previous
              </Button>
            )}
            <Button
              kind="primary"
              size="md"
              renderIcon={isLastStep ? Checkmark : ArrowRight}
              iconDescription={isLastStep ? 'Get Started' : 'Next step'}
              onClick={handleNext}
            >
              {isLastStep ? 'Get Started' : 'Next'}
            </Button>
          </ButtonSet>
        </div>
      </div>
    </div>
  );
};
