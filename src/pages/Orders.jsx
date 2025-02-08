import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import fetchDetails from "../components/FetchDetails";
import services from "../components/services";
import { isTokenExpired } from "../components/isTokenExpired";
import { RefreshToken } from "../components/RefreshToken";

// add cancel order later
export default function Orders() {
  const navigate = useNavigate();

  const [token, setToken] = useState(Cookies.get("clientToken"));
  const refreshToken = Cookies.get("clientRefreshToken");

  const [trackedOrders, setTrackedOrders] = useState([]);
  const [noOrdersMessage, setNoOrdersMessage] = useState("");
  const [cancelOrderFlag, setCancelOrderFlag] = useState(false);
  const [screenLoading, setScreenLoading] = useState("");

  const [clientDetails, setClientDetails] = useState({});

  useEffect(() => {
    if (!Cookies.get("clientToken")) {
      alert("You need to login first!");
      navigate("/");
    } else {
      getClientDetails();
      trackOrders();
      getClientDetails();
      trackOrders();
    }
  }, [token]);

  const checkToken = async () => {
    if (refreshToken && isTokenExpired(token)) {
      const newToken = await RefreshToken(refreshToken);
      Cookies.set("clientToken", newToken.token);
      setToken(newToken.token);
    }
  };

  const getClientDetails = async () => {
    await checkToken();
    if (token) {
      const response = await fetchDetails.FetchClientDetails(token);
      setClientDetails(response.clientDetails);
    }
  };

  const trackOrders = async () => {
    await checkToken();
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
      setScreenLoading(false);
    }
  };

  const orderReceivedConfirmation = async (e, orderId) => {
    e.preventDefault();
    setScreenLoading(true);
    await checkToken();

    if (token) {
      await services.OrderReceivedConfirmation(orderId, token);
      setScreenLoading(false);
      await trackOrders();
    }
  };

  const cancelOrder = async (e, orderId) => {
    e.preventDefault;
    setScreenLoading(true);
    await checkToken();

    if (token) {
      await services.CancelOrder(orderId, token);
      await trackOrders();
      setCancelOrderFlag(false);
      setScreenLoading(false);
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
                      {item.status == "accepted" ? (
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
                      ) : (
                        <>
                          {cancelOrderFlag ? (
                            <div className="flex justify-center gap-2">
                              <button
                                className="w-32 bg-red-800 text-white font-semibold py-2 rounded-md hover:bg-red-600 transition duration-200"
                                onClick={(e) => cancelOrder(e, item._id)}
                              >
                                Yes
                              </button>
                              <button
                                className="w-32 bg-green-800 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition duration-200"
                                onClick={() => setCancelOrderFlag(false)}
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                className="p-1 border border-red-600"
                                onClick={() => setCancelOrderFlag(true)}
                              >
                                Cancel Order
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
