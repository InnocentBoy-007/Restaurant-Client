import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// database field update by comparing the past orderdetails with the current order details

// test passed
const ProductPage = () => {
  const token = Cookies.get("clientToken");
  const [productInfo, setProductInfo] = useState([]);

  const [productId, setProductId] = useState("");
  const [orderName, setOrderName] = useState("");
  const [orderEmail, setOrderEmail] = useState("");
  const [orderQuantity, setOrderQuantity] = useState("");
  const [orderAddress, setOrderAddress] = useState("");
  const [orderPhoneNo, setOrderPhoneNo] = useState("");

  const [orderConfirmation, setOrderConfirmation] = useState(false);

  const decodedToken = () => {
    if (!token) {
      //   console.log("No token!");
      return;
    }
    // console.log("Token --->", token); // it's working
    try {
      const decodedToken = jwtDecode(token);
      setOrderName(decodedToken.clientDetails.name);
      setOrderEmail(decodedToken.clientDetails.email);
      setOrderAddress(decodedToken.clientDetails.address);
      setOrderPhoneNo(decodedToken.clientDetails.phoneNo);
      // console.log(
      //     "Client details--->",
      //     orderName,
      //     orderEmail,
      //     orderAddress,
      //     orderPhoneNo
      //   ); // it's working
    } catch (error) {
      console.log("Error-->", error);
    }
  };

  const fetchProductInfo = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API1}/fetchProduct`
      );

      if (!response) {
        console.log("Cannot fetch product details! - frontend");
      }
      setProductInfo(response.data);
      // console.log("Product details ---->", response.data);
    } catch (error) {
      console.log("Error fetching product details! - frontend", error);
    }
  };

  useEffect(() => {
    fetchProductInfo();
    decodedToken();
  }, []);

  const navigate = useNavigate();

  // need testing
  const addToCart = async (e, productId) => {
    e.preventDefault();
    const clientEmail = orderEmail;
    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_API1
        }/user/cart/add/${clientEmail}/${productId}`,
        {}, //empty body
        { headers: { "Content-Type": "application/json" } }
      );

      alert(response.data.message);
    } catch (error) {
      if (error.response) alert(error.response.data.message);
      // console.log(error);
    }
  };

  const placeOrder = async (e, orderQuantity) => {
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
      setOrderConfirmation(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setOrderQuantity("");
      console.log("Error placing order:", error);
      if (error.response) alert(error.response.data.message);
    }
  };

  return (
    <>
      <div
        className="w-full bg-blue-600 p-2 text-center"
        onClick={() => navigate("/")}
      >
        Back
      </div>
      <div className="p-5">
        <button
          className="border border-red-700 p-2"
          onClick={() => {
            if (!token) {
              alert("You need to signin first! - warning!");
              navigate("/signIn");
              return;
            }
            navigate("/cart");
          }}
        >
          Your cart
        </button>
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
                    alert("Please login to place order");
                    navigate("/signIn");
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
            onChange={(e) => setOrderQuantity(e.target.value)}
            value={orderQuantity}
          ></input>
          <button
            className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
            onClick={(e) => placeOrder(e, orderQuantity)}
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
