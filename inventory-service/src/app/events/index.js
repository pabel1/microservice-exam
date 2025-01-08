const { initInventoryEvents } = require("../modules/productInventory/productInventory.events");


const subscribeToEvent = () => {
  //  call individual events here
  initInventoryEvents();
};

module.exports = {
  subscribeToEvent,
};
