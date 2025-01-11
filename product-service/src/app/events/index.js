const {
  initProductEvents,
  initInventoryQueueProcessor,
} = require("../modules/product/product.event");

const subscribeToEvent = () => {
  //  call individual events here
  initProductEvents();

  // redis queue
  // initInventoryQueueProcessor();
};

module.exports = {
  subscribeToEvent,
};
