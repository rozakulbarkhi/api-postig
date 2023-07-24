import { MulterError } from "multer";
import { ResponseError } from "../errors/response-error.js";

const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    console.log(err);
    return res
      .status(err.status)
      .json({
        success: false,
        message: err.message,
        data: null,
      })
      .end();
  } else if (err instanceof MulterError) {
    console.log(err);

    return res
      .status(400)
      .json({
        success: false,
        message: "File too large, max 1MB",
        data: null,
      })
      .end();
  } else {
    console.log(err);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        data: null,
      })
      .end();
  }
};

export { errorMiddleware };
