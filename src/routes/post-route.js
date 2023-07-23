import express from "express";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import postController from "../controllers/post-controller.js";
import { uploadImage } from "../services/post-service.js";

const postRouter = new express.Router();

postRouter.use(authMiddleware);
postRouter.post("/post", postController.create);
postRouter
  .route("/post/:id")
  .put(postController.update)
  .delete(postController.deletePost);
postRouter.put("/post/like/:id", postController.like);
postRouter.put("/post/unlike/:id", postController.unlike);
postRouter.get("/post", postController.getAll);
postRouter.get("/post/:id", postController.get);
postRouter.get("/post/user/:id", postController.getByUser);

postRouter.post("/file", uploadImage, postController.upload);

export { postRouter };
