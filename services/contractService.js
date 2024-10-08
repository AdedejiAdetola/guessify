// services/contractService.js
import { ethers } from "ethers";
import ContractABI from "../utils/ContractABI.json";

const providerUrl =
  "https://arbitrum-mainnet.infura.io/v3/f8eab5461bb1483387beb63dc0751ed2";
const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const contractAddress = "0xf3ea6ef7a3f620205bd2ad7494c88b0d0b47a5de";

// Contract instance with the provider
const contract = new ethers.Contract(contractAddress, ContractABI, provider);

export default contract;
