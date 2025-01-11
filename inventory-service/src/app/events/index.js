const {
  initInventoryEvents,
  initInventoryQueueProcessor,
} = require("../modules/productInventory/productInventory.events");

const subscribeToEvent = () => {
  //  call individual events here
  initInventoryEvents();

  // redis queue
  initInventoryQueueProcessor();
};

module.exports = {
  subscribeToEvent,
};
