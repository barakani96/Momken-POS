import React from 'react';
import { 
  Tabs, TabList, Tab, TabPanels, TabPanel,
  Tile, Grid, Row, Column, Button
} from '@carbon/react';
import { Add } from '@carbon/icons-react';

export default function PromotionsEngine() {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-05">Promotions & Bundles Engine</h1>
        <Button renderIcon={Add} iconDescription="Create Rule">Create Rule</Button>
      </div>

      <Tabs>
        <TabList aria-label="Promotions Tabs">
          <Tab>Active Rules</Tab>
          <Tab>Coupon Codes</Tab>
          <Tab>Value Bundles</Tab>
        </TabList>
        <TabPanels>
          <TabPanel style={{ padding: '1rem 0' }}>
            <Grid fullWidth style={{ padding: 0 }}>
              <Row>
                <Column sm={4} md={4} lg={4}>
                  <Tile style={{ marginBottom: '1rem' }}>
                    <h3 className="heading-02" style={{ marginBottom: '0.5rem' }}>BOGO Free - Espresso</h3>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1rem' }}>
                      Buy one Espresso, get the second one free. Automatically applied at checkout.
                    </p>
                    <span style={{ backgroundColor: 'var(--cds-support-success)', color: 'white', padding: '0.2rem 0.5rem', fontSize: '12px' }}>Active</span>
                  </Tile>
                </Column>
                <Column sm={4} md={4} lg={4}>
                  <Tile style={{ marginBottom: '1rem' }}>
                    <h3 className="heading-02" style={{ marginBottom: '0.5rem' }}>10% Off Orders &gt; $50</h3>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1rem' }}>
                      Threshold volume discount applied to the entire subtotal when &gt; $50.
                    </p>
                    <span style={{ backgroundColor: 'var(--cds-support-success)', color: 'white', padding: '0.2rem 0.5rem', fontSize: '12px' }}>Active</span>
                  </Tile>
                </Column>
              </Row>
            </Grid>
          </TabPanel>
          <TabPanel style={{ padding: '1rem 0' }}>
            <p>Coupon code management interface will be shown here.</p>
          </TabPanel>
          <TabPanel style={{ padding: '1rem 0' }}>
            <p>Breakfast combos and specific SKU bundling definitions will be shown here.</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
