'use client'

import { createContext, useContext, useState, useEffect } from 'react';

export type AuthContextType = {
    authState: {
        isConnected: boolean;
        address: string | null;
    };
    updateAuthState: (isConnected: boolean, address: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<AuthContextType['authState']>({
        isConnected: false,
        address: null,
    });

    useEffect(() => {
        const storedAddress = localStorage.getItem('userAddress');
        if (storedAddress) {
            setAuthState({ isConnected: true, address: storedAddress });
        }
    }, []);

    const updateAuthState = (isConnected: boolean, address: string | null) => {
        setAuthState({ isConnected, address });
        if (address) {
            localStorage.setItem('userAddress', address);
        } else {
            localStorage.removeItem('userAddress');
        }
    };

    return (
        <AuthContext.Provider value={{ authState, updateAuthState }}>
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