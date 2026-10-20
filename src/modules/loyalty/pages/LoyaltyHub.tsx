import React from 'react';
import { Tile, Grid, Row, Column } from '@carbon/react';
import { Star } from '@carbon/icons-react';

export default function LoyaltyHub() {
  return (
    <div>
      <h1 className="heading-05" style={{ marginBottom: '2rem' }}>Customer Loyalty Program</h1>
      
      <Grid fullWidth style={{ padding: 0 }}>
        <Row>
          <Column sm={4} md={2} lg={3}>
            <Tile style={{ borderTop: '4px solid #cd7f32' }}>
              <h3 className="heading-02">Bronze Tier</h3>
              <p className="body-01" style={{ marginTop: '0.5rem', color: 'var(--cds-text-secondary)' }}>1x Points Multiplier</p>
              <p className="body-01" style={{ marginTop: '1rem' }}>0 - 1000 Points</p>
            </Tile>
          </Column>
          <Column sm={4} md={2} lg={3}>
            <Tile style={{ borderTop: '4px solid #c0c0c0' }}>
              <h3 className="heading-02">Silver Tier</h3>
              <p className="body-01" style={{ marginTop: '0.5rem', color: 'var(--cds-text-secondary)' }}>1.25x Points Multiplier</p>
              <p className="body-01" style={{ marginTop: '1rem' }}>1001 - 5000 Points</p>
            </Tile>
          </Column>
          <Column sm={4} md={2} lg={3}>
            <Tile style={{ borderTop: '4px solid #ffd700' }}>
              <h3 className="heading-02">Gold Tier</h3>
              <p className="body-01" style={{ marginTop: '0.5rem', color: 'var(--cds-text-secondary)' }}>1.5x Points Multiplier</p>
              <p className="body-01" style={{ marginTop: '1rem' }}>5001 - 20000 Points</p>
            </Tile>
          </Column>
          <Column sm={4} md={2} lg={3}>
            <Tile style={{ borderTop: '4px solid #e5e4e2' }}>
              <h3 className="heading-02">Platinum Tier</h3>
              <p className="body-01" style={{ marginTop: '0.5rem', color: 'var(--cds-text-secondary)' }}>2x Points Multiplier</p>
              <p className="body-01" style={{ marginTop: '1rem' }}>20001+ Points</p>
            </Tile>
          </Column>
        </Row>
      </Grid>
    </div>
  );
}
