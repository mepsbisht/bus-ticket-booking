const jwt = require("jsonwebtoken");
const { isValidId } = require("../validator/validator");
const userModel = require("../models/userModel");

const authentication = async function (req, res, next) {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .send({ status: false, message: "Token must b present" });
    }
    let bearer = token.split(" ");
    token = bearer[1];

    let decoded = jwt.verify(token, "pass@123", function (err, decoded) {
      if (err) {
        return res.status(401).send({ status: false, message: err.message });
      } else {
        req.token = decoded;
        next();
      }
    });
  } catch (err) {
    return res.status(500).send({ status: false, Error: err.message });
  }
};

const authorization = async function (req, res, next) {
  try {
    let userId = req.params.userId;
    let userLoggedin = req.token.userId;

    if (!isValidId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid format of userId" });
    }

    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .send({ status: false, message: "No such user found" });
    }

    if (userLoggedin != userId) {
      return res.status(403).send({
        status: false,
        message: "You are not authorized to perform this task",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).send({ status: false, Error: err.message });
  }
};

module.exports = { authentication, authorization };
