import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// test passed
export const ClientVerification = () => {
  const navigate = useNavigate();
  const [OTP, setOTP] = useState("");
  const [loading, setLoading] = useState(false);

  const confirmOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API1}/signup/verify`,
        { otp: OTP },
        { headers: { "Content-Type": "application/json" } }
      );
      setLoading(false);
      setOTP("");
      Cookies.set("clientToken", response.data.token); // this contains the name of the client
      Cookies.set("clientRefreshToken", response.data.token); // this contains the name of the client
      navigate("/"); // navigate to index page after the verification is completed
      console.log(response.data.message);
    } catch (error) {
      console.log(error);
      setOTP(""); // remove the old value
      if (error.response) {
        navigate("/user/signUp");
      }

      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <input
          type="text"
          placeholder="Enter your OTP here..."
          value={OTP}
          onChange={(e) => setOTP(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={confirmOTP}
        >
          {loading ? "confirming..." : "confirm OTP"}
        </button>
      </div>
    </div>
  );
};
