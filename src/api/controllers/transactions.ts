import { Request, Response } from "express";

//=========== Models/Schema ==========//
import { User } from "../../entity/User";

//=========== Services ==========//
import { verifyPass } from "../../services/jwt_pass";
import { initiateUserPay } from "../../services/paystack/apis";

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
  }
};
