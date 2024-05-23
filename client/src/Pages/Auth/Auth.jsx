import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { detect } from "detect-browser";

import icon from "../../assets/icon.png"; // Ensure the path to the icon is correct
import AboutAuth from "./AboutAuth";
import { signup, login } from "../../actions/auth";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [actutalOTP, setactualOTP] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSwitch = () => {
    setIsSignup(!isSignup);
    setName("");
    setEmail("");
    setPassword("");
    setPhoneNumber("");
  };

  const handleLogin = async (email, password) => {
    if (email) {
      saveLoginInfo(email);
    }
  };

  const saveLoginInfo = async (email) => {
    const browser = detect();
    const deviceType = /Mobi|Android/i.test(navigator.userAgent)
      ? "Mobile"
      : "Desktop";

    // Get the user's IP address
    const ipAddressResponse = await axios.get(
      "https://api.ipify.org?format=json"
    );
    const ipAddress = ipAddressResponse.data.ip;

    const loginInfo = {
      email: email,
      browser: browser.name,
      os: browser.os,
      deviceType: deviceType,
      ipAddress: ipAddress,
    };

    if (browser.name === "chrome") {
      alert(
        "you logging from google chrome so we send a otp to your mail so enter it in the below box to continue in the app"
      );
      setShowOtpInput(true);
      const randomotp = Math.floor(100000 + Math.random() * 900000);
      setactualOTP(randomotp);
      const url = "http://localhost:5000/langchange/fr";
      const payload = {
        otp: randomotp,
        email: email,
      };

      try {
        await axios.post(url, payload);
        console.log("OTP sent successfully to email");
        setShowOtpInput(true);
      } catch (error) {
        console.error("Error sending OTP to email:", error);
      }
    }

    try {
      await axios.post(
        "http://localhost:5000/loginhistory/saveinfo",
        loginInfo
      );
      console.log("Login info saved successfully");
    } catch (error) {
      console.error("Error saving login info:", error);
    }
  };

  const handleOtpSubmit = () => {
    if (otp == actutalOTP) {
      alert("Your Otp is Correct You have logged from google chrome");
      dispatch(login({ email, password }, navigate));
      setShowOtpInput(false);
    } else {
      alert("Invalid OTP you cant Continue to the app");
    }
    setOtp("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email && !password) {
      alert("Enter email and password");
      return;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const deviceType = /Mobi|Android/i.test(navigator.userAgent)
      ? "Mobile"
      : "Desktop";

    if (
      deviceType === "Mobile" &&
      (currentHour < 10 ||
        currentHour > 13 ||
        (currentHour === 13 && currentMinute > 0))
    ) {
      alert(
        "Website access is restricted for mobile devices between 10 AM and 1 PM. Please try again later."
      );
      return;
    }

    if (isSignup) {
      if (!name) {
        alert("Enter a name to continue");
        return;
      }
      if (!phoneNumber) {
        alert("Enter a phone number to continue");
        return;
      }
      dispatch(signup({ name, email, phoneNumber, password }, navigate));
    } else {
      handleLogin(email, password);
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center bg-gray-200">
      {isSignup && <AboutAuth />}
      <div className="flex flex-col items-center w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
        <img src={icon} alt="stack overflow" className="p-5" />
        <form
          onSubmit={handleSubmit}
          className="w-full p-3 flex flex-col space-y-4"
        >
          {isSignup && (
            <label htmlFor="name" className="flex flex-col">
              <h4 className="mb-2">Display Name</h4>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 border rounded"
              />
            </label>
          )}
          <label htmlFor="email" className="flex flex-col">
            <h4 className="mb-2">Email</h4>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded"
            />
          </label>
          {isSignup && (
            <label htmlFor="phoneNumber" className="flex flex-col">
              <h4 className="mb-2">Phone Number</h4>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="p-2 border rounded"
              />
            </label>
          )}
          <label htmlFor="password" className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h4>Password</h4>
              {!isSignup && (
                <Link to="/forgot-password" className="text-blue-500">
                  Forgot Password
                </Link>
              )}
            </div>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded"
            />
          </label>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isSignup ? "Sign up" : "Log in"}
          </button>
        </form>
        <p className="mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button
            type="button"
            className="text-blue-500 ml-1"
            onClick={handleSwitch}
          >
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </p>
        {showOtpInput && (
          <div className="flex justify-center items-center space-x-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleOtpSubmit}
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              Submit OTP
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Auth;
