import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import fetchDetails from "../components/FetchDetails";
import cartController from "../components/CartController";
import services from "../components/Services";
import { isTokenExpired } from "../components/isTokenExpired";
import { RefreshToken } from "../components/RefreshToken";


// there is an error in the product quantity (it does not shows the exact product quantity inside the product database)

export default function Cart() {
  const [token, setToken] = useState(Cookies.get("clientToken"));
  const refreshToken = Cookies.get("clientRefreshToken");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [cartProducts, setCartProducts] = useState([]); // array
  const [noCartProductMessage, setNoCartProductsMessage] = useState("");

  const [placeOrderLoading, setPlaceOrderLoading] = useState(false);

  const [productId, setProductId] = useState("");
  const [orderQuantity, setOrderQuantity] = useState("");

  const [orderFlag, setOrderFlag] = useState(false);

  useEffect(() => {
    if (!Cookies.get("clientToken")) {
      console.log("No token found!");
      navigate("/");
    }
  }, []);

  const checkToken = async () => {
    if (refreshToken && isTokenExpired(token)) {
      const newToken = await RefreshToken(refreshToken);
      Cookies.set("clientToken", newToken.token);
      setToken(newToken.token);
    }
  };

  const fetchProductsFromCart = async () => {
    await checkToken();
    const response = await fetchDetails.FetchProductDetails_Cart(token);
    if (response.success) {
      setCartProducts(response.products);
    } else if (response.message) {
      setNoCartProductsMessage(response.message);
    }
  };

  useEffect(() => {
    fetchProductsFromCart();
  }, []);

  // test passed
  const removeFromCart = async (e, productId) => {
    await checkToken();
    e.preventDefault();
    setLoading(true);
    try {
      const response = await cartController.RemoveProductsFromCart(
        productId,
        token
      );
      if (response) {
        setProductId("");
        setLoading(false);
        fetchProductsFromCart(); // refreshing the page
      }
    } catch (error) {
      setProductId("");
      setLoading(false);
    }
  };

  // function for placing order from the cart
  const placeOrder = async (e) => {
    await checkToken();
    e.preventDefault();
    setPlaceOrderLoading(true);
    const data = {
      orderDetails: {
        productId,
        productQuantity: parseInt(orderQuantity),
      },
    };

    try {
      const response = await services.PlaceOrder(data, token);
      if (response.success) {
        setOrderQuantity("");
        setPlaceOrderLoading(false);
        setOrderFlag(false);

        await cartController.RemoveProductsFromCart(productId, token);
        navigate("/user/products");
      }
    } catch (error) {
      setOrderQuantity("");
      setPlaceOrderLoading(false);
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
            {noCartProductMessage ? (
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
