import axios from "axios";
import IUser from "../types/user.type";
import authHeader from "./auth-header";
class AuthService {
  private readonly BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  private readonly LOGIN = import.meta.env.VITE_PUBLIC_LOGIN;
  private readonly REGISTER = import.meta.env.VITE_PUBLIC_REGISTER;
  private readonly GET_USER_DATA = import.meta.env.VITE_USER_GET_CURRENT_USER;

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
    return axios.post(`${this.BACKEND_URL}${this.REGISTER}`, {
      username,
      email,
      password,
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
