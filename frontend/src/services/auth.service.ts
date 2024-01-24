import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

class AuthService {
  async login(username: string, password: string) {
    const response = await axios.post(API_URL, {
      username,
      password,
    });
    if (response.data.accessToken) {
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
    adress: string,
    phone: string
  ) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password,
      adress,
      phone,
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthService();
