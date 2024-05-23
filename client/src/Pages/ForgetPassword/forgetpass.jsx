import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [contactMethod, setContactMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset any previous error

    try {
      let response;
      if (contactMethod === "email") {
        console.log("Sending email:", email);
        response = await axios.post("http://localhost:5000/user/forgot-password", { email });
      } else if (contactMethod === "phone") {
        console.log("Sending SMS to:", phoneNumber);
        response = await axios.post("http://localhost:5000/user/forgot-password-phone", { phoneNumber });
      }

      console.log("Response:", response.data);
      if (response.data.Status === "Success") {
        navigate("/Auth");
      } else {
        setError(response.data.Status); // Display error status
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to send reset password request.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
        <h4 className="text-2xl mb-6 text-center text-black">Forgot Password</h4>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="contactMethod" className="font-bold mb-1 block">
              Contact Method
            </label>
            <select
              id="contactMethod"
              className="border border-gray-300 p-2 w-full rounded focus:border-blue-500"
              value={contactMethod}
              onChange={(e) => setContactMethod(e.target.value)}
              required
            >
              <option value="email">Email</option>
              <option value="phone">Phone Number</option>
            </select>
          </div>
          {contactMethod === "email" ? (
            <div className="mb-4">
              <label htmlFor="email" className="font-bold mb-1 block">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                autoComplete="off"
                name="email"
                className="border border-gray-300 p-2 w-full rounded focus:border-blue-500"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="font-bold mb-1 block">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter Phone Number"
                autoComplete="off"
                name="phoneNumber"
                className="border border-gray-300 p-2 w-full rounded focus:border-blue-500"
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          )}
          <button type="submit" className="bg-blue-600 text-white py-2 w-full rounded hover:bg-blue-700 transition duration-300">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
