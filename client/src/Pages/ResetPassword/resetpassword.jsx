import React, { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id, token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset any previous error
    console.log("resetting password for:", id, token);

    try {
      const response = await axios.post(`http://localhost:5000/user/reset-password/${id}/${token}`, { password });
      console.log("Response:", response.data);
      if (response.data.Status === "Success") {
        navigate('/Auth');
      } else {
        setError(response.data.Status); // Display error status
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to reset password.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
        <h4 className="text-2xl mb-6 text-center text-black">Reset Password</h4>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="font-bold mb-1 block">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter New Password"
              autoComplete="off"
              name="password"
              className="border border-gray-300 p-2 w-full rounded focus:border-blue-500"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 w-full rounded hover:bg-blue-700 transition duration-300">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
