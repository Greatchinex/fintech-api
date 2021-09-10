import { Request, Response } from "express";
import crypto from "crypto";

//=========== Services ==========//
import { paymentSelector } from "../../services/paystack";

export default {
  stackWebhook: async (req: Request, res: Response) => {
    try {
      const secret = process.env.PAY_STACK_SECRET_KEY!;

      const hash = crypto
        .createHmac("sha512", secret)
        .update(JSON.stringify(req.body))
        .digest("hex");

      if (hash === req.headers["x-paystack-signature"]) {
        const event = req.body;
        console.log(event);

        // Respond to paystack immediately to avoid webhook timeout and possible
        // data duplicity
        res.sendStatus(200);

        paymentSelector(event.event, event);
      }
    } catch (err) {
      // TODO: Add return statement
      res.status(500).json({ msg: err.message });
    }
  }
};
