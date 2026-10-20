import React, { ReactNode } from 'react';
import {
  Tag,
  Button,
  OverflowMenu,
  OverflowMenuItem,
} from '@carbon/react';
import { ArrowRight } from '@carbon/icons-react';

export interface CardAction {
  label: string;
  kind?: 'primary' | 'secondary' | 'ghost' | 'tertiary';
  renderIcon?: any;
  onClick?: () => void;
  disabled?: boolean;
}

export interface ProductiveCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  label?: string;
  statusTag?: { label: string; type: 'blue' | 'green' | 'red' | 'purple' | 'cool-gray' | 'warm-gray' };
  metric?: string;
  metricLabel?: string;
  overflowActions?: Array<{ label: string; onClick: () => void; isDelete?: boolean }>;
  primaryAction?: CardAction;
  secondaryAction?: CardAction;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

export const ProductiveCard: React.FC<ProductiveCardProps> = ({
  title,
  subtitle,
  description,
  label,
  statusTag,
  metric,
  metricLabel,
  overflowActions,
  primaryAction,
  secondaryAction,
  onClick,
  children,
  className = '',
}) => {
  return (
    <div
      className={`c4p--productive-card ${className}`}
      onClick={onClick}
      style={{
        backgroundColor: 'var(--cds-layer-01)',
        border: '1px solid var(--cds-border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
      }}
    >
      {/* Card Header */}
      <div
        style={{
          padding: '1.25rem 1.25rem 0.75rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ flex: 1 }}>
          {label && (
            <span
              className="label-01"
              style={{
                color: 'var(--cds-text-secondary)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.25rem',
              }}
            >
              {label}
            </span>
          )}
          <h3
            className="heading-02"
            style={{
              margin: '0 0 0.125rem 0',
              fontWeight: 600,
              color: 'var(--cds-text-primary)',
            }}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="body-01" style={{ margin: 0, color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
              {subtitle}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {statusTag && (
            <Tag size="sm" type={statusTag.type}>
              {statusTag.label}
            </Tag>
          )}
          {overflowActions && overflowActions.length > 0 && (
            <OverflowMenu flipped size="sm" ariaLabel="Card actions">
              {overflowActions.map((action, idx) => (
                <OverflowMenuItem
                  key={idx}
                  itemText={action.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                  isDelete={action.isDelete}
                />
              ))}
            </OverflowMenu>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '0 1.25rem 1rem 1.25rem', flex: 1 }}>
        {metric && (
          <div style={{ margin: '0.5rem 0' }}>
            <div className="heading-05" style={{ fontWeight: 600, color: 'var(--cds-text-primary)' }}>
              {metric}
            </div>
            {metricLabel && (
              <div className="label-01" style={{ color: 'var(--cds-text-secondary)', fontSize: '0.75rem' }}>
                {metricLabel}
              </div>
            )}
          </div>
        )}

        {description && (
          <p className="body-01" style={{ margin: '0.25rem 0 0.5rem 0', color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
            {description}
          </p>
        )}

        {children}
      </div>

      {/* Card Footer */}
      {(primaryAction || secondaryAction) && (
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid var(--cds-border-subtle)',
            backgroundColor: 'var(--cds-layer-02)',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          {secondaryAction && (
            <Button
              kind={secondaryAction.kind || 'ghost'}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (secondaryAction.onClick) secondaryAction.onClick();
              }}
              renderIcon={secondaryAction.renderIcon}
              iconDescription={secondaryAction.renderIcon ? secondaryAction.label : undefined}
              disabled={secondaryAction.disabled}
            >
              {secondaryAction.label}
            </Button>
          )}
          {primaryAction && (
            <Button
              kind={primaryAction.kind || 'primary'}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (primaryAction.onClick) primaryAction.onClick();
              }}
              renderIcon={primaryAction.renderIcon || ArrowRight}
              iconDescription={primaryAction.label}
              disabled={primaryAction.disabled}
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export interface ExpressiveCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  label?: string;
  media?: ReactNode;
  tags?: Array<{ label: string; type: 'blue' | 'green' | 'red' | 'purple' | 'cool-gray' }>;
  primaryAction?: CardAction;
  secondaryAction?: CardAction;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

export const ExpressiveCard: React.FC<ExpressiveCardProps> = ({
  title,
  subtitle,
  description,
  label,
  media,
  tags,
  primaryAction,
  secondaryAction,
  onClick,
  children,
  className = '',
}) => {
  return (
    <div
      className={`c4p--expressive-card ${className}`}
      onClick={onClick}
      style={{
        backgroundColor: 'var(--cds-layer-01)',
        border: '1px solid var(--cds-border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {/* Media slot */}
      {media && (
        <div
          style={{
            width: '100%',
            height: '180px',
            overflow: 'hidden',
            backgroundColor: 'var(--cds-layer-02)',
            borderBottom: '1px solid var(--cds-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {media}
        </div>
      )}

      {/* Header & Body */}
      <div style={{ padding: '1.5rem', flex: 1 }}>
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

        <h3 className="heading-03" style={{ margin: '0 0 0.25rem 0', fontWeight: 600 }}>
          {title}
        </h3>

        {subtitle && (
          <p className="body-01" style={{ margin: '0 0 0.5rem 0', color: 'var(--cds-text-secondary)' }}>
            {subtitle}
          </p>
        )}

        {tags && tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', margin: '0.75rem 0', flexWrap: 'wrap' }}>
            {tags.map((t, idx) => (
              <Tag key={idx} type={t.type} size="md">
                {t.label}
              </Tag>
            ))}
          </div>
        )}

        {description && (
          <p className="body-01" style={{ margin: '0.5rem 0 0 0', color: 'var(--cds-text-secondary)', lineHeight: 1.5 }}>
            {description}
          </p>
        )}

        {children}
      </div>

      {/* Footer Actions */}
      {(primaryAction || secondaryAction) && (
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--cds-border-subtle)',
            backgroundColor: 'var(--cds-layer-02)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {secondaryAction ? (
            <Button
              kind={secondaryAction.kind || 'ghost'}
              size="md"
              onClick={(e) => {
                e.stopPropagation();
                if (secondaryAction.onClick) secondaryAction.onClick();
              }}
              renderIcon={secondaryAction.renderIcon}
              iconDescription={secondaryAction.renderIcon ? secondaryAction.label : undefined}
            >
              {secondaryAction.label}
            </Button>
          ) : <div />}

          {primaryAction && (
            <Button
              kind={primaryAction.kind || 'primary'}
              size="md"
              onClick={(e) => {
                e.stopPropagation();
                if (primaryAction.onClick) primaryAction.onClick();
              }}
              renderIcon={primaryAction.renderIcon || ArrowRight}
              iconDescription={primaryAction.label}
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  status,
  onClick,
  className = '',
}) => {
  const getStatusColor = () => {
    if (status === 'success') return 'var(--cds-support-success, #24a148)';
    if (status === 'warning') return 'var(--cds-support-warning, #f1c21b)';
    if (status === 'error') return 'var(--cds-support-error, #da1e28)';
    if (status === 'info') return 'var(--cds-support-info, #0f62fe)';
    return undefined;
  };

  return (
    <div
      className={`c4p--metric-card ${className}`}
      onClick={onClick}
      style={{
        backgroundColor: 'var(--cds-layer-01)',
        border: '1px solid var(--cds-border-subtle)',
        padding: '1.25rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        transition: 'border-color 150ms ease',
      }}
    >
      <div>
        <span
          className="label-01"
          style={{
            color: 'var(--cds-text-secondary)',
            fontSize: '0.75rem',
            display: 'block',
            marginBottom: '0.5rem',
          }}
        >
          {title}
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span
            className="heading-05"
            style={{
              fontWeight: 600,
              color: getStatusColor() || 'var(--cds-text-primary)',
              fontSize: '1.75rem',
            }}
          >
            {value}
          </span>
          {trendValue && (
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: trend === 'up' ? 'var(--cds-support-success, #24a148)' : trend === 'down' ? 'var(--cds-support-error, #da1e28)' : 'var(--cds-text-secondary)',
              }}
            >
              {trendValue}
            </span>
          )}
        </div>
      </div>
      {subtitle && (
        <p
          className="body-01"
          style={{
            margin: '0.5rem 0 0 0',
            color: 'var(--cds-text-secondary)',
            fontSize: '0.8125rem',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
