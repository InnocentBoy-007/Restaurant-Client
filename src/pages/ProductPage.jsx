import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import fetchDetails from "../components/FetchDetails";
import services from "../components/services";
import cartController from "../components/CartController";

// test passed
const ProductPage = () => {
  const navigate = useNavigate();

  const token = Cookies.get("clientToken");
  // const refreshToken = Cookies.get("clientRefreshToken"); // add later
  const [productInfo, setProductInfo] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productQuantity, setProductQuantity] = useState("");

  const [orderConfirmationFlag, setOrderConfirmationFlag] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetch_productDetails = async () => {
    setScreenLoading(true);
    const response = await fetchDetails.FetchProductDetails();
    if (response.success) {
      setScreenLoading(false);
      setProductInfo(response.productDetails);
    }
  };

  useEffect(() => {
    fetch_productDetails();
  }, []);

  const addToCart = async (e, productId) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await cartController.AddProductsToCart(productId, token);
      if (response) {
        setLoading(false);
        setSelectedProductId("");
      }
    } catch (error) {
      setLoading(false);
      setSelectedProductId("");
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      orderDetails: {
        productId: selectedProductId,
        productQuantity: parseInt(productQuantity),
      },
    };

    try {
      const response = await services.PlaceOrder(data, token);
      if (response.success) {
        await fetch_productDetails();
        setOrderConfirmationFlag(false);
      }
    } finally {
      setLoading(false);
      setProductQuantity("");
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
      {screenLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          <h2>Loading</h2>
        </div>
      ) : (
        <>
          <div className="p-5 flex justify-between">
            <div className="flex gap-2">
              <button
                className="border border-red-700 p-2 bg-blue-300"
                onClick={() => {
                  if (!token) {
                    alert("You need to signin first! - warning!");
                    navigate("/");
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
                    onClick={() => navigate("/user/signIn")}
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
                      setSelectedProductId(item._id);
                      if (!token) {
                        alert("Please login first to place order");
                        navigate("/user/signIn");
                        setSelectedProductId("");
                        return;
                      }
                      setOrderConfirmationFlag(true);
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
                        navigate("/user/signIn");
                        return;
                      }
                    }}
                  >
                    {loading ? "adding..." : "add to cart"}
                  </button>
                </div>
              </div>
            ))}
            {orderConfirmationFlag && (
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
                  onClick={() => setOrderConfirmationFlag(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ProductPage;
