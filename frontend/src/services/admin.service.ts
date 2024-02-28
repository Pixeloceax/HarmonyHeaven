import axios from "axios";
import authHeader from "./auth-header";

class AdminService {
  private readonly BACKEND_URL = "http://localhost:8000/";
  private readonly ADMIN_BOARD_URL = "admin/users";
  private readonly PRODUCT_URL = "admin/products";
  private readonly PRODUCT_ID_URL = "admin/products/";

  // ---------- USER ADMIN CRUD ----------
  async getAllUsers() {
    try {
      const response = await axios.get(
        `${this.BACKEND_URL}${this.ADMIN_BOARD_URL}`,

        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Error updating user: " + error);
    }
  }

  // ---------- PRODUCT ADMIN CRUD ----------

  async getAllProducts() {
    try {
      const response = await axios.get(
        `${this.BACKEND_URL}${this.PRODUCT_URL}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Error getting all products: " + error);
    }
  }

  updateProductsInformation(productId: number, updatedInformation: string) {
    try {
      return axios.put(
        `${this.BACKEND_URL}${this.PRODUCT_ID_URL}${productId}`,
        updatedInformation,
        {
          headers: this.getAuthHeaders(),
        }
      );
    } catch (error) {
      throw new Error("Error updating product: " + error);
    }
  }

  private getAuthHeaders() {
    return authHeader();
  }
}
export default new AdminService();
