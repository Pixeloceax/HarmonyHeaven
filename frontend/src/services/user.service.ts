import axios from "axios";
import authHeader from "./auth-header";

class UserService {
  private readonly BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  private readonly USER_BOARD_URL = import.meta.env.VITE_USER_USERBOARD;

  async updateUserBoard(userData: string) {
    try {
      const response = await axios.put(
        `${this.BACKEND_URL}${this.USER_BOARD_URL}`,
        userData,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Error updating user: " + error);
    }
  }

  private getAuthHeaders() {
    return authHeader();
  }
}
export default new UserService();
