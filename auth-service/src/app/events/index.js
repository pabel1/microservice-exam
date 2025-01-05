const { initUserEvents } = require("../modules/users/user.event");

const subscribeToEvent = () => {
  //  call individual events here
  initUserEvents();
};

module.exports = {
  subscribeToEvent,
};
