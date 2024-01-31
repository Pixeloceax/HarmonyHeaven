import axios from "axios";
import authHeader from "./auth-header";

class UserService {
  private readonly BACKEND_URL = "http://localhost:8000";

  getPublicContent() {
    return axios.get(this.BACKEND_URL + "all");
  }

  getUserBoard() {
    return axios.get(this.BACKEND_URL + "/profile", { headers: authHeader() });
  }
}

export default new UserService();
