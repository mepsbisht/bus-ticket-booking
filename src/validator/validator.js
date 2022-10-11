const { default: mongoose } = require("mongoose");

const isValidRequest = function (data) {
  if (Object.keys(data).length == 0) {
    return false;
  }
  return true;
};

const isValidString = function (value) {
  if (!value) return false;
  if (typeof value === "undefined" || value === null) return false;
  if (value.length === 0) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  else if (typeof value === "string") return true;
};

const isValidPinCode = function (value) {
  if (!value) return false;
  let format = /^[1-9][0-9]{5}$/;
  return format.test(value);
};

// regex for( MP 09 AB 1234)

const isValidBusNo = function (value) {
  if (!value) return false;
  let format = /^[A-Z]{2}\s[0-9]{2}\s[A-Z]{2}\s[0-9]{4}$/;
  return format.test(value);
};

const isValidInteger = function (value) {
  if (!value) return false;
  if (!Number.isInteger(value)) return false;
  return true;
};

const isValidBusType = function (value) {
  let arr = ["SLEEPER", "AC", "CC", "NONAC"];
  if (!arr.includes(value)) return false;
  return true;
};

const isValidMail = function (email) {
  if (!email) return false;
  return /^([0-9a-z]([-_\\.]*[0-9a-z]+)*)@([a-z]([-_\\.]*[a-z]+)*)[\\.]([a-z]{2,9})+$/.test(
    email
  );
};

const isValidPhone = function (phone) {
  if (!phone) return false;
  return /^((\+91(-| )+)|0)?[6-9][0-9]{9}$/.test(phone);
};

const isValidPassword = function (pass) {
  if (!pass) return false;
  return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(pass);
};

const isValidId = function (value) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return false;
  }
  return true;
};

module.exports = {
  isValidRequest,
  isValidString,
  isValidPinCode,
  isValidBusNo,
  isValidInteger,
  isValidBusType,
  isValidMail,
  isValidPhone,
  isValidPassword,
  isValidId
};
