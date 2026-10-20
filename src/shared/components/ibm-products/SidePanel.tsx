import React, { ReactNode, useEffect } from 'react';
import { Button, ButtonSet, IconButton } from '@carbon/react';
import { Close } from '@carbon/icons-react';

export type SidePanelSize = 'xs' | 'sm' | 'md' | 'lg' | 'max';

export interface SidePanelProps {
  open: boolean;
  onClose?: () => void;
  onRequestClose?: () => void;
  title: string;
  subtitle?: string;
  size?: SidePanelSize;
  placement?: 'right' | 'left';
  slideIn?: boolean;
  preventCloseOnClickOutside?: boolean;
  primaryButtonText?: string;
  primaryButtonDisabled?: boolean;
  onPrimaryClick?: () => void;
  onPrimaryAction?: () => void;
  secondaryButtonText?: string;
  onSecondaryClick?: () => void;
  onSecondaryAction?: () => void;
  headerActions?: ReactNode;
  children: ReactNode;
}

const sizeWidthMap: Record<SidePanelSize, string> = {
  xs: '320px',
  sm: '380px',
  md: '480px',
  lg: '640px',
  max: '768px',
};

export const SidePanel: React.FC<SidePanelProps> = ({
  open,
  onClose,
  onRequestClose,
  title,
  subtitle,
  size = 'md',
  placement = 'right',
  preventCloseOnClickOutside = false,
  primaryButtonText,
  primaryButtonDisabled = false,
  onPrimaryClick,
  onPrimaryAction,
  secondaryButtonText,
  onSecondaryClick,
  onSecondaryAction,
  headerActions,
  children,
}) => {
  const handleClose = onClose || onRequestClose || (() => {});
  const handlePrimary = onPrimaryClick || onPrimaryAction;
  const handleSecondary = onSecondaryClick || onSecondaryAction;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handleClose]);

  if (!open) return null;

  const panelWidth = sizeWidthMap[size];

  return (
    <div
      className="c4p--side-panel__container"
      style={{
        position: 'fixed',
        top: '3rem', // Carbon header height
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        display: 'flex',
        justifyContent: placement === 'right' ? 'flex-end' : 'flex-start',
        pointerEvents: 'auto',
      }}
    >
      {/* Overlay Backdrop */}
      <div
        onClick={() => {
          if (!preventCloseOnClickOutside) {
            onClose();
          }
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(22, 22, 22, 0.45)',
          backdropFilter: 'blur(2px)',
          transition: 'opacity 200ms ease',
        }}
      />

      {/* Side Panel Sheet */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: panelWidth,
          height: '100%',
          backgroundColor: 'var(--cds-layer-01)',
          borderLeft: placement === 'right' ? '1px solid var(--cds-border-subtle)' : 'none',
          borderRight: placement === 'left' ? '1px solid var(--cds-border-subtle)' : 'none',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
          animation: 'sidePanelSlideIn 240ms cubic-bezier(0, 0, 0.38, 0.9) forwards',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--cds-border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            backgroundColor: 'var(--cds-layer-01)',
          }}
        >
          <div style={{ flex: 1, paddingRight: '1rem' }}>
            <h2
              className="heading-03"
              style={{
                margin: 0,
                color: 'var(--cds-text-primary)',
                fontWeight: 600,
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className="body-01"
                style={{
                  margin: '0.25rem 0 0 0',
                  color: 'var(--cds-text-secondary)',
                  fontSize: '0.875rem',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {headerActions}
            <IconButton
              label="Close panel"
              kind="ghost"
              size="md"
              align="left"
              onClick={handleClose}
            >
              <Close size={20} />
            </IconButton>
          </div>
        </div>

        {/* Scrollable Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            backgroundColor: 'var(--cds-background)',
          }}
        >
          {children}
        </div>

        {/* Footer with Action Buttons */}
        {(primaryButtonText || secondaryButtonText) && (
          <div
            style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--cds-border-subtle)',
              backgroundColor: 'var(--cds-layer-01)',
            }}
          >
            <ButtonSet>
              {secondaryButtonText && (
                <Button
                  kind="secondary"
                  size="lg"
                  onClick={handleSecondary || handleClose}
                  style={{ flex: 1, maxWidth: '100%' }}
                >
                  {secondaryButtonText}
                </Button>
              )}
              {primaryButtonText && (
                <Button
                  kind="primary"
                  size="lg"
                  onClick={handlePrimary}
                  disabled={primaryButtonDisabled}
                  style={{ flex: 1, maxWidth: '100%' }}
                >
                  {primaryButtonText}
                </Button>
              )}
            </ButtonSet>
          </div>
        )}
      </aside>
    </div>
  );
};
