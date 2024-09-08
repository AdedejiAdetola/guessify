// services/contractService.js
// import web3 from "./web3service";
import ContractABI from "../abis/ContractABI.json"; // Your contract ABI
const CONTRACT_ADDRESS = "0xYourContractAddress"; // Replace with your contract address

const contract = new web3.eth.Contract(ContractABI, CONTRACT_ADDRESS);

export default contract;
