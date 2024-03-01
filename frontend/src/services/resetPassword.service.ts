import axios from "axios";

class resetPasswordService {
  private readonly BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  private readonly FORGOT_PASSWORD = import.meta.env
    .VITE_PUBLIC_FORGOT_PASSWORD;
  private readonly RESET_PASSWORD = import.meta.env.VITE_PUBLIC_RESET_PASSWORD;
  private readonly CHECK_TOKEN = import.meta.env.VITE_PUBLIC_CHECK_TOKEN;

  forgotPassword(email: string) {
    return axios.post(`${this.BACKEND_URL}${this.FORGOT_PASSWORD}`, { email });
  }

  resetPassword(password: string, token: string) {
    return axios.post(`${this.BACKEND_URL}${this.RESET_PASSWORD}`, {
      password,
      token,
    });
  }

  checkToken(token: string) {
    return axios.post(`${this.BACKEND_URL}${this.CHECK_TOKEN}`, { token });
  }
}

export default new resetPasswordService();
