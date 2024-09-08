'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3Auth } from '../hooks/useWeb3Auth';

export type User = {
  isKintoVerified: boolean;
  address: string;
  username: string;
  email: string;
  profilePicture: string;
  bio: string;
  isCompleteProfile: boolean;
  attestationId?: string; // Add this line
  connectedWallets: string[]; // Add this line
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
  updateUserProfile: (profileData: Partial<User>) => Promise<void>;
  addConnectedWallet: (walletAddress: string) => Promise<void>; // Add this line
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const web3AuthHook = useWeb3Auth();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const { isConnected, address, provider } = web3AuthHook;

    useEffect(() => {
        if (web3AuthHook.isInitialized) {
            setIsLoading(false);
        }
    }, [web3AuthHook.isInitialized]);

    useEffect(() => {
        const fetchUser = async () => {
            if (isConnected && address) {
                console.log('Fetching user data for address:', address);
                const userData = await fetchUserData(address);
                console.log('User data fetched:', userData);
                setUser(userData);
                if (userData && !userData.isCompleteProfile) {
                    console.log('Redirecting to complete profile');
                    router.push('/complete-profile');
                } else if (userData && userData.isCompleteProfile) {
                    console.log('Redirecting to home');
                    router.push('/home');
                }
            } else {
                setUser(null);
            }
        };
        fetchUser();
    }, [isConnected, address, router]);

    const login = async () => {
        console.log('Login called');
        await web3AuthHook.connectWallet();
    };

    const updateUserProfile = async (profileData: Partial<User>) => {
        if (user && address) {
            const updatedUser = { ...user, ...profileData, isCompleteProfile: true };
            // Here you would typically send this data to your backend
            // For now, we'll just update the local state
            setUser(updatedUser);
            console.log('User profile updated:', updatedUser);
        }
    };

    const addConnectedWallet = async (walletAddress: string) => {
        if (user) {
            const updatedWallets = Array.from(new Set([...user.connectedWallets, walletAddress]));
            const updatedUser = { ...user, connectedWallets: updatedWallets };
            setUser(updatedUser);
            console.log('Connected wallet added:', walletAddress);
        }
    };

    return (
        <AuthContext.Provider value={{
            ...web3AuthHook,
            user,
            isLoading,
            login,
            isConnected,
            address,
            provider,
            connectWallet: web3AuthHook.connectWallet,
            disconnectWallet: web3AuthHook.disconnect,
            updateUserProfile,
            addConnectedWallet // Add this line
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

async function fetchUserData(address: string): Promise<User | null> {
    // Implement this function to fetch user data from your backend
    // Return null if user data is not found
    // This is a placeholder implementation
    return {
        isKintoVerified: false,
        address,
        username: '',
        email: '',
        profilePicture: '',
        bio: '',
        isCompleteProfile: false,
        connectedWallets: [], // Add this line
    };
}