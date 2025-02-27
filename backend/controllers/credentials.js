import {
  issueCredential,
  markCredentialOnChain,
} from "../services/humanityService.js";

export const issueCredentialController = async (req, res) => {
  try {
    console.log("Inside issueCredentialController");
    const { subject_address, credentialType } = req.body;

    // Step 1: Call Humanity API
    const credentialResult = await issueCredential(
      subject_address,
      credentialType
    );
    console.log("Credential Result: ", credentialResult);

    // Check if the credential issuance was successful
    if (credentialResult.message !== "Credential issued successfully") {
      throw new Error("Credential issuance failed");
    }

    // Step 2: Mark on-chain
    const txHash = await markCredentialOnChain(subject_address, credentialType);

    return res.json({ success: true, txHash });
  } catch (error) {
    console.error("Error in issueCredentialController: ", error);
    return res.status(500).json({ error: error.message });
  }
};
