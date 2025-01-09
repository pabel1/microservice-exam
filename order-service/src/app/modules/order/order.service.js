const OrderModel = require("./order.model");

const createOrderIntoDB = async (payload) => {
  const order = new OrderModel(payload);
  const newOrder = await order.save();
  return newOrder;
};

const orderServices = {
  createOrderIntoDB,
};

module.exports = orderServices;
