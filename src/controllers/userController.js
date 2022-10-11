const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  isValidRequest,
  isValidString,
  isValidMail,
  isValidPhone,
  isValidPassword,
  isValidInteger,
} = require("../validator/validator");

const createUser = async function (req, res) {
  try {
    if (!isValidRequest(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid request" });
    }

    let { name, phone, email, password, gender, age } = req.body;

    let data = {};

    if (!isValidString(name)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid name" });
    }

    data.name = name;

    if (!isValidPhone(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid phone" });
    }

    if (!isValidMail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid email" });
    }

    if (!isValidPassword(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid passsword" });
    }

    // using bcrypt to encode the password

    const encryptPassword = await bcrypt.hash(password, 10);

    data.password = encryptPassword;

    const isDuplicate = await userModel.findOne({
      $or: [{ email: email }, { phone: phone }],
    });

    if (isDuplicate) {
      return res.status(409).send({
        status: false,
        message: "Email or phone number already exists",
      });
    }

    data.phone = phone;
    data.email = email;

    gender = gender.toUpperCase().trim();

    if (!["MALE", "FEMLE", "OTHER"].includes(gender)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid gender" });
    }

    data.gender = gender;

    if (age) {
      if (!isValidInteger(age)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid age" });
      }
      data.age = age;
    }

    const user = await userModel.create(data);

    return res.status(201).send({
      status: true,
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).send({ status: false, Error: err.message });
  }
};

// ========================================================== LOG IN API ================================================================

const login = async function (req, res) {
  try {
    if (!isValidRequest(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid request" });
    }
    const { email, password } = req.body;

    if (!isValidMail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid mail" });
    }

    if (!isValidPassword(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid password" });
    }

    const userLogin = await userModel.findOne({ email: email });

    // using bcrypt to decode and checking the password

    const decode = bcrypt.compare(password, userLogin.password);

    if (!decode) {
      return res
        .status(400)
        .send({ status: false, message: "Entered password is incorrect" });
    }

    let token = jwt.sign({ userId: userLogin._id }, "pass@123", {
      expiresIn: "24h",
    });

    return res
      .status(200)
      .send({
        status: true,
        message: "User logged in successfully",
        token: token,
      });
  } catch (err) {
    return res.status(500).send({ status: false, Error: err.message });
  }
};

module.exports = { createUser , login };
