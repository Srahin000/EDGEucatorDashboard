import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Child, DateRange } from '@/types';
import { getAllChildren } from '@/data/mockData';

interface ChildContextType {
  selectedChild: Child | null;
  setSelectedChild: (child: Child | null) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  children: Child[];
  isLoading: boolean;
  refreshChildren: () => Promise<void>;
}

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export const ChildProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiChildren, setApiChildren] = useState<Child[]>([]);
  const [mockChildren, setMockChildren] = useState<Child[]>(getAllChildren());
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('week');
  const [isLoading, setIsLoading] = useState(true);

  const loadChildren = async () => {
    try {
      // In development mode, check localStorage first
      if (import.meta.env.DEV) {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          try {
            const user = JSON.parse(currentUser);
            if (user.children && user.children.length > 0) {
              const storedChildren = JSON.parse(localStorage.getItem('mockChildren') || '[]');
              const userChildren = storedChildren.filter((child: Child) => 
                user.children.includes(child.id)
              );
              if (userChildren.length > 0) {
                setApiChildren(userChildren);
                setMockChildren(userChildren);
                setIsLoading(false);
                return;
              }
            }
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
        
        // Also check for any children in localStorage (fallback)
        const storedChildren = JSON.parse(localStorage.getItem('mockChildren') || '[]');
        if (storedChildren.length > 0) {
          setMockChildren(storedChildren);
        }
      }

      const response = await fetch('/api/profiles', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setApiChildren(data.children || []);
      }
    } catch (error) {
      console.error('Error loading children from API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  useEffect(() => {
    // Set selected child when children are loaded
    const allChildren = apiChildren.length > 0 ? apiChildren : mockChildren;
    if (!selectedChild && allChildren.length > 0) {
      setSelectedChild(allChildren[0]);
    }
  }, [apiChildren, mockChildren, selectedChild]);

  const refreshChildren = async () => {
    await loadChildren();
  };

  const allChildren = apiChildren.length > 0 ? apiChildren : mockChildren;

  return (
    <ChildContext.Provider
      value={{
        selectedChild,
        setSelectedChild,
        dateRange,
        setDateRange,
        children: allChildren,
        isLoading,
        refreshChildren,
      }}
    >
      {children}
    </ChildContext.Provider>
  );
};

export const useChildContext = (): ChildContextType => {
  const context = useContext(ChildContext);
  if (context === undefined) {
    throw new Error('useChildContext must be used within a ChildProvider');
  }
  return context;
};

