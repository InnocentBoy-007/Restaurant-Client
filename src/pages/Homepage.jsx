import React from "react";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>This is home page</h1>
      <button onClick={() => navigate("/signUp")}>Sign up</button>
      <button onClick={() => navigate("/signIn")}>Sign in</button>
    </div>
  );
}
