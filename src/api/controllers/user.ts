import { Request, Response } from "express";

export default {
  createUser: async (_: Request, res: Response) => {
    try {
      return res.json({
        message: "Tester",
        value: true
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
};
