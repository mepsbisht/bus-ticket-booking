const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    travelsName: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    pinCode: {
      type: Number,
      required: true,
    },
    busNo: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      unique: true,
    },
    source: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    seatsAvailable: {
      type: Number,
      required: true,
    },
    boardingTime: {
      type: String,
      required: true,
    },
    droppingTime: {
      type: String,
      required: true,
    },
    busType: {
      type:String,
      enum: ["SLEEPER", "AC", "CC", "NONAC"],
      required:true
    },
    price: {
      type: Number,
      required: true,
    },
    date: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bus", busSchema);
