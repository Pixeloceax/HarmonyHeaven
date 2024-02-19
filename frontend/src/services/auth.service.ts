import axios from "axios";
import IUser from "../types/use.type";
import authHeader from "./auth-header";
class AuthService {
  private readonly BACKEND_URL = "http://localhost:8000";
  private readonly LOGIN = "/login";
  private readonly GET_USER_DATA = "/get-current-user";
  private readonly REGISTER = "/register";

  async login(email: string, password: string) {
    const response = await axios.post(`${this.BACKEND_URL}${this.LOGIN}`, {
      email,
      password,
    });
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem("user");
    window.location.reload();
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
    return axios.post(this.BACKEND_URL + "/reset-password", {
      password,
      token,
    });
  }

  async getCurrentUser(): Promise<IUser | null> {
    const token: string | null = this.getUserToken();
    if (!token) {
      return null;
    }
    try {
      const response = await axios.get(
        `${this.BACKEND_URL}${this.GET_USER_DATA}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public isLoggedIn(): boolean {
    return !!this.getUserToken();
  }

  private getUserToken(): string | null {
    return localStorage.getItem("user");
  }

  private getAuthHeaders() {
    return authHeader();
  }
}

export default new AuthService();
