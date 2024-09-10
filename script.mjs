import fetch from "node-fetch";
import { ethers } from "ethers";
import fs from "fs/promises"; // Use the promise-based fs API

async function fetchWithRetry(url, options = {}, retries = 3, backoff = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.text(); // Return raw text instead of JSON
    } catch (error) {
      console.error(`Attempt ${i + 1} failed. ${error.message}`);
      if (i < retries - 1) {
        console.log(`Retrying in ${backoff}ms...`);
        await new Promise((res) => setTimeout(res, backoff));
      } else {
        throw new Error(`All ${retries} attempts failed.`);
      }
    }
  }
}

async function main() {
  const etherscanApiKey = "8CJC6RZKNGJI3YB9U36F2HYPP2VT4MUYWP";
  // const contractAddress = "0xe4D57693384bBF00B045D58D0aff65C3925cBB96"; // Replace with your actual contract address

  const contractAddress = "0x470ef9cb90f38a2a70e59271b89e42f85e222338";

  const privateKey =
    "8e703c358b3b7a6010e7de0749b43adca6fe77959f9d2d278c47974b8c98979a";
  const nodeUrl = "https://sepolia-rollup.arbitrum.io/rpc";

  const abiUrl = `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${etherscanApiKey}`;

  try {
    const rawData = await fetchWithRetry(abiUrl);
    console.log("Raw response data:", rawData); // Log the raw response
    const data = JSON.parse(rawData); // Attempt to parse JSON
    const abi = JSON.parse(data.result);

    // Write ABI to a file
    await fs.writeFile(
      "contractABI.json",
      JSON.stringify(abi, null, 2),
      "utf8"
    );
    console.log("ABI has been written to contractABI.json");

    const provider = new ethers.JsonRpcProvider(nodeUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    // const contract = new ethers.Contract(contractAddress, abi, wallet);

    console.log("Connected to contract:", contractAddress);
    console.log("Using wallet address:", wallet.address);

    // Additional code for interacting with the contract...
  } catch (error) {
    console.error("Failed to fetch ABI:", error);
  }
}

main().catch((error) => {
  console.error("Error:", error);
});
