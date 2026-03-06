import type { NextFunction, Request, Response } from "express";
import wrapper from "../middlewares/wrapper.middleware";
import { CustomError } from "../utils/CustomError";
import { getPool } from "../config/db";
import { deleteFile } from "../config/cloudinary";

interface CloudinaryFile extends Express.Multer.File {
  path: string;
}

const create = wrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) return next(new CustomError(400, "Missing uploads"));
      const id = (req as any).user.id;
      const file = req.file as CloudinaryFile;

      const cloudinaryUrl = file.path;
      const publicId = file.filename;

      await getPool().query(
        `INSERT INTO files (user_id, original_name, stored_name, cloudinary_url, public_id, mime_type, size) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          id,
          file.originalname,
          publicId,
          cloudinaryUrl,
          publicId,
          file.mimetype,
          file.size,
        ],
      );

      return res.status(201).json({ file: cloudinaryUrl });
    } catch (error) {
      return next(new CustomError(500, "Something wrong occurs"));
    }
  },
);

const find = wrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rows } = await getPool().query(
        "SELECT id, original_name, mime_type, size, stored_name, cloudinary_url, created_at FROM files WHERE user_id = $1",
        [(req as any).user.id],
      );
      return res.status(200).json({ files: rows });
    } catch (err) {
      return next(new CustomError(500, "Something wrong occurs"));
    }
  },
);

const findOne = wrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const fileId = req.params.id;
    try {
      const { rows } = await getPool().query(
        "SELECT cloudinary_url, original_name FROM files WHERE id = $1 AND user_id = $2",
        [fileId, (req as any).user.id],
      );
      if (!rows.length) {
        return res.status(404).json({ error: "File not found" });
      }
      const file = rows[0];
      return res.redirect(file.cloudinary_url);
    } catch (err) {
      next(new CustomError(500, "Something wrong occurs"));
    }
  },
);

const remove = wrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const fileId = req.params.id;
    try {
      const { rows } = await getPool().query(
        "SELECT public_id FROM files WHERE id = $1 AND user_id = $2",
        [fileId, (req as any).user.id],
      );
      if (!rows.length) {
        return next(new CustomError(404, "File not found"));
      }
      const publicId = rows[0].public_id;
      await getPool().query("DELETE FROM files WHERE id = $1", [fileId]);

      await deleteFile(publicId);

      return res.status(200).json({ success: true });
    } catch (err) {
      return next(new CustomError(500, "Something wrong occurs"));
    }
  },
);

export { create, find, findOne, remove };
