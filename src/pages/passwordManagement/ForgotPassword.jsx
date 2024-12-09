import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function forgotPassword() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSessionFlag, setOtpSessionFlag] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const navigate = useNavigate();

  const verifyOTP = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API1}/forgot-password/verify/otp`,
        { otp },
        { headers: { "Content-Type": "Application/json" } }
      );
      alert(response.data.message);
      setOtpSessionFlag(false);
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(error.response.data.message);
      }
    } finally {
      setOtp("");
      setSubmitLoading(false);
    }
  };

  const sentNewPassword = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API1}/forget-password/change-password`,
        { newPassword },
        { headers: { "Content-Type": "Application/json" } }
      );
      alert(response.data.message);
      navigate("/user/signIn");
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log(error.response.data.message);
      }
    } finally {
      setSubmitLoading(false);
    }
  };
  return (
    <>
      <div className="w-full p-2">
        {otpSessionFlag ? (
          <>
            <form onSubmit={verifyOTP}>
              <div className="mb-4 w-[50%] mx-auto">
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  value={otp}
                  placeholder="Enter your OTP..."
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="border border-red-600 p-1 mt-2"
                >
                  {submitLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <form onSubmit={sentNewPassword}>
              <div className="mb-4 w-[50%] mx-auto">
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={newPassword}
                  placeholder="Enter your new password.."
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="border border-red-600 p-1 mt-2"
                >
                  {submitLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}
