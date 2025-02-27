import { createRequire } from "module";
const require = createRequire(import.meta.url);

import fetch from "node-fetch";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// Import the contract ABI using require
const contractABI = require("../contractABI.json");

// Set the chainId from your environment or default to 1942999413
const chainId = process.env.CHAIN_ID
  ? Number(process.env.CHAIN_ID)
  : 1942999413;

// Create a provider with custom network settings
const provider = new ethers.JsonRpcProvider(process.env.HUMANITY_RPC_URL, {
  chainId,
  name: "custom",
  ensAddress: null,
});

// Override ENS-related methods to disable ENS resolution
// Instead of completely replacing getNetwork, we now return an object with a dummy getPlugin
provider.getNetwork = async () => ({
  chainId,
  name: "custom",
  ensAddress: null,
  getPlugin: () => undefined, // Dummy implementation to satisfy ethers v6
});
provider.getEnsAddress = async (_name) => null;
provider.resolveName = async (_name) => null;
provider.lookupAddress = async (_address) => null;

const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Ensure that process.env.CONTRACT_ADDRESS is a valid Ethereum address
const musicContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  signer
);

export const issueCredential = async (subject_address, credentialType) => {
  try {
    const response = await fetch(
      "https://issuer.humanity.org/credentials/issue",
      {
        method: "POST",
        headers: {
          "X-API-Token": process.env.HUMANITY_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject_address,
          claims: { kyc: "passed" },
          // Off-chain credentialType value (update as needed)
          credentialType: "music_artistss",
        }),
      }
    );
    console.log("Raw Response:", response);
    const resp = await response.json();
    console.log("Parsed Response:", resp);
    return resp;
  } catch (error) {
    console.error("Error issuing credential:", error);
    throw error;
  }
};

export const markCredentialOnChain = async (
  subject_address,
  credentialType
) => {
  try {
    // Convert the credential type string to a bytes32 value using ethers.encodeBytes32String (ethers v6)
    const credentialKey = ethers.encodeBytes32String(credentialType);
    console.log("Converted credential key:", credentialKey);

    // Pre-check: Verify if this credential has already been issued.
    const alreadyIssued = await musicContract.hasCredential(
      subject_address,
      credentialKey
    );
    console.log("hasCredential:", alreadyIssued);
    if (alreadyIssued) {
      console.log(
        `Credential "${credentialType}" already issued for ${subject_address}`
      );
      return "Credential already issued";
    }
    console.log("HUMANITY_RPC_URL:", process.env.HUMANITY_RPC_URL);

    // Send the transaction with a gas limit override if needed.
    const tx = await musicContract.markCredentialIssued(
      subject_address,
      credentialKey,
      { gasLimit: 300000 }
    );
    await tx.wait();
    console.log("Transaction successful, hash:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error marking credential on-chain:", error);
    throw error;
  }
};
