import React, { useState } from 'react';
import { Tile, Grid, Row, Column, Button, Tag, InlineNotification } from '@carbon/react';
import { Printer, CheckmarkOutline } from '@carbon/icons-react';
import { useHardware } from '../../../infrastructure/hardware/HardwareContext';

interface KitchenTicket {
  id: string;
  table: string;
  time: string;
  items: string[];
  status: 'Pending' | 'Prep' | 'Ready';
}

const initialTickets: KitchenTicket[] = [
  { id: 'TKT-001', table: 'Table 4', time: '12:30 PM', items: ['2x Wagyu Burger', '1x Truffle Fries'], status: 'Pending' },
  { id: 'TKT-002', table: 'Takeaway', time: '12:35 PM', items: ['1x Caesar Salad', '1x Lemonade'], status: 'Pending' },
  { id: 'TKT-003', table: 'Delivery', time: '12:40 PM', items: ['3x Pepperoni Pizza'], status: 'Pending' }
];

export default function KitchenDisplaySystem() {
  const [tickets, setTickets] = useState<KitchenTicket[]>(initialTickets);
  const [printResults, setPrintResults] = useState<{[ticketId: string]: {success: boolean; bytes: string; printerName: string}[]}>({});
  const { printToRole } = useHardware();

  const handlePrintTicket = async (ticket: KitchenTicket) => {
    const content = `[KITCHEN TICKET]\nOrder: ${ticket.id}\nType: ${ticket.table}\nTime: ${ticket.time}\n\nITEMS:\n${ticket.items.join('\n')}\n`;
    const results = await printToRole('Kitchen', content);
    setPrintResults(prev => ({ ...prev, [ticket.id]: results }));
  };

  const markReady = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Ready' } : t));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 className="heading-05" style={{ marginBottom: '1.5rem' }}>Kitchen Display System (KDS)</h1>
      
      <Grid fullWidth style={{ padding: 0, margin: 0 }}>
        <Row>
          {tickets.filter(t => t.status === 'Pending').map(ticket => (
            <Column sm={4} md={4} lg={4} key={ticket.id}>
              <Tile style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', height: '100%', borderTop: '4px solid var(--cds-support-warning)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4 className="heading-03">{ticket.id}</h4>
                    <p className="label-01" style={{ color: 'var(--cds-text-secondary)' }}>{ticket.table} • {ticket.time}</p>
                  </div>
                  <Tag type="magenta">Pending</Tag>
                </div>
                
                <ul style={{ flex: 1, marginBottom: '1rem', paddingLeft: '1.25rem', listStyleType: 'disc' }}>
                  {ticket.items.map((item, idx) => (
                    <li key={idx} className="body-01" style={{ marginBottom: '0.25rem' }}>{item}</li>
                  ))}
                </ul>

                {printResults[ticket.id] && printResults[ticket.id].map((res, i) => (
                  <InlineNotification
                    key={i}
                    kind={res.success ? 'success' : 'error'}
                    title={res.printerName}
                    subtitle={res.success ? 'Ticket Printed' : 'Printer offline'}
                    hideCloseButton
                    style={{ marginBottom: '1rem', maxWidth: '100%' }}
                  >
                    {res.success && (
                      <pre style={{ fontSize: '10px', marginTop: '0.5rem', background: 'var(--cds-layer-02)', padding: '0.5rem' }}>
                        {res.bytes}
                      </pre>
                    )}
                  </InlineNotification>
                ))}

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <Button kind="secondary" size="sm" renderIcon={Printer} iconDescription="Print Ticket" onClick={() => handlePrintTicket(ticket)} style={{ flex: 1 }}>
                    Print Ticket
                  </Button>
                  <Button kind="primary" size="sm" renderIcon={CheckmarkOutline} iconDescription="Mark as Ready" onClick={() => markReady(ticket.id)} style={{ flex: 1 }}>
                    Ready
                  </Button>
                </div>
              </Tile>
            </Column>
          ))}
          {tickets.filter(t => t.status === 'Pending').length === 0 && (
            <p className="body-01" style={{ color: 'var(--cds-text-secondary)', padding: '1rem' }}>No pending orders.</p>
          )}
        </Row>
      </Grid>
    </div>
  );
}
