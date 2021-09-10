import express from "express";

import transactions from "../controllers/transactions";

import { initiatePayValidation } from "../../schema/transaction_validation";
import { validateInput } from "../../middleware/validation_err";
import { auth } from "../../middleware/auth";

const router = express.Router();

router.post(
  "/fund_account",
  auth,
  initiatePayValidation,
  validateInput,
  transactions.initatePay
);

export { router as transactionsRouter };
