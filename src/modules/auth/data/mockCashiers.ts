export interface Cashier {
  id: string;
  name: string;
  pin: string;
  badgeId: string;
  role: 'Admin' | 'Cashier' | 'Manager';
  avatarColor: string;
}

export const mockCashiers: Cashier[] = [
  { id: '1', name: 'Ahmed', pin: '1234', badgeId: 'B-1234', role: 'Admin', avatarColor: '#0f62fe' },
  { id: '2', name: 'Fatima', pin: '5678', badgeId: 'B-5678', role: 'Cashier', avatarColor: '#1192e8' },
  { id: '3', name: 'Ali', pin: '0000', badgeId: 'B-0000', role: 'Cashier', avatarColor: '#005d5d' },
  { id: '4', name: 'Sara', pin: '1111', badgeId: 'B-1111', role: 'Manager', avatarColor: '#8a3ffc' },
];
