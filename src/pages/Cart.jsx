import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function Cart() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [placeOrderLoading, setPlaceOrderLoading] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const token = Cookies.get("clientToken");
  const decodedClientToken = jwtDecode(token);
  const [productId, setProductId] = useState("");
  const [productName, setOrderProductName] = useState("");
  const [orderQuantity, setOrderQuantity] = useState("");
  const [orderFlag, setOrderFlag] = useState(false);

  const email = decodedClientToken.clientDetails.email;

  const clientDetails = {
    clientDetails: {
      orderName: decodedClientToken.clientDetails.name,
      orderProductName: productName,
      orderEmail: email,
      orderQuantity: parseInt(orderQuantity),
      orderAddress: decodedClientToken.clientDetails.address,
      orderPhoneNo: decodedClientToken.clientDetails.phoneNo,
    },
  };

  const fetchProductsFromCart = async () => {
    // console.log("ClientEmail from cart-->", email);
    // console.log("client details---->", clientDetails);

    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API1}/user/cart/products/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setCartProducts(response.data.checkProduct);
      // console.log("Product details--->", response.data.checkProduct); // it's working
      setLoading(false);
      // console.log(`Fetching response data by ${email}`);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsFromCart();
  }, []);

  const removeFromCart = async (e, productId) => {
    e.preventDefault();
    // console.log("ProductId -->", productId);
    // console.log("Token-->", token);

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_API1}/user/cart/remove/${productId}`,
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
    // console.log("Ordering clientDetails--->", clientDetails);
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_API1
        }/user/products/placeorder/${productId}`,
        clientDetails, // while sending clientDetails, it shouldn't be enclosed with {} since 'clientDetails' is already an object. If not enclose with {} to make it an object
        { headers: { "Content-Type": "application/json" } }
      );
      setOrderQuantity("");
      setPlaceOrderLoading(false);
      setOrderFlag(false);
      console.log(response.data.message);
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
        className="p-5 border border-red-700 text-center bg-blue-400"
        onClick={() => navigate("/products")}
      >
        <h1>Back</h1>
      </div>
      <div className="w-full mt-2">
        <h1>Your cart</h1>
        {loading ? (
          <div>
            <h1>Loading...</h1>
          </div>
        ) : (
          <>
            {cartProducts.length === 0 ? (
              <h1>No items in cart</h1>
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
                    <button
                      className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                      onClick={(e) => removeFromCart(e, item.productId)}
                    >
                      remove
                    </button>
                    <button
                      className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition ml-2"
                      onClick={() => {
                        setOrderFlag(true);
                        setProductId(item.productId);
                        setOrderProductName(item.productName);
                      }}
                    >
                      Order
                    </button>
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
