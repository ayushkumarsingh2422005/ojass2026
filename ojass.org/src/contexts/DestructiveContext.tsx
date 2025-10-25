"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface DestructiveContextType {
  isDestructive: boolean;
  setIsDestructive: (value: boolean) => void;
  toggleDestructive: () => void;
}

const DestructiveContext = createContext<DestructiveContextType | undefined>(undefined);

export function DestructiveProvider({ children }: { children: ReactNode }) {
  const [isDestructive, setIsDestructive] = useState(false);

  const toggleDestructive = () => {
    setIsDestructive(prev => !prev);
  };

  const value = {
    isDestructive,
    setIsDestructive,
    toggleDestructive,
  };

  return (
    <DestructiveContext.Provider value={value}>
      {children}
    </DestructiveContext.Provider>
  );
}

export function useDestructive() {
  const context = useContext(DestructiveContext);
  if (context === undefined) {
    throw new Error('useDestructive must be used within a DestructiveProvider');
  }
  return context;
}
