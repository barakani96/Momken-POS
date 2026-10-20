import React, { ReactNode } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Tag,
  Button,
  ButtonSet,
  Tabs,
  TabList,
  Tab,
  Stack,
  Grid,
  Column,
} from '@carbon/react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string; onClick?: () => void }>;
  tags?: Array<{ label: string; type?: 'blue' | 'green' | 'red' | 'purple' | 'cool-gray' | 'warm-gray' | 'high-contrast' | 'outline' }>;
  actionButtons?: Array<{
    label: string;
    kind?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
    renderIcon?: any;
    onClick?: () => void;
    disabled?: boolean;
  }>;
  tabs?: Array<{ label: string; key: string }>;
  activeTabIndex?: number;
  onTabChange?: (index: number) => void;
  children?: ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  tags,
  actionButtons,
  tabs,
  activeTabIndex = 0,
  onTabChange,
  children,
  className = '',
}) => {
  return (
    <div
      className={`c4p--page-header ${className}`}
      style={{
        backgroundColor: 'var(--cds-layer-01)',
        borderBottom: '1px solid var(--cds-border-subtle)',
        paddingTop: '1.5rem',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        paddingBottom: tabs && tabs.length > 0 ? '0' : '1.5rem',
        transition: 'background-color 150ms cubic-bezier(0.2, 0, 0.38, 0.9)',
      }}
    >
      {/* 1. Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div style={{ marginBottom: '0.75rem' }}>
          <Breadcrumb noTrailingSlash aria-label="Page navigation breadcrumb">
            {breadcrumbs.map((crumb, idx) => (
              <BreadcrumbItem
                key={idx}
                isCurrentPage={idx === breadcrumbs.length - 1}
                href={crumb.href || '#'}
                onClick={(e) => {
                  if (crumb.onClick) {
                    e.preventDefault();
                    crumb.onClick();
                  }
                }}
              >
                {crumb.label}
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        </div>
      )}

      {/* 2. Main Title Row + Action Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ flex: '1 1 500px' }}>
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              {tags.map((tag, idx) => (
                <Tag key={idx} type={tag.type || 'cool-gray'} size="md">
                  {tag.label}
                </Tag>
              ))}
            </div>
          )}

          {/* Heading */}
          <h1
            className="heading-05"
            style={{
              fontWeight: 600,
              color: 'var(--cds-text-primary)',
              margin: '0 0 0.25rem 0',
              lineHeight: 1.25,
            }}
          >
            {title}
          </h1>

          {/* Subtitle / Description */}
          {subtitle && (
            <p
              className="body-01"
              style={{
                color: 'var(--cds-text-secondary)',
                margin: 0,
                maxWidth: '850px',
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Buttons Bar */}
        {actionButtons && actionButtons.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <ButtonSet>
              {actionButtons.map((action, idx) => (
                <Button
                  key={idx}
                  kind={action.kind || (idx === actionButtons.length - 1 ? 'primary' : 'secondary')}
                  renderIcon={action.renderIcon}
                  iconDescription={action.renderIcon ? action.label : undefined}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  size="md"
                >
                  {action.label}
                </Button>
              ))}
            </ButtonSet>
          </div>
        )}
      </div>

      {/* 3. Optional Contextual Body Content */}
      {children && <div style={{ marginTop: '1rem' }}>{children}</div>}

      {/* 4. Page Header Tabs */}
      {tabs && tabs.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <Tabs
            selectedIndex={activeTabIndex}
            onChange={({ selectedIndex }) => onTabChange && onTabChange(selectedIndex)}
          >
            <TabList aria-label="Page Header Navigation Tabs" contained>
              {tabs.map((tab, idx) => (
                <Tab key={tab.key || idx}>{tab.label}</Tab>
              ))}
            </TabList>
          </Tabs>
        </div>
      )}
    </div>
  );
};
