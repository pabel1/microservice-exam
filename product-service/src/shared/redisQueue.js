const { RedisClient } = require("./redis");

class RedisQueueService {
  constructor(queueName) {
    this.queueName = queueName;
  }

  async push(taskId, data, status = "pending") {
    try {
      const payload = {
        taskId: taskId,
        data: data,
        status: status,
      };
      return await RedisClient.lpush(this.queueName, JSON.stringify(payload));
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

  // Process queue with a worker
  async process(workerCallback) {
    try {
      while (true) {
        const data = await this.pop();
        if (data) {
          await workerCallback(data);
        } else {
          // No data, wait for a short period before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error(`Error processing queue ${this.queueName}:`, error);
    }
  }
}

module.exports = RedisQueueService;
