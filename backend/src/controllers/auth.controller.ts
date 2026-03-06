import type { Request, Response, NextFunction } from "express";
import wrapper from "../middlewares/wrapper.middleware";
import { CustomError } from "../utils/CustomError";
import { hashPassword, verifyPassword } from "../utils/hashHelper";
import { getPool } from "../config/db";
import { generateToken } from "../utils/tokenHelper";

const signup = wrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, username } = req.body;
      if (!email || !password || !username)
        return next(new CustomError(400, "Missing credentials"));

      const existingEmail = await getPool().query(
        "SELECT id FROM users WHERE email = $1;",
        [email],
      );
      if (existingEmail.rows.length > 0)
        return next(new CustomError(400, "Email already exists"));

      const existingUsername = await getPool().query(
        "SELECT id FROM users WHERE username = $1;",
        [username],
      );
      if (existingUsername.rows.length > 0)
        return next(new CustomError(400, "Username already exists"));

      const hashedPassword = await hashPassword(password);
      const newUser = await getPool().query(
        "INSERT INTO users(username, email, password_hash) VALUES($1, $2, $3) RETURNING id, username, email;",
        [username, email, hashedPassword],
      );

      const token = generateToken({ id: newUser.rows[0].id });

      return res.status(201).json({
        message: "user created",
        data: { id: newUser.rows[0].id, username: newUser.rows[0].username, email: newUser.rows[0].email, token },
      });
    } catch (error) {
      return next(new CustomError(500, "Something wrong occurs"));
    }
  },
);

const login = wrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return next(new CustomError(400, "Missing credentials"));

      const user = await getPool().query(
        "SELECT id, username, email, password_hash FROM users WHERE email = $1;",
        [email],
      );
      if (!user.rows.length)
        return next(new CustomError(401, "Invalid email or password"));

      const check = await verifyPassword(password, user.rows[0].password_hash);
      if (!check) return next(new CustomError(401, "Invalid password"));

      const token = generateToken({ id: user.rows[0].id });

      return res.status(200).json({
        message: "you logged in",
        data: { id: user.rows[0].id, username: user.rows[0].username, email: user.rows[0].email, token },
      });
    } catch (error) {
      return next(new CustomError(500, "Something wrong occurs"));
    }
  },
);

export { login, signup };
