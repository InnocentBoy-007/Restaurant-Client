import axios from "axios";
import Cookies from "js-cookie";

export async function FetchClientDetails() {
  const token = Cookies.get("clientToken");
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
