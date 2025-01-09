const { initOrderEvents } = require("../modules/order/order.events");

const subscribeToEvent = () => {
  //  call individual events here
  initOrderEvents();
};

module.exports = {
  subscribeToEvent,
};
