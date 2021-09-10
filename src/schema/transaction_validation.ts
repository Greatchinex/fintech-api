import { body } from "express-validator";

// Initiate payment
const initiatePayValidation = [
  body("amount")
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage("Amount is required"),
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required")
];

export { initiatePayValidation };
