import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function BackupJWT() {
  const token = Cookies.get("clientRefreshToken");
  const decodedToken = jwtDecode(token);
  const clientId = decodedToken.clientDetails._id;

  const generateBackupJWT = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API1}/user/refresh-token/${clientId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      console.log("backup token --->", response.data);
      // console.log(response.data.message);
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log(error.response.data.message);
      }
    }
  };
  return (
    <div>
      <button className="border border-red-400 p-2" onClick={generateBackupJWT}>
        Generate backup jwt
      </button>
    </div>
  );
}
