import { useEffect, useState } from 'react';
import { createKintoSDK, KintoAccountInfo } from 'kinto-web-sdk';
import {
    encodeFunctionData, Address, getContract,
    defineChain, createPublicClient, http
  } from 'viem';
import contractsJSON from 'public/abis/7887.json';
import { Button } from '@/components/ui/button';

interface KYCViewerInfo {
    isIndividual: boolean;
    isCorporate: boolean;
    isKYC: boolean;
    isSanctionsSafe: boolean;
    getCountry: string;
    getWalletOwners: Address[];
  }

const kinto = defineChain({
id: 7887,
name: 'Kinto',
network: 'kinto',
nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
},
rpcUrls: {
    default: {
    http: ['https://rpc.kinto-rpc.com/'],
    webSocket: ['wss://rpc.kinto.xyz/ws'],
    },
},
blockExplorers: {
    default: { name: 'Explorer', url: 'https://kintoscan.io' },
},
});

export function KintoConnect({ className }: { className?: string }) {
    const [accountInfo, setAccountInfo] = useState<KintoAccountInfo | undefined>(undefined);
    const [kycViewerInfo, setKYCViewerInfo] = useState<any | undefined>(undefined);
    const [kyc, setKYC] = useState<boolean | null>(null)
    const kintoSDK = createKintoSDK('0x14A1EC9b43c270a61cDD89B6CbdD985935D897fE'); //Replace this with Main Contract later
  
    async function kintoLogin() {
      try {
        await kintoSDK.createNewWallet();
      } catch (error) {
        console.error('Failed to login/signup:', error);
      }
    }

    async function kintoLogout() {
      setAccountInfo(undefined);
    }
    
      async function fetchAccountInfo() {
        try {
          setAccountInfo(await kintoSDK.connect());
        } catch (error) {
          console.error('Failed to fetch account info:', error);
        }
      };
    
      useEffect(() => {
        fetchAccountInfo();
      });
    
      useEffect(() => {
        const fetchKYCViewerInfo = async () => {
            if (!accountInfo?.walletAddress) return;
    
            const client = createPublicClient({
                chain: kinto,
                transport: http(),
            });
            const kycViewer = getContract({
                address: contractsJSON.contracts.KYCViewer.address as Address,
                abi: contractsJSON.contracts.KYCViewer.abi,
                client: { public: client }
            });
    
            try {
                const [isIndividual, isCorporate, isKYC, isSanctionsSafe, getCountry, getWalletOwners] = await Promise.all([
                    kycViewer.read.isIndividual([accountInfo.walletAddress]),
                    kycViewer.read.isCompany([accountInfo.walletAddress]),
                    kycViewer.read.isKYC([accountInfo.walletAddress]),
                    kycViewer.read.isSanctionsSafe([accountInfo.walletAddress]),
                    kycViewer.read.getCountry([accountInfo.walletAddress]),
                    kycViewer.read.getWalletOwners([accountInfo.walletAddress])
                ]);
    
                const kycViewerInfo = {
                    isIndividual,
                    isCorporate,
                    isKYC,
                    isSanctionsSafe,
                    getCountry,
                    getWalletOwners
                } as KYCViewerInfo;
    
                setKYCViewerInfo(kycViewerInfo);
                setKYC(isKYC as boolean);  // Set KYC state based on fetched data
            } catch (error) {
                console.error('Failed to fetch KYC viewer info:', error);
            }
        };
    
        if (accountInfo?.walletAddress) {
            fetchKYCViewerInfo();
        }
    }, [accountInfo]);
    
      return (
        <>
            {accountInfo && null}
            <Button 
                onClick={accountInfo?.walletAddress ? (accountInfo ? kintoLogout : kintoLogin) : kintoLogin}
                variant={accountInfo?.walletAddress ? (accountInfo ? "outline" : "default") : "default"}
                className={`bg-gray-500 text-white hover:text-gray-300 hover:bg-gray-600 font-semibold ${className} ${kyc ? 'border border-black' : ''}`}
            >
                {(kyc ? "Verified" : "Get Verified")}
            </Button>
        </>
    );
    }