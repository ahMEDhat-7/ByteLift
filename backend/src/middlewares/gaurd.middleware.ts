import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import { verifyToken } from "../utils/tokenHelper";
import { getPool } from "../config/db";

const authGaurd = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // check token exists
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return next(new CustomError(400, "token not provided"));
    // extract payload
    const payload = verifyToken(token);
    // verify if valid
    if (!payload)
      return next(
        new CustomError(401, "Invalid Token - Token is invalid or expired"),
      );

    const user = await getPool().query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [payload.id],
    );

    if (!user.rows.length)
      return next(new CustomError(401, "Invalid Token - user not found"));

    // pass user info for downstream handlers
    (req as any)["user"] = { id: user.rows[0].id, username: user.rows[0].username, email: user.rows[0].email };
    next();
  } catch (error) {
    next(new CustomError(500, "Something wrong occurs"));
  }
};

export { authGaurd };
