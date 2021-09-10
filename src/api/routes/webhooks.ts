import express from "express";

import webhook from "../controllers/webhooks";

const router = express.Router();

router.post("/paystack/webhook", webhook.stackWebhook);

export { router as webhookRouter };
