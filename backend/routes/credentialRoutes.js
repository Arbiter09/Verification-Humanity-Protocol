import express from "express";
import {
  issueCredentialController,
  checkVerificationController,
} from "../controllers/credentials.js";

const router = express.Router();

router.post("/issue-credential", issueCredentialController);
router.post("/check-verification", checkVerificationController);

export default router;
