import axios, { AxiosError } from "axios"; // Import AxiosError
import IProduct from "../types/product.type";
import IWishlistItem from "../types/wishlist.type.ts";

class WishlistService {
  private readonly BACKEND_URL = "http://localhost:8000";
  private readonly WISHLIST_ENDPOINT = "/wishlist";

  async getWishlist(): Promise<IWishlistItem[]> {
    try {
      const response = await axios.get<IWishlistItem[]>(
        `${this.BACKEND_URL}${this.WISHLIST_ENDPOINT}`,
        {
          headers: this.getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios error
        console.error("Axios error:", error.response); // Log the response data
      } else {
        // Handle other errors
        console.error("Error adding to wishlist:", error);
      }
      throw error; // Re-throw the error if needed
    }
  }

  async addToWishlist(product: IProduct): Promise<void> {
    try {
      await axios.post(
        `${this.BACKEND_URL}${this.WISHLIST_ENDPOINT}/add`,
        product,
        {
          headers: this.getAuthHeaders()
        }
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios error
        console.error("Axios error:", error.response); // Log the response data
      } else {
        // Handle other errors
        console.error("Error adding to wishlist:", error);
      }
      throw error; // Re-throw the error if needed
    }
  }

  async removeFromWishlist(productId: string): Promise<void> {
    try {
      await axios.delete(
        `${this.BACKEND_URL}${this.WISHLIST_ENDPOINT}/remove/${productId}`,
        {
          headers: this.getAuthHeaders()
        }
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios error
        console.error("Axios error:", error.response); // Log the response data
      } else {
        // Handle other errors
        console.error("Error adding to wishlist:", error);
      }
      throw error; // Re-throw the error if needed
    }
  }

  async updateWishlistQuantityItem(_productId: string, _quantity: number): Promise<void> {
    try {
      // Implement your logic to update the quantity of an item in the wishlist
    } catch (error) {
      console.error("Error updating wishlist item quantity:", error);
      throw error;
    }
  }

  private getAuthHeaders() {
    // Implement your authentication logic here
    return {}; // Example: return authHeader();
  }

  private handleAxiosError(error: AxiosError) {
    console.error("Axios error:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
  }
}

export default new WishlistService();
