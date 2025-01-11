import axios from "axios";

class CartController {
    async AddProductsToCart(productId, token) {
        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/cart/${productId}/add`
        try {
            // axios will automaticall throw and detect invalid request
            // still, following a good coding process
            const response = await axios.post(URL, {}, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });
            if (response) {
                const { addedProduct, message } = response.data;
                alert(message);
                return { products: addedProduct, success: true };
            }
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to add the product!");
            }
        }
    }

    async RemoveProductsFromCart(productId, token) {
        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/cart/${productId}/delete`
        try {
            const response = await axios.delete(URL, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });

<<<<<<< HEAD
            return {message: response.data.message, success:true};
=======
            alert(response.data.message);

            return { success: true };
>>>>>>> 3dc62eaae14ac43a8c03e5158f6677af51892a19
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to remove the product from the cart!");
            }
        }
    }
}

const cartController = new CartController();
export default cartController;
