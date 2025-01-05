const IORedis = require("ioredis");
const config = require("../config/config");

const createClusterClient = () => {
  return new IORedis.Cluster(
    config.redis.nodes.map(({ host, port }) => ({ host, port })),
    {
      redisOptions: {
        connectTimeout: 10000,
        retryStrategy(times) {
          return Math.min(times * 50, 2000);
        },
      },
      clusterRetryStrategy(times) {
        return Math.min(times * 100, 3000);
      },
    }
  );
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
    console.log("Redis Cluster initialized");
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
  setAccessToken: async (userId, token) => {
    const key = `access-token:${userId}`;
    await redisCluster.set(key, token, { EX: Number(config.jwt_token_expire) });
  },

  getAccessToken: async (userId) => {
    const key = `access-token:${userId}`;
    return await redisCluster.get(key);
  },

  delAccessToken: async (userId) => {
    const key = `access-token:${userId}`;
    await redisCluster.del(key);
  },
};

module.exports = { RedisClient };
