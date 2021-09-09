import { userRouter } from "./user";

export default (app: any) => {
  app.use(userRouter);
};
