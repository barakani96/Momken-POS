import React from 'react';
import { Grid, Row, Column, Tile, Tabs, TabList, Tab, TabPanels, TabPanel, Link as CarbonLink } from '@carbon/react';
import { 
  Application, 
  ShoppingCart, 
  ChartBar, 
  Settings, 
  UserMultiple, 
  ConnectionSignal, 
  CloudApp, 
  Code
} from '@carbon/icons-react';

export default function EcosystemDashboard() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="heading-06" style={{ marginBottom: '1rem' }}>The Momken Ecosystem</h1>
        <p className="body-02" style={{ maxWidth: '800px', color: 'var(--cds-text-secondary)' }}>
          Momken POS is built on a modular ecosystem architecture, drawing inspiration from the Carbon Design System. 
          It consists of a robust core platform and specialized local modules that seamlessly integrate to 
          support complex retail and enterprise workflows.
        </p>
      </div>

      <Tabs>
        <TabList aria-label="Ecosystem navigation">
          <Tab>Core Platform</Tab>
          <Tab>Industry Modules</Tab>
          <Tab>Hardware & Integrations</Tab>
        </TabList>
        <TabPanels>
          {/* Core Platform */}
          <TabPanel>
            <Grid fullWidth style={{ padding: '1rem 0' }}>
              <Row>
                <Column sm={4} md={8} lg={16}>
                  <div style={{ marginBottom: '2rem' }}>
                    <h2 className="heading-04" style={{ marginBottom: '1rem' }}>Momken Core</h2>
                    <p className="body-01" style={{ maxWidth: '800px', color: 'var(--cds-text-secondary)' }}>
                      The Core Platform provides the foundational services, UI shell, authentication, and 
                      state management required across all modules. It guarantees a unified experience 
                      and strict adherence to accessibility and design language standards.
                    </p>
                  </div>
                </Column>
              </Row>
              <Row>
                <Column sm={4} md={4} lg={8} style={{ marginBottom: '1rem' }}>
                  <Tile style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Application size={32} style={{ marginBottom: '1rem', color: 'var(--cds-link-primary)' }} />
                    <h3 className="heading-03" style={{ marginBottom: '0.5rem' }}>Global UI Shell</h3>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)', flex: 1 }}>
                      A responsive, RTL-aware Carbon-based framework providing persistent navigation, 
                      spotlight search, and contextual app switching.
                    </p>
                  </Tile>
                </Column>
                <Column sm={4} md={4} lg={8} style={{ marginBottom: '1rem' }}>
                  <Tile style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Settings size={32} style={{ marginBottom: '1rem', color: 'var(--cds-link-primary)' }} />
                    <h3 className="heading-03" style={{ marginBottom: '0.5rem' }}>Centralized Configuration</h3>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)', flex: 1 }}>
                      Unified settings engine for enterprise multi-tenancy, localization, offline resilience, and hardware endpoint definitions.
                    </p>
                  </Tile>
                </Column>
                <Column sm={4} md={4} lg={8} style={{ marginBottom: '1rem' }}>
                  <Tile style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <UserMultiple size={32} style={{ marginBottom: '1rem', color: 'var(--cds-link-primary)' }} />
                    <h3 className="heading-03" style={{ marginBottom: '0.5rem' }}>Identity & Auth</h3>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)', flex: 1 }}>
                      Role-based access control (RBAC), cashier session locking, and secure credential handling across all touchpoints.
                    </p>
                  </Tile>
                </Column>
                <Column sm={4} md={4} lg={8} style={{ marginBottom: '1rem' }}>
                  <Tile style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <ChartBar size={32} style={{ marginBottom: '1rem', color: 'var(--cds-link-primary)' }} />
                    <h3 className="heading-03" style={{ marginBottom: '0.5rem' }}>Telemetry & Logging</h3>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)', flex: 1 }}>
                      Aggregated telemetry, Z-reports, and double-entry general ledger synchronization engines.
                    </p>
                  </Tile>
                </Column>
              </Row>
            </Grid>
          </TabPanel>

          {/* Industry Modules */}
          <TabPanel>
            <Grid fullWidth style={{ padding: '1rem 0' }}>
              <Row>
                <Column sm={4} md={8} lg={16}>
                  <div style={{ marginBottom: '2rem' }}>
                    <h2 className="heading-04" style={{ marginBottom: '1rem' }}>Specialized Pattern Asset Libraries (PALs)</h2>
                    <p className="body-01" style={{ maxWidth: '800px', color: 'var(--cds-text-secondary)' }}>
                      Industry Modules act like Carbon's local systems—extending the core with specialized 
                      workflows and components tailored for specific verticals like retail, hospitality, and B2B commerce.
                    </p>
                  </div>
                </Column>
              </Row>
              <Row>
                <Column sm={4} md={4} lg={8} style={{ marginBottom: '1rem' }}>
                  <Tile style={{ height: '100%', borderTop: '4px solid var(--cds-support-info)' }}>
                    <h3 className="heading-03" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ShoppingCart size={24} /> Momken Retail
                    </h3>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                      High-throughput checkout matrices, dynamic promotion engines, barcode scanning integrations, 
                      and localized consumer tax handling.
                    </p>
                    <CarbonLink href="/pos">Launch Retail POS</CarbonLink>
                  </Tile>
                </Column>
                <Column sm={4} md={4} lg={8} style={{ marginBottom: '1rem' }}>
                  <Tile style={{ height: '100%', borderTop: '4px solid var(--cds-support-warning)' }}>
                    <h3 className="heading-03" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Application size={24} /> Momken Hospitality
                    </h3>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                      Kitchen Display Systems (KDS), table management, split billing, and specialized 
                      network print routing for prep stations.
                    </p>
                    <CarbonLink href="/kds">Launch KDS</CarbonLink>
                  </Tile>
                </Column>
                <Column sm={4} md={4} lg={8} style={{ marginBottom: '1rem' }}>
                  <Tile style={{ height: '100%', borderTop: '4px solid var(--cds-support-success)' }}>
                    <h3 className="heading-03" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ConnectionSignal size={24} /> Momken Enterprise
                    </h3>
                    <p className="body-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                      Multi-branch matrices, real-time B2B/B2C CRM segmentation, and advanced RFID bulk intake workflows.
                    </p>
                    <CarbonLink href="/multi-store">Launch Multi-Store</CarbonLink>
                  </Tile>
                </Column>
              </Row>
            </Grid>
          </TabPanel>

          {/* Hardware & Integrations */}
          <TabPanel>
            <Grid fullWidth style={{ padding: '1rem 0' }}>
              <Row>
                <Column sm={4} md={8} lg={16}>
                  <div style={{ marginBottom: '2rem' }}>
                    <h2 className="heading-04" style={{ marginBottom: '1rem' }}>External Ecosystem</h2>
                    <p className="body-01" style={{ maxWidth: '800px', color: 'var(--cds-text-secondary)' }}>
                      Momken is designed to securely bridge web infrastructure with physical environments. 
                      Our hardware abstraction layer (HAL) standardizes communication protocols.
                    </p>
                  </div>
                </Column>
              </Row>
              <Row>
                <Column sm={4} md={8} lg={16}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Tile style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                      <Code size={48} style={{ color: 'var(--cds-link-primary)' }} />
                      <div>
                        <h3 className="heading-03" style={{ marginBottom: '0.5rem' }}>Web Serial API (Scanners & Scales)</h3>
                        <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                          Direct browser-to-hardware connectivity supporting RS232 and virtual COM port devices, 
                          enabling zero-install peripheral deployments.
                        </p>
                      </div>
                    </Tile>
                    <Tile style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                      <CloudApp size={48} style={{ color: 'var(--cds-link-primary)' }} />
                      <div>
                        <h3 className="heading-03" style={{ marginBottom: '0.5rem' }}>ESC/POS Network Printers</h3>
                        <p className="body-01" style={{ color: 'var(--cds-text-secondary)' }}>
                          Raw TCP socket dispatches over port 9100. Supports dynamic layout rendering and 
                          hardware triggers (cash drawer kicks, buzzers) for top manufacturers like Epson and Star.
                        </p>
                      </div>
                    </Tile>
                  </div>
                </Column>
              </Row>
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
