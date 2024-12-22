import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import refreshAccessToken from "./RefreshToken";
import {
  FetchClientDetails,
  FetchProductDetails,
} from "../components/FetchDetails";
// database field update by comparing the past orderdetails with the current order details

// test passed
const ProductPage = () => {
  const navigate = useNavigate();

  const token = Cookies.get("clientToken");
  const [productInfo, setProductInfo] = useState([]);
  const [clientInfo, setClientInfo] = useState({}); // as an object

  const [productId, setProductId] = useState("");
  const [productQuantity, setProductQuantity] = useState("");

  const [orderConfirmation, setOrderConfirmation] = useState(false);

  const [loading, setLoading] = useState(false);

  const fetch_clientDetails_productDetails = async () => {
    try {
      const response_clientDetails = await FetchClientDetails();
      const response_productDetails = await FetchProductDetails();

      setClientInfo(response_clientDetails.clientDetails);
      setProductInfo(response_productDetails.productDetails);
    } catch (error) {
      console.error(error);
      if (error.response_clientDetails) {
        console.log(error.response_clientDetails.message);
      } else {
        console.log(error.response_productDetails.message);
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetch_clientDetails_productDetails();
    }
  }, []);

  // need testing
  const addToCart = async (e, productId) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API1}/cart/add/${productId}`,
        {}, //empty body
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.log(error);
      if (error.response.data.message == "Invalid token - backend") {
        const newToken = await refreshAccessToken(navigate);
        if (newToken) {
          return addToCart(e, productId);
        }
      } else {
        alert(error.response.data.message);
      }
      // console.log(error);
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/orders`;
    const orderDetails = {
      orderDetails: {
        productId,
        productQuantity,
      },
    };

    try {
      const response = await axios.post(URL, orderDetails, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      alert(response.data.message);
      setOrderConfirmation(false);
    } catch (error) {
      console.log("Error placing order:", error);
      if (error.response) alert(error.response.data.message);
    } finally {
      setLoading(false);
      setOrderQuantity("");
    }
  };

  return (
    <>
      <div
        className="w-full bg-blue-600 p-2 text-center"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        Back
      </div>
      <div className="p-5 flex justify-between">
        <div className="flex gap-2">
          <button
            className="border border-red-700 p-2 bg-blue-300"
            onClick={() => {
              if (!token) {
                alert("You need to signin first! - warning!");
                navigate("/user/signIn");
                return;
              }
              navigate("/user/products/cart");
            }}
          >
            Your cart
          </button>
          <button
            className="border border-red-500 p-2 bg-gray-300"
            onClick={() => {
              if (!token) {
                alert("You haven't login yet! - warning");
                navigate("/user/signIn");
                return;
              }
              navigate("/user/orders");
            }}
          >
            Your orders
          </button>
        </div>
        {!token && (
          <>
            <div className="flex gap-2">
              <button
                className="border border-red-700 p-2 bg-gray-300"
                onClick={() => navigate("/user/signin")}
              >
                Login
              </button>
              <button
                className="border border-red-700 p-2 bg-blue-300"
                onClick={() => navigate("/user/signup")}
              >
                Register
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-wrap w-[100%] justify-center gap-3">
        {productInfo.map((item) => (
          <div
            key={item._id}
            className="flex flex-col mt-5 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 text-center items-center p-2 border rounded-lg shadow-lg transition-transform transform hover:scale-105 "
          >
            <img
              src="https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg"
              alt={item.productName}
              className="w-4/5 rounded-lg mb-2"
              loading="lazy"
            />
            <h1 className="text-xl font-semibold">{item.productName}</h1>
            <p className="text-gray-700">₹{item.productPrice}</p>
            <p className="text-sm text-gray-500">
              Product quantity: {item.productQuantity}
            </p>
            <div className="flex gap-2">
              <button
                className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                onClick={() => {
                  setProductId(item._id);
                  if (!token) {
                    alert("Please login first to place order");
                    navigate("/signIn");
                    setProductId("");
                    return;
                  }
                  setOrderConfirmation(true);
                }}
              >
                Order
              </button>
              <button
                className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                onClick={(e) => {
                  addToCart(e, item._id);
                  if (!token) {
                    alert("Please login first to add products in cart");
                    navigate("/signin");
                    return;
                  }
                }}
              >
                add to cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {orderConfirmation && (
        <div className="w-full flex justify-center mt-20 gap-2 ">
          <input
            placeholder="Please enter the quantity of the product you want to purchase"
            className="border border-red-800"
            onChange={(e) => setProductQuantity(e.target.value)}
            value={productQuantity}
          ></input>
          <button
            className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
            onClick={(e) => placeOrder(e)}
          >
            Order
          </button>
          <button
            className="border mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
            onClick={() => setOrderConfirmation(false)}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default ProductPage;
