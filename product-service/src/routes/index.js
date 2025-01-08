const express = require("express");
const productRouter = require("../app/modules/product/product.route");

const router = express.Router();

const routes = [
  {
    path: "/product",
    route: productRouter,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
