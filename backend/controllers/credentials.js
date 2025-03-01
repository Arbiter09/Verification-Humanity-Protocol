import {
  issueCredential,
  markCredentialOnChain,
  checkVerification,
  revokeCredentialOnChain,
  getCredentialDetails,
  verifyCredentialByAddress,
} from "../services/humanityservices.js";

export const issueCredentialController = async (req, res) => {
  try {
    console.log("Inside issueCredentialController");
    const { subject_address, credentialType } = req.body;

    // 1) Off-chain issuance
    const credentialResult = await issueCredential(
      subject_address,
      credentialType
    );
    console.log("Credential Result: ", credentialResult);

    // 2) Check if off-chain issuance was successful
    if (credentialResult.message !== "Credential issued successfully") {
      throw new Error("Credential issuance failed");
    }

    // 3) Mark the credential as issued on-chain
    const txHash = await markCredentialOnChain(subject_address, credentialType);
    return res.json({ success: true, txHash });
  } catch (error) {
    console.error("Error in issueCredentialController:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const checkVerificationController = async (req, res) => {
  try {
    console.log("Inside checkVerificationController");
    const { subject_address } = req.body;
    const verified = await checkVerification(subject_address);
    return res.json({ verified });
  } catch (error) {
    console.error("Error in checkVerificationController:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const revokeCredentialController = async (req, res) => {
  try {
    console.log("Inside revokeCredentialController");
    const { subject_address, credentialType } = req.body;
    const txHash = await revokeCredentialOnChain(
      subject_address,
      credentialType
    );
    return res.json({ success: true, txHash });
  } catch (error) {
    console.error("Error in revokeCredentialController:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getCredentialDetailsController = async (req, res) => {
  try {
    console.log("Inside getCredentialDetailsController");
    const { subject_address } = req.body;
    const details = await getCredentialDetails(subject_address);
    return res.json(details);
  } catch (error) {
    console.error("Error in getCredentialDetailsController:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Verifies a credential by address + type. We do NOT require the user
 * to provide the entire credential JSON. The backend fetches it from the cache.
 */
export const verifyCredentialController = async (req, res) => {
  try {
    console.log("Inside verifyCredentialController");
    const { subject_address, credentialType } = req.body;

    const verificationResult = await verifyCredentialByAddress(
      subject_address,
      credentialType
    );
    return res.json(verificationResult);
  } catch (error) {
    console.error("Error in verifyCredentialController:", error);
    return res.status(500).json({ error: error.message });
  }
};
