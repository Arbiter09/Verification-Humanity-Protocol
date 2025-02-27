import express from "express";
import { issueCredentialController } from "../controllers/credentials.js";

const router = express.Router();

router.post("/issue-credential", issueCredentialController);

export default router;
