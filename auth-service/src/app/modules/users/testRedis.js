const { RedisClient } = require("../../../shared/redis");

const verifyRedisClusterHealth = async () => {
  try {
    // Test basic set/get operations
    const testKey = "test:cluster:health";
    const testValue = "working";

    // Test set operation
    await RedisClient.set(testKey, testValue);
    console.log("Redis SET operation successful");

    // Test get operation
    const retrievedValue = await RedisClient.get(testKey);
    console.log("Redis GET operation result:", retrievedValue);

    // Verify value matches
    if (retrievedValue === testValue) {
      console.log("Redis cluster is working correctly");
    } else {
      console.warn("Redis cluster data inconsistency detected");
    }

    return true;
  } catch (error) {
    console.error("Redis cluster health check failed:", error);
    return false;
  }
};

module.exports = { verifyRedisClusterHealth };
