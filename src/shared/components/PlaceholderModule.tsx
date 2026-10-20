import React from 'react';
import { Stack, Button, Link } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Folder } from '@carbon/icons-react';
import { useNavigate } from 'react-router-dom';

export default function PlaceholderModule({ translationKey }: { translationKey: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const title = t(translationKey);
  
  return (
    <div style={{ padding: '2rem' }}>
      <Stack gap={5}>
        <div>
          <h2 className="heading-05" style={{ marginBottom: '0.25rem' }}>{title}</h2>
          <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
            Enterprise multi-channel {title.toLowerCase()} service running on IBM Carbon Design System.
          </p>
        </div>
        
        <div style={{
          padding: '4rem 2rem',
          backgroundColor: 'var(--cds-layer-01)',
          border: '1px solid var(--cds-border-subtle)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '450px',
          textAlign: 'center'
        }}>
          <Stack gap={5} style={{ alignItems: 'center', maxWidth: '420px' }}>
            <Folder size={48} style={{ color: 'var(--cds-icon-secondary)' }} />
            <Stack gap={3}>
              <h3 className="heading-03">No active {title.toLowerCase()} records</h3>
              <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                Connect warehouse endpoints or import global data records to configure {title.toLowerCase()}.
              </p>
            </Stack>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                kind="primary"
                renderIcon={ArrowRight}
                iconDescription={`Configure ${title}`}
                onClick={() => navigate('/settings')}
              >
                Configure {title}
              </Button>
              <Link
                href="#"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  navigate('/patterns');
                }}
              >
                Explore Patterns Gallery
              </Link>
            </div>
          </Stack>
        </div>
      </Stack>
    </div>
  );
}
