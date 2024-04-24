import authHeader from "./AuthHeader.ts";
import axios from "axios";

class WishlistService {
  private readonly BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  private readonly WISHLIST_ENDPOINT = import.meta.env.VITE_USER_WISHLIST;

  async getWishlist() {
    try {
      const response = await axios.get(
        `${this.BACKEND_URL}get_${this.WISHLIST_ENDPOINT}`,
        {
          headers: authHeader(),
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

  async addToWishlist(productId: number): Promise<void> {
    try {
      await axios.post(
        `${this.BACKEND_URL}${this.WISHLIST_ENDPOINT}`,
        { productId },
        {
          headers: authHeader(),
        }
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response);
        console.error("Error adding to wishlist:", error);
      }
      throw error;
    }
  }

  async removeFromWishlist(productId: number): Promise<void> {
    try {
      await axios.delete(
        `${this.BACKEND_URL}${this.WISHLIST_ENDPOINT}/${productId}`,
        {
          headers: authHeader(),
        }
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response); // Log the response data
      } else {
        console.error("Error removing from wishlist:", error);
      }
      throw error; // Re-throw the error if needed
    }
  }

  async updateWishlistQuantityItem(): Promise<void> {
    try {
      // Implement your logic to update the quantity of an item in the wishlist
    } catch (error) {
      console.error("Error updating wishlist item quantity:", error);
      throw error;
    }
  }
}

export default new WishlistService();
