import IProduct from "../types/product.type";
import axios from "axios";
import authHeader from "./auth-header";

interface ICartItem {
  product: IProduct;
  quantity: number;
}

class cartService {
  private readonly BACKEND_URL = "http://localhost:8000";
  private readonly SUBMIT_CART = "/cart";

  private setCart(cart: ICartItem[]) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  getCart(): ICartItem[] {
    return JSON.parse(localStorage.getItem("cart") as string) || [];
  }

  addToCart(
    productId: string,
    productName: string,
    productImage: string,
    productPrice: number
  ) {
    const cart = this.getCart();

    const foundSameProduct = cart.find((p) => p.product.id === productId);

    if (foundSameProduct) {
      foundSameProduct.quantity += 1;
    } else {
      cart.push({
        product: {
          id: productId,
          name: productName,
          image: productImage,
          price: productPrice,
        },
        quantity: 1,
      });
    }

    this.setCart(cart);
  }

  updateCartQuantityItem(productId: string, quantity: number) {
    const cart = this.getCart();
    const updatedCart = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    this.setCart(updatedCart);
  }

  removeFromCart(productId: string) {
    const cart = this.getCart();
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    this.setCart(updatedCart);
  }

  async confirmCart() {
    const cart = this.getCart();
    const products = cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    const response = await axios.post(
      `${this.BACKEND_URL}${this.SUBMIT_CART}`,
      {
        products,
      },
      {
        headers: authHeader(),
      }
    );

    if (response.status === 200) {
      localStorage.removeItem("cart");
    }
    return response;
  }
}

export default new cartService();
