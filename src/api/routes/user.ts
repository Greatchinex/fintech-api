import express from "express";

import user from "../controllers/user";

import {
  signupValidation,
  loginValidation
} from "../../schema/user_validations";
import { validateInput } from "../../middleware/validation_err";
import { auth } from "../../middleware/auth";

const router = express.Router();

router.post("/create_user", signupValidation, validateInput, user.createUser);
router.post("/user_login", loginValidation, validateInput, user.userLogin);
router.get("/user_profile", auth, user.userProfile);

export { router as userRouter };
