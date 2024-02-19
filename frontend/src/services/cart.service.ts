import axios from "axios";
import authHeader from "./auth-header";
import ICartItem from "../types/cart-item.type";

class CartService {
  private readonly BACKEND_URL = "http://localhost:8000";
  private readonly SUBMIT_CART = "/cart";
  private subscribers: Function[] = [];

  private setCart(cart: ICartItem[]) {
    localStorage.setItem("cart", JSON.stringify(cart));
    // Notify subscribers whenever cart is updated
    this.notifySubscribers();
  }

  getCart(): ICartItem[] {
    return JSON.parse(localStorage.getItem("cart") as string) || [];
  }

  getCartTotalItems(): number {
    const cart = this.getCart();
    return cart.reduce((acc, item) => acc + item.quantity, 0);
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

    try {
      const response = await axios.post(
        `${this.BACKEND_URL}${this.SUBMIT_CART}`,
        products,
        {
          headers: this.getAuthHeaders(),
        }
      );
      if (response.status === 200) {
        localStorage.removeItem("cart");
        console.log("Cart confirmed");
      } else if (response.status === 500) {
        console.error("Error while confirming the cart");
      } else {
        console.error(`Unexpected status code: ${response.status}`);
      }
      return response;
    } catch (error) {
      console.error(`Error while confirming the cart: ${error}`);
      throw error;
    }
  }

  // Subscribe to cart changes
  subscribe(callback: Function) {
    this.subscribers.push(callback);
  }

  // Unsubscribe from cart changes
  unsubscribe(callback: Function) {
    this.subscribers = this.subscribers.filter(
      (subscriber) => subscriber !== callback
    );
  }

  // Notify all subscribers whenever cart is updated
  private notifySubscribers() {
    this.subscribers.forEach((subscriber) => subscriber());
  }

  private getAuthHeaders() {
    return authHeader();
  }
}

export default new CartService();