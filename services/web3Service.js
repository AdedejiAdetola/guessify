import { ethers } from "ethers";
import { Contract } from "ethers";
import abi from "../utils/ContractABI.json"; // ABI should match your deployed contract

// Contract configuration
const contractAddress = "0xc3f58c2f51c802fa8ff7871dbce8e7231ec75bda";

async function initializeContract() {
  try {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error("No crypto wallet found. Please install MetaMask.");
    }

    // Create a provider from MetaMask
    const provider = new ethers.BrowserProvider(window.ethereum);

    // Handle the case where the request is already pending
    let signer;
    try {
      signer = await provider.getSigner();
    } catch (error) {
      if (error.code === -32002) {
        console.error(
          "MetaMask request is already pending. Please wait for the previous request to complete."
        );
        return;
      }
      throw error; // rethrow if it's another error
    }

    const contract = new Contract(contractAddress, abi, signer);
    return contract;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Export the contract and signer from the async function
export default initializeContract;

// request the contract
// contract.fuction(value);

// use case example;
// want to send user name to the contract
// first
// get contract state after importing to your page
// import initializeContract from './utils/contract'
// const contract = await initializeContract();
// secound
// await the request using contract.function(value);
// e.g
// const newq = await contract.addPlayer("new player");
// console.log(newq); //this is a set request the return will be a confirmation object
// e.g view functrion
//
// const getScores = await contract.getScores();
// console.log(Guessed Word: ${getScores});

// example
// (async () => {
// try {
//     const contract = await initializeContract();

//     // // Call the new() function, which may initialize a new game

//     const newq = await contract.new();
//     console.log(newq);

//     //  / Call addPlayer to add a player to the game
//     const addPlayerTx = await contract.addPlayer("orange");
//     await addPlayerTx.wait();  // Wait for the transaction to be mined
//     console.log(addPlayerTx)
//     console.log(Player added with result: ${addPlayerTx});

//     // // Now retrieve the guessed word (assuming it's a view function, no need for .wait())
//     const getScores = await contract.getScores();
//     console.log(Guessed Word: ${getScores});

//   } catch (error) {
//     console.error('Error: this is a problem', error);
//   }
// })();
