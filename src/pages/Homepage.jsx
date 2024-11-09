import React from "react";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Welcome to my Restuarant</h1>
      <button onClick={() => navigate("/products")} className="text-blue-600">
        Products
      </button>
    </div>
  );
}
