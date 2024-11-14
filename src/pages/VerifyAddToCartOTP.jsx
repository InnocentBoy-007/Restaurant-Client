import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// test passed
export const VerifyAddToCartOTP = () => {
  const navigate = useNavigate();
  const [OTP, setOTP] = useState("");
  const [loading, setLoading] = useState(false);

  const otp = {
    otp: OTP,
  };

  const confirmOTP = async (e) => {
    e.preventDefault();
    console.log("OTP-->", otp);
    setLoading(true);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_API1}/addToCart`,
        otp,
        { headers: { "Content-Type": "application/json" } }
      );
      Cookies.set("clientToken", response.data.token, { expires: 1 });
      console.log(response.data.token);

      navigate("/products");
      console.log(response.data.message);
    } catch (error) {
      console.log(error);
    } finally {
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
