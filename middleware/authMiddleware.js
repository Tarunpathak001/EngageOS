const jwt = require("jsonwebtoken");

const authMiddleware =
  (req, res, next) => {

    try {

      const authHeader =
        req.headers.authorization;

      if (!authHeader) {

        return res.status(401).json({
          message: "Access Denied. No Token Provided",
        });

      }

      const token =
        authHeader.startsWith("Bearer ")
          ? authHeader.split(" ")[1]
          : authHeader;

      if (!token) {

        return res.status(401).json({
          message: "Invalid Token Format",
        });

      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.user = decoded;

      next();

    } catch (error) {

      console.error(
        "Auth Middleware Error:",
        error.message
      );

      return res.status(401).json({
        message: "Invalid or Expired Token",
      });

    }

};

module.exports =
  authMiddleware;