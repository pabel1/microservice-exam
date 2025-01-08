const { initProductEvents } = require("../modules/product/product.event");

const subscribeToEvent = () => {
  //  call individual events here
  initProductEvents();
};

module.exports = {
  subscribeToEvent,
};
