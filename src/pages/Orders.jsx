import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// add cancel order later
export default function Orders() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [trackedOrders, setTrackedOrders] = useState([]);

  const token = Cookies.get("clientToken");

  const trackOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API1}/user/orders`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setTrackedOrders(response.data.orderDetails);
      console.log(response.data.orderDetails);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
        return;
      }
    }
  };

  useEffect(() => {
    trackOrders();
  }, []);

  const orderReceivedConfirmation = async (e, orderId) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API1}/user/order/confirm/${orderId}`,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="w-full p-4 bg-blue-400 text-center cursor-pointer"
        onClick={() => navigate("/products")}
      >
        Back
      </div>
      {trackedOrders.length === 0 ? (
        <>
          <h1>You haven't place any orders yet</h1>
          <button
            className="border border-red-700 p-2 bg-blue-300 ml-2 cursor-pointer"
            onClick={() => navigate("/products")}
          >
            Place an order
          </button>
        </>
      ) : (
        <div>
          <h1>Your orders</h1>
          <table className="w-full text-center">
            <thead>
              <tr>
                <th>Sl no</th>
                <th>Order ID</th>
                <th>Ordered by</th>
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
                  <td>{item.clientName}</td>
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
