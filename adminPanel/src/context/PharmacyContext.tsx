import React, { createContext, useContext, useState } from "react";
import { v4 as uuid } from "uuid";

/** Types **/
export type Product = {
  id: string;
  sku: string;
  name: string;
  brand?: string;
  category?: string;
  price: number;
  costPrice?: number;
  stock: number;
  minStock?: number; // threshold for reorder
  description?: string;
};

export type Transaction = {
  id: string;
  productId: string;
  type: "sale" | "refund" | "restock";
  qty: number;
  amount: number; // total amount
  date: string; // ISO
  note?: string;
};

export type RestockRequest = {
  id: string;
  productId: string;
  qty: number;
  requestedAt: string;
  status: "pending" | "ordered" | "received";
};

type PharmacyContextType = {
  products: Product[];
  transactions: Transaction[];
  restocks: RestockRequest[];
  addProduct: (p: Omit<Product, "id">) => Product;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (productId: string, delta: number, reason?: string) => void;
  recordSale: (productId: string, qty: number) => void;
  createRestockRequest: (productId: string, qty: number) => RestockRequest;
  processRestock: (restockId: string) => void;
};

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

/** Dummy initial data **/
const initialProducts: Product[] = [
  { id: "p1", sku: "MED-001", name: "Paracetamol 500mg", brand: "HealCo", category: "Analgesic", price: 30, costPrice: 10, stock: 120, minStock: 50, description: "Pain reliever" },
  { id: "p2", sku: "MED-002", name: "Amoxicillin 250mg", brand: "BioPharm", category: "Antibiotic", price: 120, costPrice: 60, stock: 20, minStock: 30, description: "Antibiotic capsule" },
  { id: "p3", sku: "MED-003", name: "Vitamin D 1000IU", brand: "NutriLife", category: "Supplement", price: 200, costPrice: 80, stock: 8, minStock: 20, description: "Vitamin supplement" },
];

const initialTransactions: Transaction[] = [
  { id: uuid(), productId: "p1", type: "sale", qty: 5, amount: 150, date: new Date().toISOString(), note: "OPD sale" },
  { id: uuid(), productId: "p2", type: "sale", qty: 2, amount: 240, date: new Date().toISOString(), note: "Inpatient" },
];

const initialRestocks: RestockRequest[] = [
  { id: uuid(), productId: "p3", qty: 100, requestedAt: new Date().toISOString(), status: "pending" }
];

export const PharmacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [restocks, setRestocks] = useState<RestockRequest[]>(initialRestocks);

  const addProduct = (p: Omit<Product, "id">) => {
    const newP: Product = { ...p, id: uuid() };
    setProducts(prev => [newP, ...prev]);
    return newP;
  };

  const updateProduct = (p: Product) => setProducts(prev => prev.map(x => x.id === p.id ? p : x));
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setTransactions(prev => prev.filter(t => t.productId !== id));
  };

  const adjustStock = (productId: string, delta: number, reason?: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
    // record transaction as restock or correction
    const t: Transaction = {
      id: uuid(),
      productId,
      type: delta > 0 ? "restock" : "refund",
      qty: Math.abs(delta),
      amount: 0,
      date: new Date().toISOString(),
      note: reason || (delta > 0 ? "Stock added" : "Stock deduction")
    };
    setTransactions(prev => [t, ...prev]);
  };

  const recordSale = (productId: string, qty: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error("product not found");
    const amount = product.price * qty;
    // decrement stock
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: Math.max(0, p.stock - qty) } : p));
    const t: Transaction = {
      id: uuid(),
      productId,
      type: "sale",
      qty,
      amount,
      date: new Date().toISOString(),
      note: "POS sale"
    };
    setTransactions(prev => [t, ...prev]);
  };

  const createRestockRequest = (productId: string, qty: number) => {
    const r: RestockRequest = { id: uuid(), productId, qty, requestedAt: new Date().toISOString(), status: "pending" };
    setRestocks(prev => [r, ...prev]);
    return r;
  };

  const processRestock = (restockId: string) => {
    const r = restocks.find(x => x.id === restockId);
    if (!r) return;
    // mark ordered -> received & add stock
    setRestocks(prev => prev.map(x => x.id === restockId ? { ...x, status: "received" } : x));
    adjustStock(r.productId, r.qty, `Restock received (${restockId})`);
  };

  return (
    <PharmacyContext.Provider value={{
      products,
      transactions,
      restocks,
      addProduct,
      updateProduct,
      deleteProduct,
      adjustStock,
      recordSale,
      createRestockRequest,
      processRestock
    }}>
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const ctx = useContext(PharmacyContext);
  if (!ctx) throw new Error("usePharmacy must be used within PharmacyProvider");
  return ctx;
};
