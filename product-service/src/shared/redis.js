const IORedis = require("ioredis");
const config = require("../config/config");

const createClusterClient = () => {
  const nodes = config.redis.nodes;
  console.log("Connecting to Redis nodes:", nodes);

  return new IORedis.Cluster(nodes, {
    redisOptions: {
      connectTimeout: 10000,
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        console.log(`Retry attempt ${times} with delay ${delay}ms`);
        return delay;
      },
    },
    clusterRetryStrategy(times) {
      const delay = Math.min(times * 100, 3000);
      console.log(`Cluster retry attempt ${times} with delay ${delay}ms`);
      return delay;
    },
  });
};

// Create separate clients for different purposes
const redisCluster = createClusterClient();
const redisPubCluster = createClusterClient();
const redisSubCluster = createClusterClient();

// Event handlers
redisCluster.on("error", (error) =>
  console.error("Redis Cluster Error:", error)
);
redisCluster.on("connect", () => console.log("Redis Cluster Connected"));
redisCluster.on("node:added", (node) =>
  console.log("Node added to cluster:", node)
);
redisCluster.on("node:removed", (node) =>
  console.log("Node removed from cluster:", node)
);

// Subscription handler map
const subscriptionHandlers = new Map();

const RedisClient = {
  connect: async () => {
    try {
      // Test connection
      await redisCluster.ping();
      console.log("Redis Cluster initialized and connected");
      return true;
    } catch (error) {
      console.error("Redis connection failed:", error);
      throw error;
    }
  },

  publish: async (channel, message) => {
    return redisPubCluster.publish(channel, message);
  },

  subscribe: (channel, callback) => {
    if (!subscriptionHandlers.has(channel)) {
      subscriptionHandlers.set(channel, []);
      redisSubCluster.subscribe(channel);
    }

    subscriptionHandlers.get(channel).push(callback);

    redisSubCluster.on("message", (subscribedChannel, message) => {
      if (subscribedChannel === channel) {
        subscriptionHandlers
          .get(channel)
          .forEach((handler) => handler(message));
      }
    });
  },

  get: (key) => redisCluster.get(key),
  set: (key, value) => redisCluster.set(key, value),
  del: (key) => redisCluster.del(key),
  lpush: (key, value) => redisCluster.lpush(key, value),
  rpop: (key) => redisCluster.rpop(key),
  hset: (key, hashKey, value) => redisCluster.hset(key, hashKey, value),
  hget: (key, hashKey) => redisCluster.hget(key, hashKey),
  setAccessToken: async (userId, token) => {
    console.log("token", token);
    const key = `access-token:${userId}`;
    // const expiryInSeconds = parseInt(config.jwt_token_expire) || 10;
    const expiryInSeconds = 10 * 24 * 60 * 60;
    await redisCluster.set(key, token, "EX", expiryInSeconds);
  },

  getAccessToken: async (userId) => {
    const key = `access-token:${userId}`;
    // console.log("key : ", await redisCluster.get(key));
    return await redisCluster.get(key);
  },

  delAccessToken: async (userId) => {
    const key = `access-token:${userId}`;
    await redisCluster.del(key);
  },
};

module.exports = { RedisClient };
