import axios from "axios";
import IWishlistItem from "../types/wishlist.type.ts";
import authHeader from "./auth-header.ts";

class WishlistService {
  private readonly BACKEND_URL = "http://localhost:8000/";
  private readonly WISHLIST_ENDPOINT = "wishlist";

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

  async addToWishlist(product: IWishlistItem): Promise<void> {
    try {
      await axios.post(
        `${this.BACKEND_URL}${this.WISHLIST_ENDPOINT}`,
        product,
        {
          headers: authHeader(), // Assuming authHeader is defined somewhere
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


  async removeFromWishlist(productId: IWishlistItem): Promise<void> {
    try {
      await axios.delete(
        `${this.BACKEND_URL}${this.WISHLIST_ENDPOINT}/remove/${productId}`,
        {
          headers: authHeader(),
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

  async updateWishlistQuantityItem(
    _productId: string,
    _quantity: number
  ): Promise<void> {
    try {
      // Implement your logic to update the quantity of an item in the wishlist
    } catch (error) {
      console.error("Error updating wishlist item quantity:", error);
      throw error;
    }
  }
}

export default new WishlistService();
