import Cookies from "js-cookie";
import axios from "axios";

const token = Cookies.get("clientToken");

// function to add products into the cart
export async function AddProductsToCart(productId) {
  const URL = `${
    import.meta.env.VITE_BACKEND_API1
  }/v1/customers/cart/${productId}/add`;
  const data = {}; // empty data
  try {
    const response = await axios.post(URL, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return { message: response.data.message };
  } catch (error) {
    if (error.response) {
      return { addProductsToCart_error: error.response.data.message };
    }
  }
}

// function to remove product from cart
export async function RemoveProductsFromCart(productId) {
  const URL = `${
    import.meta.env.VITE_BACKEND_API1
  }/v1/customers/cart/${productId}/delete`;

  try {
    const response = await axios.delete(URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return { message: response.data.message };
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.log(error.response.data.message);
      return { removeProductsFromCart_error: error.response.data.message };
    }
  }
}
