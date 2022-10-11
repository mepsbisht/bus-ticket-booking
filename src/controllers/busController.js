const busModel = require("../models/busModel");
const {
  isValidRequest,
  isValidString,
  isValidPinCode,
  isValidBusNo,
  isValidInteger,
  isValidBusType,
} = require("../validator/validator");

const createBus = async function (req, res) {
  try {
    if (!isValidRequest(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid request" });
    }
    let {
      travelsName,
      ownerName,
      state,
      district,
      pinCode,
      busNo,
      source,
      destination,
      seatsAvailable,
      boardingTime,
      droppingTime,
      busType,
      price,
      date,
    } = req.body;

    let data = {};

    if (!isValidString(travelsName)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid travels Name" });
    }
    data.travelsName = travelsName;

    if (!isValidString(ownerName)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid owner name" });
    }
    data.ownerName = ownerName;

    if (!isValidString(state)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid state" });
    }

    data.state = state;

    if (!isValidString(district)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid district" });
    }

    data.district = district;

    if (!isValidPinCode(pinCode)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid pincode" });
    }

    data.pinCode = pinCode;

    if (!isValidBusNo(busNo)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid bus no" });
    }

    const isDuplicateBusNo = await busModel.findOne({ busNo: busNo });

    if (isDuplicateBusNo)
      return res
        .status(409)
        .send({ status: false, message: "This bus is already registered" });

    data.busNo = busNo;

    if (!isValidString(source)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid source" });
    }

    data.source = source;

    if (!isValidString(destination)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid destination" });
    }

    data.destination = destination;

    if (!isValidInteger(seatsAvailable)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid number" });
    }

    data.seatsAvailable = seatsAvailable;

    data.boardingTime = boardingTime;

    if (!isValidString(droppingTime)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid dropping time" });
    }

    data.droppingTime = droppingTime;

    busType = busType.toUpperCase().trim();

    if (!isValidBusType(busType)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid bus type" });
    }

    data.busType = busType;

    if (!isValidInteger(price)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid price" });
    }

    data.price = price;

    if (date.length != 2)
      return res.status(400).send({
        status: false,
        message: "Only start and end date is required",
      });

    if (!isValidInteger(date[0]) || !isValidInteger(date[1]))
      return res
        .status(400)
        .send({ status: false, message: "Enter valid date" });

    if (date[0] < 1 || date[0] > 30 || date[1] < 1 || date[1] > 30)
      return res
        .status(400)
        .send({ status: false, message: "Date should be in between 1 to 30" });

    data.date = date;

    const bus = await busModel.create(data);
    return res.status(201).send({
      status: false,
      message: "Bus registered successfully",
      data: bus,
    });
  } catch (err) {
    return res.status(500).send({ status: true, Error: err.message });
  }
};

// ===============================================GET BUS BY QUERY PARAMS =======================================================

const getBusByQuery = async function (req, res) {
  try {
    if (!isValidRequest(req.query)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid request" });
    }

    let {
      source,
      destination,
      date,
      boardingTime,
      droppingTime,
      busType,
      seatsAvailable,
    } = req.query;

    let filter = {};

    if (!isValidString(source)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid source" });
    }

    filter.source = source;

    if (!isValidString(destination)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid destination" });
    }

    filter.destination = destination;

    if (date < 1 || date > 30)
      return res
        .status(400)
        .send({ status: false, message: "Date should be in between 1 to 30" });

    if (boardingTime) {
      if (!isValidString(boardingTime)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid boarding time" });
      }
      filter.boardingTime = boardingTime;
    }

    if (droppingTime) {
      if (!isValidString(droppingTime)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid dropping time" });
      }
      filter.droppingTime = droppingTime;
    }

    if (busType) {
      if (!isValidBusType(busType)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid bus type" });
      }
      filter.busType = busType;
    }

    if (seatsAvailable) {
      if (!isValidInteger(seatsAvailable)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid seat" });
      }

      filter.seatsAvailable = { $gte: seatsAvailable };
    }

    const isDate = await busModel.find(filter);

    if (isDate.length == 0) {
      return res
        .status(404)
        .send({ status: false, message: "No bus available" });
    }

    for (i = 0; i < isDate.length; i++) {
      if (date < isDate[i].date[0] || date > isDate[i].date[1]) {
        isDate.splice(i, 1);
      }
    }
    console.log(isDate);
    if (isDate.length == 0) {
      return res
        .status(404)
        .send({ status: false, message: "No bus available in this date" });
    }
    return res
      .status(200)
      .send({ status: true, message: "Bus found successfully", data: isDate });
  } catch (err) {
    return res.status(500).send({ status: false, Error: err.message });
  }
};
module.exports = { createBus, getBusByQuery };
