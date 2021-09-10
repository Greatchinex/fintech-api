import { Request, Response } from "express";

//=========== Models/Schema ==========//
import { User } from "../../entity/User";
import { Card } from "../../entity/Cards";
import { FundHistory } from "../../entity/FundHistory";

//=========== Services ==========//
import { verifyPass } from "../../services/jwt_pass";
import { initiateUserPay, recurringCharge } from "../../services/paystack/apis";
import { successCardCharge } from "../../services/paystack/resolve_transaction";

export default {
  initatePay: async (req: Request, res: Response) => {
    try {
      const { amount, password } = req.body;
      const user = await User.findOneOrFail({ id: req.user!.userId });

      if (!user) {
        return res.json({
          message: "Cannot find user trying to initate this transaction",
          success: false
        });
      }

      if (typeof amount !== "number") {
        return res.json({
          message: "amount should be an integer value",
          success: false
        });
      }

      // Check if user password match
      const isMatch = await verifyPass(user.password, password);

      if (!isMatch) {
        return res.json({
          msg: "Incorrect password",
          success: false
        });
      }

      const body = {
        email: user.email,
        amount: amount * 100,
        metadata: {
          id: user.id,
          paid_with_saved_card: "false"
        }
      };

      const response = await initiateUserPay(body);

      if (!response.status) {
        return res.json({
          message: "There was an issue processing payment",
          success: false,
          failure_reason: response.message
        });
      }

      return res.json({
        message: response.data.authorization_url,
        success: true
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  savedCards: async (req: Request, res: Response) => {
    try {
      const myCards = await Card.find({
        where: { user: req.user!.userId },
        relations: ["user"]
      });

      return res.json({
        message: "Data found",
        success: true,
        cards: myCards
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  userFundHistory: async (req: Request, res: Response) => {
    try {
      const fundHistory = await FundHistory.find({
        where: { user: req.user!.userId },
        relations: ["user"]
      });

      return res.json({
        message: "Data found",
        success: true,
        payment: fundHistory
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  reccuringFunding: async (req: Request, res: Response) => {
    try {
      const { amount, password, card_type, last4 } = req.body;

      const find_card = await Card.findOne({
        where: { card_type, last4 },
        relations: ["user"]
      });

      if (!find_card) {
        return res.json({
          message: "Cannot find this card",
          success: false
        });
      }

      if (typeof amount !== "number") {
        return res.json({
          message: "amount should be an integer value",
          success: false
        });
      }

      // Check if user password match
      const isMatch = await verifyPass(find_card.user.password, password);

      if (!isMatch) {
        return res.json({
          msg: "Incorrect password",
          success: false
        });
      }

      const body = {
        authorization_code: find_card.authorization_code,
        email: find_card.user.email,
        amount: amount * 100
      };

      const data = await recurringCharge(body);

      if (data.data.status === "failed") {
        return res.json({
          message: "There was an issue processing payment",
          success: false
        });
      }

      const response = await successCardCharge(data, find_card.user.id);

      if (response) {
        return res.json({
          message: "Payment successfully proccessed",
          success: true
        });
      } else {
        return res.json({
          message: "There was an issue processing payment",
          success: false
        });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
};
