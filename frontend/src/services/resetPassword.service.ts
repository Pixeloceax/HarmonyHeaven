import axios from "axios";

class resetPasswordService {
  private readonly BACKEND_URL = "http://localhost:8000";

  forgotPassword(email: string) {
    return axios.post(this.BACKEND_URL + "/forgot-password", { email });
  }

  resetPassword(password: string, token: string) {
    return axios.post(this.BACKEND_URL + "/reset-password", {
      password,
      token,
    });
  }

  checkToken(token: string) {
    return axios.post(this.BACKEND_URL + "/check-token", { token });
  }
}

export default new resetPasswordService();
