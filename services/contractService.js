// services/contractService.js
// import web3 from './web3Service';
import ContractABI from "../abis/ContractABI.json"; // Ensure this ABI matches your deployed contract

// Use the newly deployed contract address
const CONTRACT_ADDRESS = "0xf3ea6ef7a3f620205bd2ad7494c88b0d0b47a5de";

const contract = new web3.eth.Contract(ContractABI, CONTRACT_ADDRESS);

export default contract;
