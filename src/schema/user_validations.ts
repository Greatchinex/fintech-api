import { body } from "express-validator";

// User signup check
const signupValidation = [
  body("full_name")
    .exists({ checkFalsy: true })
    .withMessage("Full name is required"),
  body("email")
    .isEmail()
    .exists({ checkFalsy: true })
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required")
];

// User login
const loginValidation = [
  body("email")
    .isEmail()
    .exists({ checkFalsy: true })
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required")
];

// Update user account number
const updateAcctValidation = [
  body("account_number")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Please enter an account number"),
  body("bank_code")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Bank code should have a value")
];

export { signupValidation, loginValidation, updateAcctValidation };
