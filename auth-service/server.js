const { default: mongoose } = require("mongoose");
const { logger, errorLogger } = require("./src/shared/logger");
const config = require("./src/config/config");
const app = require("./index");
const { RedisClient } = require("./src/shared/redis");
const { subscribeToEvent } = require("./src/app/events");
const {
  verifyRedisClusterHealth,
} = require("./src/app/modules/users/testRedis");
async function main() {
  try {
    await mongoose.connect(config.database_url);
    console.log("Database connected Successfully!!");
    logger.info("Database connected Successfully!!");

    // redis connection
    // await RedisClient.connect().then(async () => {
    //   const isHealthy = await verifyRedisClusterHealth();
    //   if (isHealthy) {
    //     console.log("Redis cluster is healthy and ready", isHealthy);
    //     // subscribeToEvent();
    //   }
    //   console.log("Redis event  called");
    //   logger.info("Redis event  called");
    //   // call events
    //   subscribeToEvent();
    // });

    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          logger.info("Server closed");
        });
      }
      throw new Error("Application exited with an error");
    };

    const unexpectedErrorHandler = (error) => {
      errorLogger.error(error);
      exitHandler();
    };

    process.on("uncaughtException", unexpectedErrorHandler);
    process.on("unhandledRejection", unexpectedErrorHandler);

    process.on("SIGTERM", () => {
      logger.info("SIGTERM received");
      if (server) {
        server.close();
      }
    });
  } catch (error) {
    console.log(`Database connected Failed!! the issue is ${error}`);
    errorLogger.error(`Database connected Failed!! the issue is ${error}`);
  }
}

main();
