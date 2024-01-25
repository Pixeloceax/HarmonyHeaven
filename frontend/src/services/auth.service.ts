import axios from "axios";

const BACKEND_URL="https://127.0.0.1:8000";
const LOGIN="/login"
const REGISTER = "/register"

class AuthService {
  async login(email: string, password: string) {
    const response = await axios.post(BACKEND_URL+LOGIN, {
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(
    username: string,
    email: string,
    password: string,
  ) {
    return axios.post(BACKEND_URL+REGISTER, {
      username,
      email,
      password,
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthService();
