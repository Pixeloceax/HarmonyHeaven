import axios from 'axios';
import IProduct from '../types/product.type';

class ShopService {
  private readonly BACKEND_URL = "http://localhost:8000";
  private readonly PRODUCTS_LIST = "/products-list";

  async getProducts() {
    try {
      const response = await axios.get<IProduct[]>(`${this.BACKEND_URL}${this.PRODUCTS_LIST}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }
}

export default new ShopService();
