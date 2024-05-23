import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import users from "../models/auth.js";
import twilio from "twilio";

// Twilio credentials
dotenv.config();
const accountSid = process.env.accountSid
const authToken = process.env.authToken
const client = twilio(accountSid, authToken);

export const signup = async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;
  try {
    const existinguser = await users.findOne({ email });
    if (existinguser) {
      return res.status(404).json({ message: "User already Exist." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await users.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: newUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went worng...");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existinguser = await users.findOne({ email });
    if (!existinguser) {
      return res.status(404).json({ message: "User don't Exist." });
    }
    const isPasswordCrt = await bcrypt.compare(password, existinguser.password);
    if (!isPasswordCrt) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: existinguser.email, id: existinguser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: existinguser, token });
  } catch (error) {
    res.status(500).json("Something went worng...");
  }
};

export const forgetpass = async (req, res) => {
  const { email } = req.body;
  users.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.send({ Status: "User not existed" });
    }
    const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
      expiresIn: "1d",
    });
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "this.sag0418@gmail.com",
        pass: process.env.nodemailer_password 
      },
    });

    var mailOptions = {
      from: "this.sag0418@gmail.com",
      to: email,
      subject: "Reset Password Link",
      text: `http://localhost:3000/reset_password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.send({ Status: "Success" });
      }
    });
  });
};

export const resetpassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.json({ Status: "Error with token" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          users
            .findByIdAndUpdate({ _id: id }, { password: hash })
            .then((u) => res.send({ Status: "Success" }))
            .catch((err) => res.send({ Status: err }));
        })
        .catch((err) => res.send({ Status: err }));
    }
  });
};

export const forgetpassphone = async (req, res) => {
  const { phoneNumber } = req.body;
  const formattedPhoneNumber = `+91${phoneNumber}`;

  users
    .findOne({ phoneNumber: phoneNumber })
    .then((user) => {
      if (!user) {
        return res.send({ Status: "User not existed" });
      }
      const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
        expiresIn: "1d",
      });

      const message = `http://localhost:3000/reset_password/${user._id}/${token}`;

      client.messages
        .create({
          body: `Reset Password Link: ${message}`,
          from: "+13132543916",
          to: formattedPhoneNumber,
        })
        .then((message) => {
          res.send({ Status: "Success" });
        })
        .catch((error) => {
          console.log(error);
          res.send({ Status: "Failed to send SMS" });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ Status: "Error finding user" });
    });
};
