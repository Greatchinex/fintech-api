import { Request, Response } from "express";

//=========== Models/Schema ==========//
import { User } from "../../entity/User";

//=========== Services ==========//
import { hashPass, verifyPass, jwtToken } from "../../services/jwt_pass";

export default {
  createUser: async (req: Request, res: Response) => {
    try {
      const { full_name, email, password } = req.body;
      const lowercase = email.toLowerCase();

      const userCheck = await User.findOne({ where: { email: lowercase } });

      if (userCheck) {
        return res.json({
          message: "A user with the email you entered already exist",
          success: false
        });
      }

      const hashedPassword: string = await hashPass(password);

      const newUser = User.create({
        email: lowercase,
        full_name,
        password: hashedPassword
      });

      const savedUser = await newUser.save();

      const token = jwtToken(savedUser.id, true);

      return res.status(201).json({
        message: "Account created successfully",
        token,
        success: true
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  userLogin: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const lowercase = email.toLowerCase();

      const userCheck = await User.findOne({ where: { email: lowercase } });

      if (!userCheck) {
        return res.status(400).json({
          message: "Incorrect login details",
          success: false
        });
      }

      // Check if user password match
      const isMatch = await verifyPass(userCheck.password, password);

      if (!isMatch) {
        return res.status(400).json({
          msg: "Incorrect login details",
          success: false
        });
      }

      const token = jwtToken(userCheck.id, true);

      return res.status(200).json({
        message: token,
        value: true,
        user: userCheck
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  userProfile: async (req: Request, res: Response) => {
    try {
      const user = await User.findOneOrFail({ id: req.user!.userId });

      return res.json({
        message: "User found",
        success: true,
        user
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
};
