import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cashier, mockCashiers } from '../data/mockCashiers';

interface CashierContextType {
  activeCashier: Cashier | null;
  login: (cashier: Cashier) => void;
  logout: () => void;
}

const CashierContext = createContext<CashierContextType | undefined>(undefined);

export function CashierProvider({ children }: { children: React.ReactNode }) {
  const [activeCashier, setActiveCashier] = useState<Cashier | null>(() => {
    const saved = localStorage.getItem('pos_active_cashier');
    return saved ? JSON.parse(saved) : mockCashiers[0];
  });

  useEffect(() => {
    if (activeCashier) {
      localStorage.setItem('pos_active_cashier', JSON.stringify(activeCashier));
    } else {
      localStorage.removeItem('pos_active_cashier');
    }
  }, [activeCashier]);

  const login = (cashier: Cashier) => setActiveCashier(cashier);
  const logout = () => setActiveCashier(null);

  return (
    <CashierContext.Provider value={{ activeCashier, login, logout }}>
      {children}
    </CashierContext.Provider>
  );
}

export function useCashier() {
  const context = useContext(CashierContext);
  if (context === undefined) {
    throw new Error('useCashier must be used within a CashierProvider');
  }
  return context;
}
