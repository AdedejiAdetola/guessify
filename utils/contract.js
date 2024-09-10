// Ensure you have ethers v5 installed: npm install ethers@5
import { ethers } from "ethers";
import ContractABI from "./ContractABI.json"; // Ensure the casing matches your file system
const contractAddress = "0x470ef9cb90f38a2a70e59271b89e42f85e222338"; // Replace with your actual contract address

export default async function initializeContract() {
  try {
    // Check if the browser has an Ethereum provider (e.g., MetaMask)
    if (!window.ethereum) {
      throw new Error("No Ethereum provider found. Install MetaMask.");
    }

    // Request account access if needed
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Create an ethers provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(); // Use 'signer', not 'signer_'

    // Initialize the contract with the ABI, contract address, and signer
    const contract = new ethers.Contract(contractAddress, ContractABI, signer);

    // Return the contract and signer
    return { contract, signer };
  } catch (error) {
    console.error("Failed to initialize contract:", error);
    throw error;
  }
}
