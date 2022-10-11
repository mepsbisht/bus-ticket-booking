const express = require("express");
const router = express.Router();
const { createBus, getBusByQuery } = require("../controllers/busController");
const { bookTicket , myBookings } = require("../controllers/ticketController");
const { createUser, login } = require("../controllers/userController");
const { authentication, authorization } = require("../middleware/auth");

router.post("/createBus", createBus);
router.post("/createUser", createUser);
router.post("/login", login);
router.get("/bus", authentication, getBusByQuery);
router.post("/bookTicket/:userId/:busId", authentication, authorization, bookTicket);
router.get ("/myBookings/:userId",authentication,authorization, myBookings)

// testing the route

router.all("/*", function (req, res) {
  return res.status(404).send({ status: false, message: "Path not found" });
});

module.exports = router;
