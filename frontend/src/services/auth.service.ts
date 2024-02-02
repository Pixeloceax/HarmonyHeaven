import axios from "axios";
import IUser from "../types/use.type";

class AuthService {
  private readonly BACKEND_URL = "http://localhost:8000";
  private readonly LOGIN = "/login";
  private readonly GET_USER_DATA = "/get-current-user";
  private readonly REGISTER = "/register";

  async login(email: string, password: string) {
    const response = await axios.post(this.BACKEND_URL + this.LOGIN, {
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

  register(username: string, email: string, password: string) {
    return axios.post(this.BACKEND_URL + this.REGISTER, {
      username,
      email,
      password,
    });
  }

  forgotPassword(email: string) {
    return axios.post(this.BACKEND_URL + "/forgot-password", { email });
  }

  resetPassword(password: string, token: string) {
    return axios.post(this.BACKEND_URL + "/reset-password", { password, token });
  }

  async getCurrentUser(): Promise<IUser | null> {
    try {
      const token: string | null = this.getUserToken();
      if (!token) {
        throw new Error("User email not found in local storage");
      }
      const email = JSON.parse(token).user;
      const response = await axios.post(
        `${this.BACKEND_URL}${this.GET_USER_DATA}`,
        {
          email,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private getUserToken(): string | null {
    return localStorage.getItem("user");
  }
}

export default new AuthService();
