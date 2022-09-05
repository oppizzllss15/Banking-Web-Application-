const validator = require("validator");
import bcrypt from "bcryptjs";
import Users from "mongoose";

const userData = new Users.Schema(
  {
    firstname: {
      type: String,
      required: [true, "please enter your firstname"],
    },
    lastname: {
      type: String,
      required: [true, "please enter your lastname"],
    },
    username: {
      type: String,
      required: [true, "please enter a username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "please enter your email"],
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
      unique: true,
    },
    phonenumber: {
      type: Number,
      required: [true, "please enter your phone number"],
      unique: true,
    },
    "Date of Birth": {
      type: Date,
      required: [true, "please enter your date of birth"],
    },
    address: {
      type: String,
      required: [true, "please enter your address"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "please select a gender"],
    },
    user_status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    password: {
      type: String,
      required: [true, "please enter a password"],
    },
    "confirm password": {
      type: String,
      required: true,
    },
    passwordChanged: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// document middleware pre hook to hash password
userData.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this["confirm password"] = undefined;
  next();
});

// instance method to compare passwords
userData.methods.checkPassword = async function (
  enteredPasswored: string,
  storedPassword: string
) {
  return await bcrypt.compare(enteredPasswored, storedPassword);
};

// instance method checking if password changed time stamps
userData.methods.changedPassword = function (JWTTimestamp: number) {
  if (this.passwordChanged) {
    const initialTS = Number(this.passwordChanged.getTime());

    const changedTimestamp = initialTS / 1000;

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = Users.model("Users", userData);

export default User;
