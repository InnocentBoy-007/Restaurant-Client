import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("clientToken"); // declaring the token as a global value

// function to fetch client details
export async function FetchClientDetails() {
  const URL = `${import.meta.env.VITE_BACKEND_API1}/account/details`;
  try {
    const response = await axios.get(URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return { clientDetails: response.data.clientDetails };
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.log(error.response.data.message);
      return { fetchClientDetails_error: error.response.data.message };
    }
  }
}

// function to fetch product details (global route)
export async function FetchProductDetails() {
  const URL = `${import.meta.env.VITE_BACKEND_API2}/product/details`;
  try {
    const response = await axios.get(URL, {
      headers: { "Content-Type": "application/json" },
    });
    return { productDetails: response.data.products };
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.log(error.response.data.message);
      return { fetchProductDetails_error: error.response.data.message };
    }
  }
}

// function to fetch product details from cart
export async function FetchProductDetails_Cart() {
  const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/cart/fetch`;
  try {
    const response = await axios.get(URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.products;
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.log(error.response.data.message);
      return { fetchProductDetails_Cart_error: error.response.data.message };
    }
  }
}

// function to track the order details
export async function TrackOrderDetails() {
  const URL = `${
    import.meta.env.VITE_BACKEND_API1
  }/v1/customers/orders/track_orders`;
  try {
    const response = await axios.get(URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return { orderDetails: response.data.products };
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.log(error.response.data.message);
      return { fetchOrderDetails_error: error.response.data.message };
    }
  }
}
