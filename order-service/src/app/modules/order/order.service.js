const { pushOrderInventoryEventToQueue } = require("./order.events");
const OrderModel = require("./order.model");

const createOrderIntoDB = async (payload) => {
  const order = new OrderModel(payload);
  const newOrder = await order.save();

  // send ordered product to inventory service
  if (newOrder) {
    await pushOrderInventoryEventToQueue(newOrder);
  }
  return newOrder;
};

const orderServices = {
  createOrderIntoDB,
};

module.exports = orderServices;
