import express from "express";

import user from "../controllers/user";

import {
  signupValidation,
  loginValidation,
  updateAcctValidation
} from "../../schema/user_validations";
import { validateInput } from "../../middleware/validation_err";
import { auth } from "../../middleware/auth";

const router = express.Router();

router.post("/create_user", signupValidation, validateInput, user.createUser);
router.post("/user_login", loginValidation, validateInput, user.userLogin);
router.get("/user_profile", auth, user.userProfile);
router.patch(
  "/add_acct_number",
  auth,
  updateAcctValidation,
  validateInput,
  user.updateAccount
);
router.post("/test", user.test);

export { router as userRouter };
