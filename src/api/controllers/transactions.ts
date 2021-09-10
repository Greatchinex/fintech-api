import { Request, Response } from "express";
import { getConnection, createQueryBuilder } from "typeorm";

//=========== Models/Schema ==========//
import { User } from "../../entity/User";
import { Card } from "../../entity/Cards";
import { FundHistory } from "../../entity/FundHistory";
import { UserTransfers } from "../../entity/UserTransfers";

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

      const response: boolean = await successCardCharge(
        data,
        find_card.user.id
      );

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
  },

  transferFunds: async (req: Request, res: Response) => {
    try {
      const { amount_sent, user_id } = req.body;

      // Get user sending cash
      const user = await User.findOneOrFail({ id: req.user!.userId });

      if (!user) {
        return res.json({
          message: "Cannot find user trying to initate this transaction",
          success: false
        });
      }

      if (typeof amount_sent !== "number") {
        return res.json({
          message: "amount should be an integer value",
          success: false
        });
      }

      // Check for sufficient balance
      if (amount_sent > user.wallet_balance) {
        return res.json({
          message: "Insufficient funds for this transfer",
          success: false
        });
      }

      // Remove money and add to receiver account(Transactions)
      // Create Transaction with query runner for Transactions
      const connection = getConnection();
      const queryRunner = connection.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const updatedSender = await queryRunner.manager
          .createQueryBuilder()
          .update(User)
          .set({ wallet_balance: () => "wallet_balance - :amount_sent" })
          .setParameter("amount_sent", amount_sent)
          .where("id = :id", { id: user.id })
          .returning("*")
          .updateEntity(true)
          .execute();

        const updatedReceiver = await queryRunner.manager
          .createQueryBuilder()
          .update(User)
          .set({ wallet_balance: () => "wallet_balance + :amount_sent" })
          .setParameter("amount_sent", amount_sent)
          .where("id = :id", { id: user_id })
          .returning("*")
          .updateEntity(true)
          .execute();

        // Create user transfers
        await queryRunner.manager.save(UserTransfers, {
          amount_sent,
          sender: updatedSender.raw[0],
          receiver: updatedReceiver.raw[0]
        });

        await queryRunner.commitTransaction();

        return res.json({
          message: "Transfer successful",
          success: true
        });
      } catch (err) {
        await queryRunner.rollbackTransaction();

        return res.json({
          message: "There was an issue processing payment",
          success: false
        });
      } finally {
        await queryRunner.release();
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  sentFunds: async (req: Request, res: Response) => {
    try {
      const sent_funds = await createQueryBuilder("UserTransfers")
        .leftJoinAndSelect("UserTransfers.receiver", "receiver")
        .where("UserTransfers.sender = :sender", {
          sender: req.user!.userId
        })
        .getMany();

      return res.json({
        message: "Data found",
        success: true,
        funds_sent_to: sent_funds
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  receivedFunds: async (req: Request, res: Response) => {
    try {
      const received_funds = await createQueryBuilder("UserTransfers")
        .leftJoinAndSelect("UserTransfers.sender", "sender")
        .where("UserTransfers.receiver = :receiver", {
          receiver: req.user!.userId
        })
        .getMany();

      return res.json({
        message: "Data found",
        success: true,
        funds_sent_by: received_funds
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
};
