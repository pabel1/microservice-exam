const { RedisClient } = require("./redis");

class RedisQueueService {
  constructor(queueName) {
    this.queueName = queueName;
  }

  async push(data) {
    try {
      return await RedisClient.lpush(this.queueName, JSON.stringify(data));
    } catch (error) {
      console.error(`Error pushing to ${this.queueName}:`, error);
      return false;
    }
  }

  async pop() {
    try {
      const data = await RedisClient.rpop(this.queueName);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error popping from ${this.queueName}:`, error);
      return null;
    }
  }

  async blockingPop(timeout = 0) {
    try {
      const result = await RedisClient.brpop(this.queueName, timeout);
      return result ? JSON.parse(result[1]) : null;
    } catch (error) {
      console.error(`Error in blocking pop from ${this.queueName}:`, error);
      return null;
    }
  }

  async getLength() {
    return await RedisClient.llen(this.queueName);
  }
}

module.exports = RedisQueueService;
