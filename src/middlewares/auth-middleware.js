import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const header =
    req.headers.authorization ||
    req.headers.Authorization ||
    req.header["Authorization"];

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "You are not authorized to access this route",
      data: null,
    });
  }

  if (!req.cookies.token) {
    return res.status(401).json({
      success: false,
      message: "You are not logged in",
      data: null,
    });
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You are not authorized to access this route",
      data: null,
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to access this route",
        data: null,
      });
    }

    req.userId = decoded.id;
    next();
  });
};

export { authMiddleware };
