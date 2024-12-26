import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import refreshAccessToken from "./RefreshToken";
import {
  FetchClientDetails,
  FetchProductDetails_Cart,
} from "../components/FetchDetails";

export default function Cart() {
  const token = Cookies.get("clientToken");
  const navigate = useNavigate();

  const [clientDetails, setClientDetails] = useState({}); // object
  const [cartProducts, setCartProducts] = useState([]); // array
  const [noCartProductMessage, setNoCartProductsMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [placeOrderLoading, setPlaceOrderLoading] = useState(false);

  const [productId, setProductId] = useState("");
  const [orderQuantity, setOrderQuantity] = useState("");

  const [orderFlag, setOrderFlag] = useState(false);

  const fetchClientDetails = async () => {
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

  const fetchProductsFromCart = async () => {
    try {
      const response = await FetchProductDetails_Cart();
      setCartProducts(response);
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log(error.response.fetchProductDetails_Cart_error);
        setNoCartProductsMessage(error.response.fetchProductDetails_Cart_error);
      }
    }
  };

  useEffect(() => {
    fetchClientDetails();
    fetchProductsFromCart();
  }, []);

  // test passed
  const removeFromCart = async (e, productId) => {
    e.preventDefault();
    // console.log("ProductId -->", productId);
    // console.log("Token-->", token);

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_API1}/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      alert(response.data.message);
      fetchProductsFromCart(); // refreshing the page
    } catch (error) {
      console.log(error);
      if (error.response) alert(error.response.data.message);
    }
  };

  // function for placing order from the cart
  const placeOrder = async (e) => {
    e.preventDefault();
    setPlaceOrderLoading(true);
    const orderDetails = {
      orderDetails: {
        productId,
        productQuantity: orderQuantity,
      },
    };
    // console.log("Ordering clientDetails--->", clientDetails);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API1}/user/products/placeorder`,
        orderDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setOrderQuantity("");
      setPlaceOrderLoading(false);
      setOrderFlag(false);
      alert(response.data.message);

      // removing the products from the cart after placing the order
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_API1}/user/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      fetchProductsFromCart(); // updating the page
    } catch (error) {
      console.log(error);
      setOrderQuantity("");
      setPlaceOrderLoading(false);
      if (error.response) alert(error.response.data.message);
    }
  };

  return (
    <>
      <div
        className="p-5 border border-red-700 text-center bg-blue-400 cursor-pointer"
        onClick={() => navigate("/user/products")}
      >
        <h1>Back</h1>
      </div>
      <div className="w-full mt-2">
        <h1>Your cart</h1>
        {loading ? (
          <div className="w-full h-full text-center mt-5">
            <h1 style={{ fontSize: "4rem" }}>Loading...</h1>
          </div>
        ) : (
          <>
            {cartProducts.length === 0 ? (
              <h1>{noCartProductMessage}</h1>
            ) : (
              <>
                {cartProducts.map((item, index) => (
                  <div key={item._id} className="mt-5 ml-5">
                    <img
                      src="https://images.squarespace-cdn.com/content/v1/5ec1febb58a4890157c8fbeb/19ebb9ed-4862-46e1-9f7c-4e5876730227/Beetroot-Burger.jpg"
                      width="20%"
                    ></img>
                    <h2>
                      <b>{item.productName}</b>
                    </h2>
                    <p>Price: ${item.productPrice}</p>
                    <p>Product Quantity: {item.productQuantity}</p>
                    <button
                      className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                      onClick={(e) => removeFromCart(e, item.productId)}
                    >
                      remove
                    </button>
                    {orderFlag ? (
                      <>
                        <button
                          className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition ml-2"
                          onClick={() => {
                            setOrderFlag(false);
                            setProductId("");
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition ml-2"
                          onClick={() => {
                            setOrderFlag(true);
                            setProductId(item.productId);
                          }}
                        >
                          Order
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
      {orderFlag && (
        <>
          <div className="mt-2 p-2">
            <input
              type="text"
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(e.target.value)}
              placeholder="Enter the productQuantity..."
              className="border border-red-600"
            ></input>
            <button
              className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition ml-2"
              onClick={placeOrder}
            >
              {placeOrderLoading ? "ordering..." : "order"}
            </button>
          </div>
        </>
      )}
    </>
  );
}
