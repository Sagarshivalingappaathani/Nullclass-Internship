import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import decode from "jwt-decode";
import { setCurrentUser } from "../../actions/currentUser";
import axios from "axios";

const TranslateComponent = () => {
  const googleTranslateRef = useRef(null);
  const dispatch = useDispatch();
  var User = useSelector((state) => state.currentUserReducer);

  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [actutalOTP, setactualOTP] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  useEffect(() => {
    const token = User?.token;
    if (token) {
      const decodedToken = decode(token);
    }
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
  }, [User?.token, dispatch]);

  useEffect(() => {
    let intervalId = null;

    const checkGoogleTranslate = () => {
      if (
        window.google &&
        window.google.translate &&
        window.google.translate.TranslateElement.InlineLayout
      ) {
        clearInterval(intervalId);
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "es,hi,pt,zh-CN,fr,en",
            layout:
              window.google.translate.TranslateElement.InlineLayout.VERTICAL,
          },
          googleTranslateRef.current
        );
        addLanguageChangeListener();
      }
    };

    const addLanguageChangeListener = () => {
      const selectElement = document.querySelector(".goog-te-combo");
      if (selectElement) {
        selectElement.addEventListener("change", handleLanguageChange);
      }
    };

    const handleLanguageChange = () => {
      const selectElement = document.querySelector(".goog-te-combo");
      const language = selectElement.value;
      setSelectedLanguage(language);
      generateAndSendOtp(language);
    };

    const generateAndSendOtp = async (language) => {
      const randomotp = Math.floor(100000 + Math.random() * 900000);
      setactualOTP(randomotp);
      const user = JSON.parse(localStorage.getItem("Profile")).result;
      if (language === "fr") {
        const url = "http://localhost:5000/langchange/fr";
        const payload = {
          otp: randomotp,
          email: user?.email,
          language,
        };

        try {
          await axios.post(url, payload);
          console.log("OTP sent successfully to email");
          setShowOtpInput(true);
        } catch (error) {
          console.error("Error sending OTP to email:", error);
        }
      } else {
        const url = "http://localhost:5000/langchange/not-fr";
        const payload = {
          otp: randomotp,
          phoneNumber: user?.phoneNumber,
          language,
        };

        try {
          await axios.post(url, payload);
          console.log("OTP sent successfully to phone");
          setShowOtpInput(true);
        } catch (error) {
          console.error("Error sending OTP to phone:", error);
        }
      }

      setShowOtpInput(true);
    };

    intervalId = setInterval(checkGoogleTranslate, 100);
    return () => {
      clearInterval(intervalId);
      const selectElement = document.querySelector(".goog-te-combo");
      if (selectElement) {
        selectElement.removeEventListener("change", handleLanguageChange);
      }
    };
  }, []);

  const handleOtpSubmit = () => {
    if (otp == actutalOTP) {
      alert("Your Otp is Correct now your background will change");
      changeLanguage(selectedLanguage);
      setShowOtpInput(false);
    } else {
      alert("Invalid OTP you cant change the background");
    }
    setOtp("");
  };

  const changeLanguage = (language) => {
    switch (language) {
      case "hi":
        document.body.style.backgroundColor = "blue";
        break;
      case "zh-CN":
        document.body.style.backgroundColor = "green";
        break;
      case "fr":
        document.body.style.backgroundColor = "yellow";
        break;
      default:
        document.body.style.backgroundColor = "white";
        break;
    }
  };

  return (
    <div className="translate-container">
      <div ref={googleTranslateRef}></div>
      {showOtpInput && (
        <div className="otp-input">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button onClick={handleOtpSubmit}>Submit OTP</button>
        </div>
      )}
    </div>
  );
};

export default TranslateComponent;
