// ProductPage.js
import React from "react";

const ProductPage = () => {
  const handleOrder = () => {
    alert("Order placed successfully!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-6">
        <img
          className="w-full h-48 object-cover"
          src="https://www.foodandwine.com/thmb/DI29Houjc_ccAtFKly0BbVsusHc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/crispy-comte-cheesburgers-FT-RECIPE0921-6166c6552b7148e8a8561f7765ddf20b.jpg"
          alt="Product"
        />
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold mb-2">Product Name</h1>
          <p className="text-gray-700 text-base">
            This is a description of the product. It gives the customer some
            insight into the features and benefits.
          </p>
          <p className="text-lg font-bold mt-4">$29.99</p>
        </div>
        <div className="px-6 py-4">
          <button
            onClick={handleOrder}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
