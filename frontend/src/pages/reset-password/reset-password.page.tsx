import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AuthService from "../../services/auth.service";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useParams<{ token: string }>();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    if (!token) {
      return;
    }
    const response = await AuthService.resetPassword(token, password);
    setMessage(response.data.message);
  };

  return (
    <form onSubmit={handleResetPassword}>
      <p>password:</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <p>confirm password:</p>
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ResetPassword;
