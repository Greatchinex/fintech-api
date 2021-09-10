import { Request, Response } from "express";
import crypto from "crypto";

//=========== Models/Schema ==========//
// import { User } from "../../entity/User";

//=========== Services ==========//

export default {
  stackWebhook: async (req: Request, res: Response) => {
    try {
      const secret = process.env.PAY_STACK_SECRET_KEY!;

      const hash = crypto
        .createHmac("sha512", secret)
        .update(JSON.stringify(req.body))
        .digest("hex");

      if (hash === req.headers["x-paystack-signature"]) {
        // Retrieve the request's body
        const event = req.body;
        console.log(event);
        if (event.event === "charge.success") {
          // Respond to paystack immediately to avoid webhook timeout and possible
          // data duplicity
          res.sendStatus(200);
        }
      }
    } catch (err) {
      // TODO: Add return statement
      res.status(500).json({ msg: err.message });
    }
  }
};
