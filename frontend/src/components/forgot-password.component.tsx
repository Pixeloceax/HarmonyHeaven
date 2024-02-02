import React, { useState } from "react";
import AuthService from "../services/auth.service";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await AuthService.forgotPassword(email);
    setMessage(response.data.message);
  };

  return (
    <form onSubmit={handleForgotPassword}>
      <p>email:</p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ForgotPassword;
