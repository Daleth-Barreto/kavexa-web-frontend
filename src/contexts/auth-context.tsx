'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated, isLoaded] = useLocalStorage('kavexa_auth', false);

  const login = useCallback(() => setIsAuthenticated(true), [setIsAuthenticated]);
  const logout = useCallback(() => setIsAuthenticated(false), [setIsAuthenticated]);

  const value = useMemo(() => ({
    isAuthenticated,
    isLoading: !isLoaded,
    login,
    logout,
  }), [isAuthenticated, isLoaded, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
