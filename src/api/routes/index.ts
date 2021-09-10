import { userRouter } from "./user";
import { transactionsRouter } from "./transactions";
import { webhookRouter } from "./webhooks";

export default (app: any) => {
  app.use(userRouter);
  app.use(transactionsRouter);
  app.use(webhookRouter);
};
