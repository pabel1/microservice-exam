const express = require("express");

const orderRouter = require("../app/modules/order/order.route");

const router = express.Router();

const routes = [
  {
    path: "/order",
    route: orderRouter,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
