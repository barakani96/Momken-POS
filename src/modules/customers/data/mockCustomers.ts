export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  type: 'B2C' | 'B2B';
  crNumber?: string;
  vatNumber?: string;
  creditTerm?: 'Immediate' | 'Net 15' | 'Net 30' | 'Net 90';
}

export const mockCustomers: Customer[] = [
  { id: 'C000', name: 'Anita Oliver', email: 'anita.oliver@example.com', phone: '555-0199', loyaltyPoints: 4524.1, type: 'B2C' },
  { id: 'C001', name: 'Alice Smith', email: 'alice@example.com', phone: '555-0100', loyaltyPoints: 120, type: 'B2C' },
  { id: 'C002', name: 'Bob Jones', email: 'bob@example.com', phone: '555-0101', loyaltyPoints: 45, type: 'B2C' },
  { id: 'C003', name: 'Al Rajhi Enterprises', email: 'procurement@alrajhient.com', phone: '555-0900', loyaltyPoints: 3000, type: 'B2B', crNumber: '1010123456', vatNumber: '300123456700003', creditTerm: 'Net 30' },
  { id: 'C004', name: 'Diana Prince', email: 'diana@example.com', phone: '555-0103', loyaltyPoints: 50, type: 'B2C' },
  { id: 'C005', name: 'Evan Wright', email: 'evan@example.com', phone: '555-0104', loyaltyPoints: 10, type: 'B2C' },
  { id: 'C006', name: 'Fiona Gallagher', email: 'fiona@example.com', phone: '555-0105', loyaltyPoints: 210, type: 'B2C' },
  { id: 'C007', name: 'Riyadh Hotels LLC', email: 'supplies@riyadhhotels.sa', phone: '555-0800', loyaltyPoints: 5750, type: 'B2B', crNumber: '1010765432', vatNumber: '300987654300003', creditTerm: 'Net 90' },
  { id: 'C008', name: 'Hannah Abbott', email: 'hannah@example.com', phone: '555-0107', loyaltyPoints: 400, type: 'B2C' },
];
