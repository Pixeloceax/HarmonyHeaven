import axios from "axios";
import authHeader from "./auth-header";

class AdminService {
  private readonly ADMIN_BACK_END_URL = import.meta.env.VITE_ADMIN_BACK_END_URL;
  private readonly ADMIN_MANAGE_USERS = import.meta.env.VITE_ADMIN_MANAGE_USERS;
  private readonly ADMIN_MANAGE_PRODUCTS = import.meta.env
    .VITE_ADMIN_MANAGE_PRODUCTS;

  // ---------- USER ADMIN CRUD ----------
  async getAllUsers() {
    try {
      const response = await axios.get(
        `${this.ADMIN_BACK_END_URL}${this.ADMIN_MANAGE_USERS}`,

        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Error updating user: " + error);
    }
  }

  getUserById(userId: string) {
    try {
      return axios.get(
        `${this.ADMIN_BACK_END_URL}${this.ADMIN_MANAGE_USERS}/${userId}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
    } catch (error) {
      throw new Error("Error getting user by id: " + error);
    }
  }

  updateUserInformation(userId: string, updatedInformation: string) {
    try {
      return axios.put(
        `${this.ADMIN_BACK_END_URL}${this.ADMIN_MANAGE_USERS}/${userId}`,
        updatedInformation,
        {
          headers: this.getAuthHeaders(),
        }
      );
    } catch (error) {
      throw new Error("Error updating user: " + error);
    }
  }

  deleteUser(userId: number) {
    try {
      return axios.delete(
        `${this.ADMIN_BACK_END_URL}${this.ADMIN_MANAGE_USERS}/${userId}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
    } catch (error) {
      throw new Error("Error deleting user: " + error);
    }
  }

  // ---------- PRODUCT ADMIN CRUD ----------

  async getAllProducts() {
    try {
      const response = await axios.get(
        `${this.ADMIN_BACK_END_URL}${this.ADMIN_MANAGE_PRODUCTS}`,
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
        `${this.ADMIN_BACK_END_URL}${this.ADMIN_MANAGE_PRODUCTS}${productId}`,
        updatedInformation,
        {
          headers: this.getAuthHeaders(),
        }
      );
    } catch (error) {
      throw new Error("Error updating product: " + error);
    }
  }

  createProduct(product: object) {
    try {
      return axios.post(
        `${this.ADMIN_BACK_END_URL}${this.ADMIN_MANAGE_PRODUCTS}`,
        product,
        {
          headers: this.getAuthHeaders(),
        }
      );
    } catch (error) {
      throw new Error("Error creating product: " + error);
    }
  }

  deleteProduct(productId: number) {
    try {
      return axios.delete(
        `${this.ADMIN_BACK_END_URL}${this.ADMIN_MANAGE_PRODUCTS}${productId}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
    } catch (error) {
      throw new Error("Error deleting product: " + error);
    }
  }

  private getAuthHeaders() {
    return authHeader();
  }
}
export default new AdminService();
