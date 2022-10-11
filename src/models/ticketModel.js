const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const ticketSchema = new mongoose.Schema(
  {
    passengerName: {
      type: String,
      required: true,
    },
    userId: {
      type: objectId,
      ref: "user",
      required: true,
    },
    busId: {
      type: objectId,
      ref: "bus",
      required: true,
    },
    seat: {
      type: [String],
      required: true,
    },
    price:{
      type: Number,
      required: true,
    },
    date:{
      type:Number,
      required:true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ticket", ticketSchema);
