import { createRequire } from "module";
const require = createRequire(import.meta.url);
import fetch from "node-fetch";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// Import the contract ABI using require.
const contractABI = require("../contractABI.json");

// Set the chainId from your environment or default to 1942999413.
const chainId = process.env.CHAIN_ID
  ? Number(process.env.CHAIN_ID)
  : 1942999413;

// Create a provider with custom network settings.
const provider = new ethers.JsonRpcProvider(process.env.HUMANITY_RPC_URL, {
  chainId,
  name: "custom",
  ensAddress: null,
});

// Override ENS-related methods to disable ENS resolution.
provider.getNetwork = async () => ({
  chainId,
  name: "custom",
  ensAddress: null,
  getPlugin: () => undefined,
});
provider.getEnsAddress = async (_name) => null;
provider.resolveName = async (_name) => null;
provider.lookupAddress = async (_address) => null;

const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Create an instance of your MusicDistribution contract.
const musicContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  signer
);

/**
 * Issues a credential by calling Humanity's API and returns the response.
 */
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

/**
 * Marks the credential as issued on-chain.
 */
export const markCredentialOnChain = async (
  subject_address,
  credentialType
) => {
  try {
    const credentialKey = ethers.encodeBytes32String(credentialType);
    console.log("Converted credential key:", credentialKey);

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

/**
 * Checks if the given address is verified on Humanity Protocol.
 * Uses a minimal ABI to call the isVerified function on the IVC contract.
 */
const vcContractABI = [
  "function isVerified(address _user) view returns (bool)",
];
const vcContract = new ethers.Contract(
  process.env.VC_CONTRACT_ADDRESS,
  vcContractABI,
  provider
);

export const checkVerification = async (subject_address) => {
  try {
    const isVerified = await vcContract.isVerified(subject_address);
    console.log("isVerified:", isVerified);
    return isVerified;
  } catch (error) {
    console.error("Error checking verification:", error);
    throw error;
  }
};

/**
 * Revokes a credential on-chain.
 */
export const revokeCredentialOnChain = async (
  subject_address,
  credentialType
) => {
  try {
    const credentialKey = ethers.encodeBytes32String(credentialType);
    console.log("Converted credential key:", credentialKey);

    const alreadyIssued = await musicContract.hasCredential(
      subject_address,
      credentialKey
    );
    if (!alreadyIssued) {
      throw new Error("Credential not issued");
    }

    const tx = await musicContract.revokeCredential(
      subject_address,
      credentialKey,
      { gasLimit: 300000 }
    );
    await tx.wait();
    console.log("Credential revoked successfully, tx hash:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error revoking credential on-chain:", error);
    throw error;
  }
};

/**
 * Gets the total number of credentials and the list of credential types for an address.
 * Converts each stored bytes32 credential back to a string.
 */
export const getCredentialDetails = async (subject_address) => {
  try {
    const count = await musicContract.getCredentialCount(subject_address);
    const typesBytes32 = await musicContract.getCredentialTypes(
      subject_address
    );
    // In ethers v6, use ethers.parseBytes32String instead of ethers.utils.parseBytes32String.
    const types = typesBytes32.map((b) => ethers.decodeBytes32String(b));
    console.log("Credential count for", subject_address, ":", count.toString());
    console.log("Credential types for", subject_address, ":", types);
    return { count: count.toString(), types };
  } catch (error) {
    console.error("Error getting credential details:", error);
    throw error;
  }
};

export { musicContract };
