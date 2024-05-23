import nodemailer from "nodemailer";
import twilio from "twilio";
import dotenv from "dotenv";

// Twilio credentials
dotenv.config();
const accountSid = process.env.accountSid
const authToken = process.env.authToken
const client = twilio(accountSid, authToken);

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "this.sag0418@gmail.com",
      pass: process.env.nodemailer_password 
    },
  });

// Function to send OTP via email
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: "this.sag0418@gmail.com",
    to: email,
    subject: "Your OTP from nullclass",
    text: `Your OTP is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

// Function to send OTP via SMS
const sendOtpSms = async (phoneNumber, otp) => {
  const formattedPhoneNumber = `+91${phoneNumber}`;
  try {
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: "+13132543916", 
      to: formattedPhoneNumber,
    });
    console.log("OTP SMS sent successfully");
  } catch (error) {
    console.error("Error sending OTP SMS:", error);
  }
};

export const frenchlang = async (req, res) => {
  const { otp, email } = req.body;

  try {
    await sendOtpEmail(email, otp);
    res.status(200).json({ message: "OTP sent to email successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP to email", error });
  }
};

export const notfrenchlang = async (req, res) => {
  const { otp, phoneNumber, language } = req.body;

  try {
    await sendOtpSms(phoneNumber, otp);
    res.status(200).json({ message: "OTP sent to phone successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP to phone", error });
  }
};
