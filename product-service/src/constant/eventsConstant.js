const AUTH_EVENTS = {
  USER_CREATED: "auth.user.created",
  USER_UPDATED: "auth.user.updated",
  USER_DELETED: "auth.user.deleted",
  USER_LOGIN: "auth.user.login",
  USER_LOGOUT: "auth.user.logout",
};

const PRODUCT_EVENTS = {
  PRODUCT_CREATED: "product.created",
  PRODUCT_UPDATED: "product.updated",
  PRODUCT_DELETED: "product.deleted",
};

const ORDER_EVENTS = {
  ORDER_CREATED: "order.created",
  ORDER_UPDATED: "order.updated",
  ORDER_DELETED: "order.deleted",
};

const INVENTORY_EVENTS = {
  INVENTORY_CREATED: "inventory.created",
  INVENTORY_UPDATED: "inventory.updated",
  INVENTORY_DELETED: "inventory.deleted",
};

const EVENTS = {
  AUTH_EVENTS,
  PRODUCT_EVENTS,
  ORDER_EVENTS,
  INVENTORY_EVENTS,
};

module.exports = {
  EVENTS,
};
