import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// add cancel order later
export default function Orders() {
  const navigate = useNavigate();

  const [trackedOrders, setTrackedOrders] = useState([]);

  const token = Cookies.get("clientToken");
  const decodedToken = jwtDecode(token);
  const email = decodedToken.clientDetails.email;

  const trackOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API1}/user/orders/${email}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setTrackedOrders(response.data.isValidClient);
      // console.log(response.data.isValidClient);
    } catch (error) {
      console.log(error);
      if (error.response) {
        alert(error.response.data.message);
        return; // terminates the function if it catches an error to prevent unwanted outcomes
      }
    }
  };

  useEffect(() => {
    trackOrders();
  }, []);

  return (
    <div>
      <div
        className="w-full p-4 bg-blue-400 text-center"
        onClick={() => navigate("/products")}
      >
        Back
      </div>
      <h1>Your orders</h1>
    </div>
  );
}
