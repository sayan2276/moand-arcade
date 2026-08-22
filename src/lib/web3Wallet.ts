import { ethers } from 'ethers';
import { MONAD_TESTNET_CONFIG, ESCROW_CONTRACT_ABI } from '../contracts/escrowAbi';

declare global {
    interface Window {
        ethereum?: any;
    }
}

export interface WalletState {
    address: string;
    chainId: string;
    isConnected: boolean;
}

// Connect MetaMask / Web3 Wallet and switch to Monad Testnet
export const connectMonadWallet = async (): Promise<WalletState> => {
    if (!window.ethereum) {
        throw new Error('No Ethereum wallet extension detected. Please install MetaMask or Rabby.');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);

    if (!accounts || accounts.length === 0) {
        throw new Error('No accounts selected');
    }

    // Request network switch to Monad Testnet
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: MONAD_TESTNET_CONFIG.chainId }]
        });
    } catch (switchError: any) {
        // Add network if not already present in wallet
        if (switchError.code === 4902 || switchError.message?.includes('Unrecognized chain')) {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [MONAD_TESTNET_CONFIG]
            });
        }
    }

    const network = await provider.getNetwork();

    return {
        address: accounts[0],
        chainId: network.chainId.toString(),
        isConnected: true
    };
};

// Execute claim transaction on Monad Arcade Escrow contract
export const claimRewardOnChain = async (
    contractAddress: string,
    amount: number,
    nonce: number,
    signature: string
): Promise<string> => {
    if (!window.ethereum) {
        throw new Error('Wallet not connected');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const escrowContract = new ethers.Contract(
        contractAddress,
        ESCROW_CONTRACT_ABI,
        signer
    );

    // Call smart contract claim function
    const tx = await escrowContract.claim(amount, nonce, signature);
    await tx.wait();
    return tx.hash;
};
