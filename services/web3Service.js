import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import ContractABI from "../abis/ContractABI.json";

// Initialize Web3 provider
const providerUrl =
  "https://arbitrum-mainnet.infura.io/v3/f8eab5461bb1483387beb63dc0751ed2";
const provider = new Web3.providers.HttpProvider(providerUrl);
const web3 = new Web3(provider);

// Contract details
const contractAddress = "0xf3ea6ef7a3f620205bd2ad7494c88b0d0b47a5de";
const contract = new web3.eth.Contract(ContractABI, contractAddress);

const sendTransaction = async (method, ...args) => {
  const privateKey =
    process.env.PRIVATE_KEY ||
    "d4b32b5b4ce79beaf2f8935c7b00f48254e8e9b56fa96f7730e69ea8497a5d33";

  if (!privateKey) {
    throw new Error("Private Key not found.");
  }

  if (privateKey.length !== 64) {
    throw new Error("Invalid private key format.");
  }

  const formattedPrivateKey = `0x${privateKey}`;
  const account = web3.eth.accounts.privateKeyToAccount(formattedPrivateKey);
  web3.eth.accounts.wallet.add(account);

  const data = contract.methods[method](...args).encodeABI();

  // Estimate gas for the transaction
  const gasEstimate = await contract.methods[method](...args).estimateGas({
    from: account.address,
  });

  // Fetch current gas price
  const gasPrice = await web3.eth.getGasPrice();

  // Transaction configuration
  const tx = {
    from: account.address,
    to: contractAddress,
    data: data,
    gas: gasEstimate,
    gasPrice, // Use this for legacy transactions
  };

  try {
    // Sign and send the transaction
    const signedTx = await web3.eth.accounts.signTransaction(
      tx,
      formattedPrivateKey
    );
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    console.log("Transaction successful:", receipt);
    return receipt;
  } catch (error) {
    if (error.message.includes("revert")) {
      console.error(
        "Transaction reverted by the EVM. Possible reasons: contract logic, invalid parameters, insufficient gas."
      );
    } else {
      console.error("Transaction Error:", error);
    }
    throw error;
  }
};

// Example usage: Calling the `init` function of your contract
const initContract = async () => {
  try {
    const receipt = await sendTransaction("init"); // Replace "init" with your function name
    console.log("Init function executed successfully:", receipt);
  } catch (error) {
    console.error("Error executing init function:", error);
  }
};

export { web3, contract, sendTransaction, initContract };

// Call the initContract function when needed
initContract();
