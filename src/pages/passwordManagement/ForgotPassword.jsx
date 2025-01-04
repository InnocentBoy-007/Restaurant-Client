import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import generateNewPassword from "./ForgetPassword";
import Cookies from "js-cookie";

export default function forgotPassword() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSessionFlag, setOtpSessionFlag] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const token = Cookies.get("clientToken");
  //   const refreshToken = Cookies.get("clientRefreshToken"); // add the refresh token later

  // function to verify otp
  const verifyOTP = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const body = {
      otp,
    };

    try {
      await generateNewPassword.verifyOTP(body, token);
      setSubmitLoading(false);
      setOtpSessionFlag(false);
    } catch (error) {
      Cookies.remove("clientToken");
      Cookies.remove("clientRefreshToken");
      setSubmitLoading(false);
      setOtpSessionFlag(false);
    }
  };

  // function to set new password
  const changeNewPassword = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const body = {
      newPassword,
    };

    try {
      await generateNewPassword.setNewPassword(body, token);
      setSubmitLoading(false);
      navigate("/user/signIn");
      Cookies.remove("clientToken");
      Cookies.remove("clientRefreshToken");
    } catch (error) {
      Cookies.remove("clientToken");
      Cookies.remove("clientRefreshToken");
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
            <form onSubmit={changeNewPassword}>
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
