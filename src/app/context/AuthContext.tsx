'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3Auth } from '../hooks/useWeb3Auth';

// Add this type definition
type User = {
  isKintoVerified: boolean;
  // Add other user properties as needed
};

export type AuthContextType = {
  isConnected: boolean;
  address: string | null;
  isLoading: boolean;
  user: User | null;
  provider: any;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  login: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const web3AuthHook = useWeb3Auth();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (web3AuthHook.isInitialized) {
            setIsLoading(false);
        }
    }, [web3AuthHook.isInitialized]);

    const login = async () => {
        await web3AuthHook.connect();
        router.push('/home');
    };

    const { isConnected, address, provider } = web3AuthHook;

    const connectWallet = web3AuthHook.connect;
    const disconnectWallet = web3AuthHook.disconnect;
    const user = null; // Or initialize with appropriate user data

    return (
        <AuthContext.Provider value={{
            ...web3AuthHook,
            isLoading,
            login,
            isConnected,
            address,
            provider,
            user,
            connectWallet,
            disconnectWallet
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};