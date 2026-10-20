import React from 'react';
import { Button, ButtonSet, Tag } from '@carbon/react';
import {
  ErrorFilled,
  WarningFilled,
  Locked,
  DocumentUnknown,
  Home,
  Renew,
} from '@carbon/icons-react';

export type ErrorKind = '404' | '403' | '500' | 'maintenance' | 'custom';

export interface FullPageErrorProps {
  kind?: ErrorKind;
  title?: string;
  subtitle?: string;
  description?: string;
  errorCode?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  nextSteps?: string[];
}

export const FullPageError: React.FC<FullPageErrorProps> = ({
  kind = '404',
  title,
  subtitle,
  description,
  errorCode,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  nextSteps,
}) => {
  const getDefaults = () => {
    switch (kind) {
      case '403':
        return {
          icon: <Locked size={64} style={{ fill: 'var(--cds-support-error)' }} />,
          defaultTitle: 'Access restricted',
          defaultSubtitle: 'You do not have administrative privileges to access this POS terminal module.',
          defaultDesc: 'Please switch cashier credentials or request elevation from your store shift manager.',
          code: 'HTTP 403 Forbidden',
          tagType: 'red' as const,
        };
      case '500':
        return {
          icon: <ErrorFilled size={64} style={{ fill: 'var(--cds-support-error)' }} />,
          defaultTitle: 'Internal system fault',
          defaultSubtitle: 'An unexpected processing failure occurred while processing this transaction.',
          defaultDesc: 'The error has been logged locally in the offline diagnostic buffer. You can retry safely.',
          code: 'HTTP 500 Internal Error',
          tagType: 'red' as const,
        };
      case 'maintenance':
        return {
          icon: <WarningFilled size={64} style={{ fill: 'var(--cds-support-warning)' }} />,
          defaultTitle: 'Scheduled store maintenance',
          defaultSubtitle: 'The central ERP sync service is temporarily undergoing routine updates.',
          defaultDesc: 'Your POS terminal remains fully operational in offline cache mode with local queueing.',
          code: 'Service Status: Standby',
          tagType: 'purple' as const,
        };
      case '404':
      default:
        return {
          icon: <DocumentUnknown size={64} style={{ fill: 'var(--cds-interactive)' }} />,
          defaultTitle: 'Page or resource not found',
          defaultSubtitle: 'The requested route, register layout, or product record could not be located.',
          defaultDesc: 'Check the URL path or verify your branch configuration in Settings.',
          code: 'HTTP 404 Not Found',
          tagType: 'cool-gray' as const,
        };
    }
  };

  const defaults = getDefaults();

  return (
    <div
      className="c4p--full-page-error"
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--cds-background)',
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Icon */}
        <div style={{ marginBottom: '1.5rem' }}>{defaults.icon}</div>

        {/* Error Code Tag */}
        <Tag type={defaults.tagType} size="md" style={{ marginBottom: '1rem' }}>
          {errorCode || defaults.code}
        </Tag>

        {/* Heading */}
        <h1 className="heading-05" style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>
          {title || defaults.defaultTitle}
        </h1>

        {/* Subtitle */}
        <p
          className="heading-02"
          style={{
            margin: '0 0 1rem 0',
            color: 'var(--cds-text-secondary)',
            fontWeight: 400,
          }}
        >
          {subtitle || defaults.defaultSubtitle}
        </p>

        {/* Description */}
        <p
          className="body-01"
          style={{
            margin: '0 0 2rem 0',
            color: 'var(--cds-text-secondary)',
            lineHeight: 1.6,
          }}
        >
          {description || defaults.defaultDesc}
        </p>

        {/* Suggested Next Steps */}
        {nextSteps && nextSteps.length > 0 && (
          <div
            style={{
              width: '100%',
              backgroundColor: 'var(--cds-layer-01)',
              border: '1px solid var(--cds-border-subtle)',
              padding: '1.25rem 1.5rem',
              marginBottom: '2rem',
              textAlign: 'left',
            }}
          >
            <h4 className="heading-01" style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>
              Suggested Next Steps:
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {nextSteps.map((step, idx) => (
                <li key={idx} className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <ButtonSet>
          <Button
            kind="secondary"
            renderIcon={Renew}
            iconDescription={secondaryActionLabel || 'Retry Action'}
            onClick={onSecondaryAction || (() => window.location.reload())}
          >
            {secondaryActionLabel || 'Retry Action'}
          </Button>
          <Button
            kind="primary"
            renderIcon={Home}
            iconDescription={primaryActionLabel || 'Return to POS'}
            onClick={onPrimaryAction || (() => (window.location.href = '/pos'))}
          >
            {primaryActionLabel || 'Return to POS'}
          </Button>
        </ButtonSet>
      </div>
    </div>
  );
};
