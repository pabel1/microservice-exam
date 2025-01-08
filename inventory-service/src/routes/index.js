const express = require("express");

const inventoryRouter = require("../app/modules/productInventory/productInventory.router");

const router = express.Router();

const routes = [
  {
    path: "/inventory",
    route: inventoryRouter,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
