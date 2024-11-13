import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// database field update by comparing the past orderdetails with the current order details

// test passed
const ProductPage = () => {
  const [productInfo, setProductInfo] = useState([]);
  const [order, setOrder] = useState(false);

  const [productId, setProductId] = useState("");
  const [orderName, setOrderName] = useState("");
  const [orderEmail, setOrderEmail] = useState("");
  const [orderQuantity, setOrderQuantity] = useState("");
  const [orderAddress, setOrderAddress] = useState("");
  const [orderPhoneNo, setOrderPhoneNo] = useState("");

  const [loading, setLoading] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const fetchProductInfo = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API1}/fetchProduct`
      );

      if (!response) {
        console.log("Cannot fetch product details! - frontend");
      } else {
        setProductInfo(response.data);
        console.log("Product details ---->", response.data);
      }
    } catch (error) {
      console.log("Error fetching product details! - frontend", error);
    }
  };

  useEffect(() => {
    fetchProductInfo();
  }, []);

  const navigate = useNavigate();
  const addToCart = async (e, productId) => {
    e.preventDefault();
    setAddToCartLoading(true);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_API1}/addToCart/${productId}`,
        {},
        { headers: { "Content-Type": "application/json" } }
      );
      setAddToCartLoading(false);
      alert(response.data.message);
    } catch (error) {
        setAddToCartLoading(false);
      console.log(error);
    }finally{
        setAddToCartLoading(false);
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    const clientDetails = {
      clientDetails: {
        orderName,
        orderEmail,
        orderQuantity: parseInt(orderQuantity),
        orderAddress,
        orderPhoneNo,
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API1}/placeOrder/${productId}`,
        clientDetails,
        { headers: { "Content-Type": "application/json" } }
      );
      alert(response.data.message);
      navigate("/verifyotp");
    } catch (error) {
      console.log("Error placing order:", error);
    }
  };

  return (
    <>
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
                  setOrder(true);
                  setProductId(item._id);
                }}
              >
                Order
              </button>
              <button
                className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                onClick={(e) => {
                  addToCart(e, item._id);
                }}
              >
                {addToCartLoading ? 'adding to cart...':'add to cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {order && (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md mt-5">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Order Confirmation
          </h2>
          <form onSubmit={placeOrder}>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="orderName">
                Name
              </label>
              <input
                type="text"
                name="orderName"
                id="orderName"
                value={orderName}
                onChange={(e) => setOrderName(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="orderEmail">
                Email
              </label>
              <input
                type="text"
                name="orderEmail"
                id="orderEmail"
                value={orderEmail}
                onChange={(e) => setOrderEmail(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="phoneNo">
                Phone
              </label>
              <input
                type="text"
                name="orderPhoneNo"
                id="orderPhoneNo"
                value={orderPhoneNo}
                onChange={(e) => setOrderPhoneNo(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="quantity">
                Quantity
              </label>
              <input
                type="text"
                name="orderQuantity"
                id="orderQuantity"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
                min="1"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="address">
                Address
              </label>
              <input
                type="text"
                name="orderAddress"
                id="orderAddress"
                value={orderAddress}
                onChange={(e) => setOrderAddress(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ProductPage;
