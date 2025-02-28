import express from "express";
import {
  issueCredentialController,
  checkVerificationController,
  revokeCredentialController,
  getCredentialDetailsController,
} from "../controllers/credentials.js";

const router = express.Router();

router.post("/issue-credential", issueCredentialController);
router.post("/check-verification", checkVerificationController);
router.post("/revoke-credential", revokeCredentialController);
router.post("/credential-details", getCredentialDetailsController);

export default router;
