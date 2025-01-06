import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import fetchDetails from "../components/FetchDetails";

// add cancel order later
export default function Orders() {
  const navigate = useNavigate();

  const [trackedOrders, setTrackedOrders] = useState([]);

  const token = Cookies.get("clientToken");
  const [clientDetails, setClientDetails] = useState({});

  const getClientDetails = async () => {
    try {
      const response = await FetchClientDetails();
      setClientDetails(response.clientDetails);
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log(error.response.fetchClientDetails_error);
      }
    }
  };

  const trackOrders = async () => {
    try {
      const response = await TrackOrderDetails();
      setTrackedOrders(response.orderDetails);
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log(error.response.fetchOrderDetails_error);
      }
    }
  };

  useEffect(() => {
    if (token) {
      getClientDetails();
      trackOrders();
    }
  }, [token]);

  const orderReceivedConfirmation = async (e, orderId) => {
    e.preventDefault();
    const email = clientDetails.email;
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_API1
        }/order/confirm/${orderId}/${email}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      alert(response.data.message);
      trackOrders();
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log(error.response.data.message);
      }
    }
  };

  return (
    <div>
      <div
        className="w-full p-4 bg-blue-400 text-center cursor-pointer"
        onClick={() => navigate("/user/products")}
      >
        Back
      </div>
      <div>
        <h1 className="p-2">{clientDetails.name}</h1>
      </div>
      {trackedOrders.length === 0 ? (
        <>
          <h1>You haven't place any orders yet</h1>
          <button
            className="border border-red-700 p-2 bg-blue-300 ml-2 cursor-pointer"
            onClick={() => navigate("/user/products")}
          >
            Place an order
          </button>
        </>
      ) : (
        <div className="mt-2">
          <table className="w-full text-center">
            <thead>
              <tr>
                <th>Sl no</th>
                <th>Order ID</th>
                <th>Product Name</th>
                <th>Product Price</th>
                <th>Product Quantity</th>
                <th>Total Price</th>
                <th>Email</th>
                <th>Address</th>
                <th>Phone No</th>
                <th>Order Time</th>
                <th>Order Status</th>
                <th>Received by Client</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {trackedOrders.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item._id}</td>
                  <td>{item.productName}</td>
                  <td>{item.productPrice}</td>
                  <td>{item.productQuantity}</td>
                  <td>{item.totalPrice}</td>
                  <td>{item.email}</td>
                  <td>{item.address}</td>
                  <td>{item.phoneNo}</td>
                  <td>{item.orderTime}</td>
                  <td>{item.acceptedByAdmin}</td>
                  <td>{item.receivedByClient ? "Yes" : "No"}</td>
                  {item.acceptedByAdmin == "accepted" && (
                    <>
                      {!item.receivedByClient && (
                        <>
                          <button
                            className="border border-red-700"
                            onClick={(e) =>
                              orderReceivedConfirmation(e, item._id)
                            }
                          >
                            Received
                          </button>
                        </>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
