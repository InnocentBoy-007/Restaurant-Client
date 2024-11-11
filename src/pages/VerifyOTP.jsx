import React, { useState } from "react";
import axios from "axios";

// test passed
export const VerifyOTP = () => {
  const [OTP, setOTP] = useState("");
  const [loading, setLoading] = useState(false);

    const otp = {
        otp:{
            OTP:OTP
        }
    }

  const confirmOTP = async (e) => {
    e.preventDefault();
    console.log("OTP-->", otp);

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/otpverify`,
        otp,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(response.data.message);
      setLoading(false);
    } catch (error) {
      console.log(error);
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
          {loading ? 'confirming...': 'confirm OTP'}
        </button>
      </div>
    </div>
  );
};
