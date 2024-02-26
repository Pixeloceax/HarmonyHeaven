import axios from "axios";
import IProduct from "../types/product.type";

class ShopService {
  private readonly BACKEND_URL = "http://localhost:8000";
  private readonly PRODUCTS_LIST = "/products-list";
  private readonly PRODUCT_DETAIL = "/product";

  async getProducts() {
    try {
      const response = await axios.get<IProduct[]>(
        `${this.BACKEND_URL}${this.PRODUCTS_LIST}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async getProductById(id: number) {
    try {
      const response = await axios.get<IProduct>(
        `${this.BACKEND_URL}${this.PRODUCT_DETAIL}/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Error fetching product by ID");
    }
  }
}

export default new ShopService();
