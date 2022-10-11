const ticketModel = require("../models/ticketModel");
const busModel = require("../models/busModel");
const {
  isValidString,
  isValidId,
  isValidRequest,
} = require("../validator/validator");

const bookTicket = async function (req, res) {
  try {
    if (!isValidRequest(req.body)) {
      return res
        .staus(400)
        .send({ status: false, message: "Please enter valud request" });
    }

    let busId = req.params.busId;
    const { passengerName, seat, date } = req.body;
    let data = {};

    data.userId = req.user._id;

    if (!isValidId(busId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid busId" });
    }

    if (!isValidString(passengerName)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid passenger name" });
    }

    data.passengerName = passengerName;

    if (!seat) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter seat" });
    }

    const bus = await busModel.findById({ _id: busId });
    if (!bus) {
      return res.status(404).send({ status: false, message: "Bus not found" });
    }
    data.busId = busId;

    if (seat.length > bus.seatsAvailable) {
      return res.status(400).send({
        status: false,
        message: `Only ${bus.seatsAvailable} seats available`,
      });
    }

    data.seat = seat;

    data.price = seat.length * bus.price;

    if (date < 1 || date > 30)
      return res
        .status(400)
        .send({ status: false, message: "Date should be in between 1 to 30" });

    if (date < bus.date[0] || date > bus.date[1]) {
      return res
        .status(400)
        .send({ status: false, message: "Bus not available for this date" });
    }

    data.date = date;

    await ticketModel.create(data);
    const booking = await ticketModel
      .findOne(data)
      .populate({
        path: "busId",
        select: {
          busNo: 1,
          source: 1,
          destination: 1,
          busType: 1,
          boardingTime: 1,
          droppingTime: 1,
          _id: 0,
        },
      })
      .populate({
        path: "userId",
        select: { gender: 1, age: 1, phone: 1 },
      });

    await busModel.findOneAndUpdate(
      { _id: busId },
      { $inc: { seatsAvailable: -seat.length } }
    );

    return res.status(201).send({
      status: true,
      message: "Ticket booked successfully",
      data: booking,
    });
  } catch (err) {
    return res.status(500).send({ status: false, Error: err.message });
  }
};

const myBookings = async function (req, res) {
  try {
    const userId = req.user._id;

    const findTicket = await ticketModel.find({ userId: userId });
    if (findTicket.length == 0) {
      return res
        .status(404)
        .send({ status: false, message: "No bookings found" });
    }
    return res
      .status(200)
      .send({ status: true, message: "All Bookings", data: findTicket });
  } catch (err) {
    return res.status(500).send({ status: false, Error: err.message });
  }
};

module.exports = { bookTicket, myBookings };
