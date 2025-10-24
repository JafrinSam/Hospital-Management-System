import React, { createContext, useContext, useState } from "react";

export type Transaction = {
  id: string;
  type: "income" | "expense";
  departmentId: string;
  description: string;
  amount: number;
  date: string;
};

export type DepartmentFinance = {
  id: string;
  name: string;
  revenue: number;
  expenses: number;
  profit: number;
  investments: number;
  transactions: Transaction[];
};

type FinanceContextType = {
  departments: DepartmentFinance[];
  addTransaction: (t: Transaction) => void;
  editTransaction: (t: Transaction) => void;
  deleteTransaction: (tId: string, depId: string) => void;
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<DepartmentFinance[]>([
    {
      id: "lab",
      name: "Lab",
      revenue: 50000,
      expenses: 20000,
      profit: 30000,
      investments: 10000,
      transactions: [],
    },
    {
      id: "pharmacy",
      name: "Pharmacy",
      revenue: 75000,
      expenses: 40000,
      profit: 35000,
      investments: 20000,
      transactions: [],
    },
  ]);

  const addTransaction = (t: Transaction) => {
    setDepartments((prev) =>
      prev.map((dep) =>
        dep.id === t.departmentId
          ? {
              ...dep,
              transactions: [...dep.transactions, t],
              revenue: t.type === "income" ? dep.revenue + t.amount : dep.revenue,
              expenses: t.type === "expense" ? dep.expenses + t.amount : dep.expenses,
              profit:
                t.type === "income" ? dep.profit + t.amount : t.type === "expense" ? dep.profit - t.amount : dep.profit,
            }
          : dep
      )
    );
  };

  const editTransaction = (t: Transaction) => {
    setDepartments((prev) =>
      prev.map((dep) => {
        if (dep.id === t.departmentId) {
          const old = dep.transactions.find((tr) => tr.id === t.id);
          if (!old) return dep;
          const updatedTransactions = dep.transactions.map((tr) => (tr.id === t.id ? t : tr));

          let newRevenue = dep.revenue - (old.type === "income" ? old.amount : 0) + (t.type === "income" ? t.amount : 0);
          let newExpenses =
            dep.expenses - (old.type === "expense" ? old.amount : 0) + (t.type === "expense" ? t.amount : 0);
          let newProfit = newRevenue - newExpenses;

          return {
            ...dep,
            transactions: updatedTransactions,
            revenue: newRevenue,
            expenses: newExpenses,
            profit: newProfit,
          };
        }
        return dep;
      })
    );
  };

  const deleteTransaction = (tId: string, depId: string) => {
    setDepartments((prev) =>
      prev.map((dep) => {
        if (dep.id === depId) {
          const t = dep.transactions.find((tr) => tr.id === tId);
          if (!t) return dep;
          return {
            ...dep,
            transactions: dep.transactions.filter((tr) => tr.id !== tId),
            revenue: t.type === "income" ? dep.revenue - t.amount : dep.revenue,
            expenses: t.type === "expense" ? dep.expenses - t.amount : dep.expenses,
            profit: t.type === "income" ? dep.profit - t.amount : t.type === "expense" ? dep.profit + t.amount : dep.profit,
          };
        }
        return dep;
      })
    );
  };

  return (
    <FinanceContext.Provider value={{ departments, addTransaction, editTransaction, deleteTransaction }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error("useFinance must be used within FinanceProvider");
  return context;
};
