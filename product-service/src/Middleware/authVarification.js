const jwt = require("jsonwebtoken");
const ErrorHandler = require("../ErrorHandler/errorHandler");
const httpStatus = require("http-status");
const config = require("../config/config");
const { RedisClient } = require("../shared/redis");

const authVerification = async (req, res, next) => {
  try {
    // 1. Check if authorization header exists
    const { authorization } = req.headers;
    if (!authorization) {
      throw new ErrorHandler(
        "Authorization header is missing",
        httpStatus.UNAUTHORIZED
      );
    }

    // 2. Extract and validate token format
    const token = authorization.split(" ")[1];
    if (!token) {
      throw new ErrorHandler("Invalid token format", httpStatus.UNAUTHORIZED);
    }

    try {
      // 3. Verify JWT token
      const decoded = jwt.verify(token, config.jwt_key);
      const { email, userId } = decoded;

      // 4. Validate token in Redis
      try {
        const storedToken = await RedisClient.getAccessToken(userId);

        if (!storedToken) {
          throw new ErrorHandler("Session expired", httpStatus.UNAUTHORIZED);
        }

        if (storedToken !== token) {
          throw new ErrorHandler("Invalid session", httpStatus.UNAUTHORIZED);
        }

        // 5. Set verified user data in request
        req.userId = userId;
        req.email = email;

        next();
      } catch (redisError) {
        console.log("redisError : ", redisError);
        // Handle Redis specific errors
        throw new ErrorHandler(
          "Session validation failed",
          httpStatus.INTERNAL_SERVER_ERROR
        );
      }
    } catch (jwtError) {
      console.log("jwtError : ", jwtError);
      if (jwtError.name === "TokenExpiredError") {
        throw new ErrorHandler("Token has expired", httpStatus.UNAUTHORIZED);
      } else if (jwtError.name === "JsonWebTokenError") {
        throw new ErrorHandler("Invalid token", httpStatus.UNAUTHORIZED);
      } else {
        throw jwtError;
      }
    }
  } catch (error) {
    // Final error handler
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(
        new ErrorHandler(
          "Authentication failed",
          httpStatus.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
};

module.exports = authVerification;
