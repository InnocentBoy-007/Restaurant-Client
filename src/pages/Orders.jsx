import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import fetchDetails from "../components/FetchDetails";
import services from "../components/services";

// add cancel order later
export default function Orders() {
  const navigate = useNavigate();

  const [trackedOrders, setTrackedOrders] = useState([]);
  const [noOrdersMessage, setNoOrdersMessage] = useState("");
  const [screenLoading, setScreenLoading] = useState("");

  const token = Cookies.get("clientToken");
  //   const refreshToken = Cookies.get("clientRefreshToken"); // add later

  const [clientDetails, setClientDetails] = useState({});

  const getClientDetails = async () => {
    if (token) {
      const response = await fetchDetails.FetchClientDetails(token);
      setClientDetails(response.clientDetails);
    } else {
      alert("Invalid token!");
    }
  };

  const trackOrders = async () => {
    setScreenLoading(true);
    if (token) {
      const response = await fetchDetails.TrackOrderDetails(token);
      if (response.success) {
        setTrackedOrders(response.orderDetails);
        setScreenLoading(false);
      } else if (response.message) {
        setNoOrdersMessage(response.message);
        setScreenLoading(false);
      }
    } else {
      alert("Invalid token!");
      setScreenLoading(false);
    }
  };

  useEffect(() => {
    getClientDetails();
    trackOrders();
  }, [token]);

  const orderReceivedConfirmation = async (e, orderId) => {
    e.preventDefault();

    const response = await services.OrderReceivedConfirmation(orderId, token);
    if (response) {
      await trackOrders();
    };
  };

  return (
    <div>
      <div
        className="w-full p-4 bg-blue-400 text-center cursor-pointer"
        onClick={() => navigate("/user/products")}
      >
        Back
      </div>
      {screenLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          <h2>Loading</h2>
        </div>
      ) : (
        <>
          <div>
            <h1 className="p-2">{clientDetails.name}</h1>
          </div>
          {noOrdersMessage ? (
            <>
              <h1>{noOrdersMessage}</h1>
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
                      <td>{item.status}</td>
                      <td>{item.receivedByClient ? "Yes" : "No"}</td>
                      {item.status == "accepted" && (
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
        </>
      )}
    </div>
  );
}
