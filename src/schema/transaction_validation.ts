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

const savedCardValidation = [
  body("amount")
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage("Amount is required"),
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required"),
  body("card_type")
    .exists({ checkFalsy: true })
    .withMessage("Card type is required"),
  body("last4")
    .exists({ checkFalsy: true })
    .withMessage("Last four is required")
];

export { initiatePayValidation, savedCardValidation };
