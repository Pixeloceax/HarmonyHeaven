import axios from "axios";
import authHeader from "./auth-header";

class UserService {
  private readonly BACKEND_URL = "http://localhost:8000/";

  getPublicContent() {
    return axios.get(this.BACKEND_URL + "all");
  }

  async updateUserBoard(userData: string) {
    console.log(userData);
    try {
      const response = await axios.put(this.BACKEND_URL + "user", userData, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private getAuthHeaders() {
    return authHeader();
  }
}
export default new UserService();
