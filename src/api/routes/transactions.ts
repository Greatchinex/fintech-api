import express from "express";

import transactions from "../controllers/transactions";

import {
  initiatePayValidation,
  savedCardValidation,
  transferFundsValidation
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
router.post(
  "/transfer_funds",
  auth,
  transferFundsValidation,
  validateInput,
  transactions.transferFunds
);
router.get("/my_sent_funds", auth, transactions.sentFunds);
router.get("/my_received_funds", auth, transactions.receivedFunds);
router.post("/withdraw_funds", auth, transactions.withdrawFunds);
router.get("/withdrawal_history", auth, transactions.myWithdrawals);

export { router as transactionsRouter };
