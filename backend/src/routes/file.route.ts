import { Router } from "express";
import { create, find, findOne, remove } from "../controllers/file.controller";
import { upload } from "../config/cloudinary";

const fileRouter = Router();

fileRouter.post("/upload", upload.single("file"), create);
fileRouter.get("/all", find);

fileRouter.route("/:id").get(findOne).delete(remove);

export default fileRouter;
