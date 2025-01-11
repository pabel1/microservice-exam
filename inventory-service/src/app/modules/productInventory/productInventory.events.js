const { EVENTS } = require("../../../constant/eventsConstant");
const { RedisClient } = require("../../../shared/redis");
const InventoryServices = require("./productInventory.service");

const initInventoryEvents = () => {
  try {
    RedisClient.subscribe(
      EVENTS.INVENTORY_EVENTS.INVENTORY_CREATED,
      async (e) => {
        console.log(" event received", JSON.parse(e));
        const data = await InventoryServices.createInventoryProductIntoDB(
          JSON.parse(e)
        );
        console.log("create inventory", data);
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  initInventoryEvents,
};
