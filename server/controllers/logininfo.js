import mongoose from "mongoose";
import LoginHistory from "../models/logininfo.js"; 

export const saveLoginInfo = async (req, res) => {
  const { email, browser, os, deviceType, ipAddress } = req.body;

  if (!email || !browser || !os || !deviceType || !ipAddress) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const loginInfo = new LoginHistory({
      email,
      browser,
      os,
      deviceType,
      ipAddress,
      timestamp: new Date(),
    });

    await loginInfo.save();
    res.status(201).json({ message: "Login info stored successfully" });
  } catch (error) {
    console.error("Error storing login info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
