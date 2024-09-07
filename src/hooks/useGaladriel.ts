import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { useWeb3Auth } from './useWeb3Auth';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const contractAddress = "0x079efB8329C1a9e92153DF1E1757bDF823e1CA31";
const contractABI: AbiItem[] = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "message",
                "type": "string"
            }
        ],
        "name": "startChat",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "message",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "runId",
                "type": "uint256"
            }
        ],
        "name": "addMessage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "chatId",
                "type": "uint256"
            }
        ],
        "name": "getMessageHistory",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "role",
                        "type": "string"
                    },
                    {
                        "components": [
                            {
                                "internalType": "string",
                                "name": "contentType",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "value",
                                "type": "string"
                            }
                        ],
                        "internalType": "struct IOracle.Content[]",
                        "name": "content",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct IOracle.Message[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
const galadrielNetwork = {
    chainId: 696969,
    url: "https://devnet.galadriel.com/",
};

const useGaladriel = () => {
    const { provider, address, isConnected } = useWeb3Auth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [web3, setWeb3] = useState<Web3 | null>(null);
    const [contract, setContract] = useState<any>(null);
    const [chatId, setChatId] = useState<number | null>(null);


    useEffect(() => {
        if (isConnected) {
            if (provider) {
                const web3Instance = new Web3(provider);
                setWeb3(web3Instance);
                const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
                setContract(contractInstance);
            } else {
                console.error('Ethereum provider not found');
            }

        }
    }, [isConnected, provider]);

    const sendMessage = async (message: string) => {
        await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${galadrielNetwork.chainId.toString(16)}` }],
        }).catch((switchError: any) => {
            if (switchError.code === 4902) {
                provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: `0x${galadrielNetwork.chainId.toString(16)}`,
                        chainName: 'Galadriel Devnet',
                        rpcUrls: [galadrielNetwork.url],
                        nativeCurrency: {
                            name: 'Galadriel Token',
                            symbol: 'GLD',
                            decimals: 18,
                        },
                        blockExplorerUrls: ['https://explorer.galadriel.com'],
                    }],
                }).catch((addError: any) => {
                    console.error('Ağ eklenemedi:', addError);
                });
            } else {
                console.error('Ağ değiştirilemedi:', switchError);
            }
        });
        if (contract && web3 && address) {
            let transactionResponse;
            if (chatId !== null) {
                console.log("chatId", chatId);
                transactionResponse = await contract.methods.addMessage(message, chatId).send({ from: address });
                console.log("transactionResponse", transactionResponse);
            } else {
                transactionResponse = await contract.methods.startChat(message).send({ from: address });
                const receipt = await transactionResponse;
                console.log("receipt", receipt);
                const newChatId = parseInt(receipt.logs[0].topics[1], 16);
                console.log("newChatId", newChatId);
                setChatId(newChatId);
            }
            setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: message }]);
        }
    };

    const listenMessages = async () => {
        if (contract && chatId !== null) {
            console.log("chatId", chatId);
            const response = await contract.methods.getMessageHistory(chatId).call();
            console.log("response", response);
            if (response.length > 0 && response[response.length - 1].content.length > 0) {
                const aiMessage = response[response.length - 1].content[0].value;
                setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: aiMessage }]);
            } else {
                console.error('error:', response);
            }
        }
    };
    useEffect(() => {
        const interval = setInterval(() => {
            listenMessages();
        }, 5000);
        return () => clearInterval(interval);
    }, [contract, chatId]);

    return { messages, sendMessage, chatId };
};

export default useGaladriel;