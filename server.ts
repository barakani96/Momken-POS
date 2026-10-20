import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "pos-secret-key-123";
const DATA_FILE = path.join(process.cwd(), "data.json");

// Default initial data structure
const defaultData = {
  users: [], // { id, username, passwordHash, role, twoFactorSecret, twoFactorEnabled }
  products: [], // { id, name, description, price, category, stock }
  customers: [], // { id, name, email, phone, notes, loyaltyPoints, purchaseHistory: [] }
  sales: [] // { id, items: [], total, date, cashierId }
};

async function loadData() {
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

async function saveData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

const app = express();
app.use(express.json());

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function requireRoles(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied." });
    }
    next();
  }
}

// API Routes
app.post("/api/auth/register", async (req: any, res: any) => {
  const { username, password, role } = req.body;
  const data = await loadData();
  
  if (data.users.find((u: any) => u.username === username)) {
    return res.status(400).json({ error: "Username already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = { 
    id: Date.now().toString(), 
    username, 
    passwordHash, 
    role: role || 'Cashier',
    twoFactorEnabled: role === 'Admin' || role === 'Manager'
  };
  
  data.users.push(newUser);
  await saveData(data);

  res.json({ success: true, user: { id: newUser.id, username: newUser.username, role: newUser.role } });
});

app.post("/api/auth/login", async (req: any, res: any) => {
  const { username, password, twoFactorCode } = req.body;
  const data = await loadData();
  
  const user = data.users.find((u: any) => u.username === username);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

  if (user.twoFactorEnabled && twoFactorCode !== "123456") {
     return res.status(400).json({ error: "Invalid 2FA code", requires2FA: true });
  }

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

app.get("/api/auth/me", authenticateToken, async (req: any, res: any) => {
  res.json({ user: req.user });
});

// Products API
app.get("/api/products", authenticateToken, async (req: any, res: any) => {
  const data = await loadData();
  res.json(data.products);
});

app.post("/api/products", authenticateToken, requireRoles(["Admin", "Manager"]), async (req: any, res: any) => {
  const data = await loadData();
  const product = { id: Date.now().toString(), ...req.body };
  data.products.push(product);
  await saveData(data);
  res.json(product);
});

app.put("/api/products/:id", authenticateToken, requireRoles(["Admin", "Manager"]), async (req: any, res: any) => {
  const data = await loadData();
  const index = data.products.findIndex((p: any) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });
  
  data.products[index] = { ...data.products[index], ...req.body };
  await saveData(data);
  res.json(data.products[index]);
});

// Customers API
app.get("/api/customers", authenticateToken, async (req: any, res: any) => {
  const data = await loadData();
  res.json(data.customers);
});

app.post("/api/customers", authenticateToken, async (req: any, res: any) => {
  const data = await loadData();
  const customer = { id: Date.now().toString(), purchaseHistory: [], loyaltyPoints: 0, ...req.body };
  data.customers.push(customer);
  await saveData(data);
  res.json(customer);
});

app.put("/api/customers/:id", authenticateToken, async (req: any, res: any) => {
  const data = await loadData();
  const index = data.customers.findIndex((c: any) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Customer not found" });
  
  data.customers[index] = { ...data.customers[index], ...req.body };
  await saveData(data);
  res.json(data.customers[index]);
});

// Sales API
app.post("/api/sales", authenticateToken, async (req: any, res: any) => {
  const data = await loadData();
  const { items, customerId } = req.body;
  let total = 0;
  
  for (const item of items) {
     const product = data.products.find((p: any) => p.id === item.productId);
     if (product) {
       total += product.price * item.quantity;
       product.stock -= item.quantity;
     }
  }

  const sale = { id: Date.now().toString(), items, total, date: new Date().toISOString(), cashierId: req.user.id };
  data.sales.push(sale);

  if (customerId) {
     const customer = data.customers.find((c: any) => c.id === customerId);
     if (customer) {
        customer.loyaltyPoints += Math.floor(total / 10);
        customer.purchaseHistory.push(sale.id);
     }
  }

  await saveData(data);
  res.json(sale);
});

// Reports API
app.get("/api/reports/dashboard", authenticateToken, requireRoles(["Admin", "Manager"]), async (req: any, res: any) => {
  const data = await loadData();
  
  const dailySales = data.sales.reduce((acc: any, sale: any) => acc + sale.total, 0);
  
  const topProducts: any = {};
  data.sales.forEach((sale: any) => {
    sale.items.forEach((item: any) => {
      topProducts[item.productId] = (topProducts[item.productId] || 0) + item.quantity;
    });
  });

  const bestSelling = Object.entries(topProducts)
    .map(([id, qty]) => {
      const p = data.products.find((prod: any) => prod.id === id);
      return { name: p?.name || 'Unknown', value: qty };
    })
    .sort((a: any, b: any) => b.value - a.value).slice(0, 5);

  const lowStock = data.products.filter((p: any) => p.stock < 10);

  res.json({
    totalSales: dailySales,
    bestSelling,
    lowStock
  });
});

async function startServer() {
  const PORT = 3000;

  // Ensure default data exists
  const data = await loadData();
  let hasChanges = false;
  
  if (!data.users.find((u: any) => u.username === 'admin')) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      data.users.push({ 
          id: '1', 
          username: 'admin', 
          passwordHash, 
          role: 'Admin', 
          twoFactorEnabled: true 
      });
      hasChanges = true;
  }

  if (!data.users.find((u: any) => u.username === 'cashier')) {
      const passwordHash = await bcrypt.hash('cashier123', 10);
      data.users.push({ 
          id: '2', 
          username: 'cashier', 
          passwordHash, 
          role: 'Cashier', 
          twoFactorEnabled: false 
      });
      hasChanges = true;
  }

  if (data.products.length === 0) {
      data.products = [
          { id: 'p1', name: 'Artisan Espresso', description: 'Double shot of dark roast', price: 4.50, category: 'Beverage', stock: 150 },
          { id: 'p2', name: 'Avocado Toast', description: 'Sourdough with smashed avocado', price: 9.00, category: 'Food', stock: 45 },
          { id: 'p3', name: 'Travel Mug', description: 'Stainless steel insulated mug', price: 18.50, category: 'Retail', stock: 5 },
          { id: 'p4', name: 'Iced Latte', description: 'Espresso with cold milk and ice', price: 5.00, category: 'Beverage', stock: 80 }
      ];
      hasChanges = true;
  }

  if (data.customers.length === 0) {
      data.customers = [
          { id: 'c1', name: 'Alice Johnson', email: 'alice@example.com', phone: '555-0101', notes: 'Prefers decaf', loyaltyPoints: 120, purchaseHistory: ['s1'] },
          { id: 'c2', name: 'Bob Smith', email: 'bob@example.com', phone: '555-0202', notes: 'VIP customer', loyaltyPoints: 450, purchaseHistory: ['s2'] }
      ];
      hasChanges = true;
  }

  if (data.sales.length === 0) {
      data.sales = [
          { id: 's1', items: [{ productId: 'p1', name: 'Artisan Espresso', price: 4.50, quantity: 2 }], total: 9.00, date: new Date().toISOString(), cashierId: '2' },
          { id: 's2', items: [{ productId: 'p2', name: 'Avocado Toast', price: 9.00, quantity: 1 }, { productId: 'p4', name: 'Iced Latte', price: 5.00, quantity: 1 }], total: 14.00, date: new Date().toISOString(), cashierId: '2' }
      ];
      hasChanges = true;
  }

  if (hasChanges) {
      await saveData(data);
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
