import axios from "axios";
import IUser from "../types/use.type";


class AuthService {

  private readonly BACKEND_URL="https://127.0.0.1:8000";
  private readonly LOGIN="/login"
  private readonly GET_USER_DATA = "/get-current-user"
  private readonly REGISTER ="/register"


  async login(email: string, password: string) {
    const response = await axios.post(this.BACKEND_URL+this.LOGIN, {
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

    return axios.post(this.BACKEND_URL+this.REGISTER, {
      username,
      email,
      password,
    });
  }

  async getCurrentUser(): Promise<IUser | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const token: string | null =  localStorage.getItem("user");
        if (!token) {
          reject(new Error('User email not found in local storage'));
          return;
        }
        const email = JSON.parse(token).user
        const response = await axios.post(`${this.BACKEND_URL}${this.GET_USER_DATA}`, {
          email
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  }  
}

export default new AuthService();
