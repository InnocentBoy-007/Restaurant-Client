import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function Cart() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);

  const token = Cookies.get("clientToken");
  const decodedClientToken = jwtDecode(token);
  const email = decodedClientToken.clientDetails.email;

  const fetchProductsFromCart = async () => {
    console.log("ClientEmail from cart-->", email);

    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API1}/fetchOrdersCart/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setCartProducts(response.data.checkProduct);
      console.log("Product details--->", response.data.checkProduct); // it's working
      setLoading(false);
      console.log(`Fetching response data by ${email}`);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsFromCart();
  }, []);

  const orderFromCart = async (e, productId) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API1}/placeOrder/${productId}`
      );
    } catch (error) {
      console.log(error);
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
                      width="50%"
                    ></img>
                    <h2>
                      <b>{item.productName}</b>
                    </h2>
                    <p>Price: ${item.productPrice}</p>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
