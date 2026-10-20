export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  price: number;
  unit?: string;
  stock?: number;
  image?: string;
}

export const mockProducts: Product[] = [
  // Furniture catalog matching target interface.webp
  { id: 'f1', barcode: '89001', name: 'Acoustic Bloc Screens', category: 'Furnitures', price: 339.25, stock: 12, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&auto=format&fit=crop&q=80' },
  { id: 'f2', barcode: '89002', name: 'Cabinet with Doors', category: 'Furnitures', price: 161.00, stock: 8, image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300&auto=format&fit=crop&q=80' },
  { id: 'f3', barcode: '89003', name: 'Desk Organizer', category: 'Furnitures', price: 5.10, unit: 'Units', stock: 45, image: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=300&auto=format&fit=crop&q=80' },
  { id: 'f4', barcode: '89004', name: 'Drawer Black', category: 'Furnitures', price: 28.75, stock: 15, image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=300&auto=format&fit=crop&q=80' },
  { id: 'f5', barcode: '89005', name: 'Flipover', category: 'Furnitures', price: 2242.50, stock: 4, image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=300&auto=format&fit=crop&q=80' },
  { id: 'f6', barcode: '89006', name: 'LED Lamp', category: 'Furnitures', price: 1.04, unit: 'Units', stock: 80, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&auto=format&fit=crop&q=80' },
  { id: 'f7', barcode: '89007', name: 'Letter Tray', category: 'Furnitures', price: 5.52, unit: 'Units', stock: 120, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=80' },
  { id: 'f8', barcode: '89008', name: 'Whiteboard Pen', category: 'Furnitures', price: 1.38, unit: 'Units', stock: 200, image: 'https://images.unsplash.com/photo-1585336261026-8f5786372966?w=300&auto=format&fit=crop&q=80' },
  { id: 'f9', barcode: '89009', name: 'Monitor Stand', category: 'Furnitures', price: 3.67, unit: 'Units', stock: 35, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=80' },
  { id: 'f10', barcode: '89010', name: 'Newspaper Rack', category: 'Furnitures', price: 1.47, unit: 'Units', stock: 18, image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=300&auto=format&fit=crop&q=80' },
  { id: 'f11', barcode: '89011', name: 'Office Lamp', category: 'Furnitures', price: 46.00, stock: 22, image: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=300&auto=format&fit=crop&q=80' },
  { id: 'f12', barcode: '89012', name: 'Pedal Bin', category: 'Furnitures', price: 54.05, stock: 14, image: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?w=300&auto=format&fit=crop&q=80' },
  { id: 'f13', barcode: '89013', name: 'Small Shelf', category: 'Furnitures', price: 2.83, unit: 'Units', stock: 29, image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&auto=format&fit=crop&q=80' },
  { id: 'f14', barcode: '89014', name: 'Storage Box', category: 'Furnitures', price: 18.17, stock: 50, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&auto=format&fit=crop&q=80' },
  { id: 'f15', barcode: '89015', name: 'Large Cabinet', category: 'Furnitures', price: 368.00, stock: 6, image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300&auto=format&fit=crop&q=80' },

  // Coffee & Drinks
  { id: '1', barcode: '123456789001', name: 'Espresso', category: 'Coffee', price: 3.50, stock: 45 },
  { id: '2', barcode: '123456789002', name: 'Latte', category: 'Coffee', price: 4.50, stock: 32 },
  { id: '6', barcode: '123456789006', name: 'Croissant', category: 'Pastries', price: 3.75, stock: 15 },
  { id: '10', barcode: '123456789010', name: 'Orange Juice', category: 'Beverages', price: 4.00, stock: 25 },
];

