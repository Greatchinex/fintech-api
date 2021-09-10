import express from "express";

import transactions from "../controllers/transactions";

import {
  initiatePayValidation,
  savedCardValidation
} from "../../schema/transaction_validation";
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
router.get("/my_saved_cards", auth, transactions.savedCards);
router.get("/fund_history", auth, transactions.userFundHistory);
router.post(
  "/pay_with_saved_cards",
  auth,
  savedCardValidation,
  validateInput,
  transactions.reccuringFunding
);

export { router as transactionsRouter };
