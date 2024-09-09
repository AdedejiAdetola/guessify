// import { ethers } from "ethers";
// import { Contract } from "ethers";
// import abi from "./ContractABI.json";

// // Contract address
// const contractAddress = "0xe4D57693384bBF00B045D58D0aff65C3925cBB96";

// // Function to initialize provider and contract
// async function initializeContract() {
//   let provider;
//   let signer;

//   // Ensure window.ethereum is available
//   if (!window.ethereum) {
//     throw new Error("No crypto wallet found. Please install MetaMask.");
//   }

//   // Setup provider and signer
//   if (window.ethereum) {
//     provider = new ethers.BrowserProvider(window.ethereum);
//     signer = await provider.getSigner();
//   } else {
//     console.log("MetaMask not installed; using read-only defaults");
//     provider = ethers.getDefaultProvider();
//   }

//   // Create the contract instance
//   const contract = new Contract(contractAddress, abi, signer);

//   return { contract, signer };
// }

// // Export the contract and signer from the async function
// export default initializeContract;

// Ensure you have ethers v5 installed: npm install ethers@5
import { ethers } from "ethers";
import ContractABI from "./ContractABI.json"; // Ensure the casing matches your file system
const contractAddress = "0xe4D57693384bBF00B045D58D0aff65C3925cBB96"; // Replace with your actual contract address

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
