import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function Cart() {
  const [loading, setLoading] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);

  const token = Cookies.get("clientToken");
  const decodedClientToken = jwtDecode(token);
  const clientEmail = decodedClientToken.clientEmail;

  const fetchProductsFromCart = async () => {
    console.log("ClientEmail -->", clientEmail);

    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API1}/fetchOrdersCart/${clientEmail}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setCartProducts(response.data.checkProduct);
      console.log(response.data.checkProduct);

      setLoading(false);
      console.log(response.data.message);
      console.log(`Fetching response data by ${clientEmail}`);
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
      <h1 style={{ fontSize: "2rem" }}>Your cart</h1>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          {cartProducts.length === 0 ? (
            <h1>No products found!</h1>
          ) : (
            cartProducts.map((item, index) => (
              <ul key={item._id}>
                <div className="w-full p-10">
                  <b>{index + 1}</b>
                  <img
                    src="https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg"
                    width="10%"
                  />
                  <li>Product: {item.productName}</li>
                  <li>Price: {item.productPrice}</li>
                  <li>Added on: {item.addedTime}</li>
                  <li>
                    <button
                      style={{ border: "2px solid red" }}
                      onClick={(e) => orderFromCart(e, item.productId)}
                    >
                      Order
                    </button>
                  </li>
                </div>
              </ul>
            ))
          )}
        </div>
      )}
    </>
  );
}
