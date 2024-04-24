import axios from "axios";
import authHeader from "./AuthHeader";
import ICartItem from "../types/cart-item.type";

// Define the type for the subscriber functions
type Subscriber = () => void;

class CartService {
  private readonly BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  private readonly SUBMIT_CART = import.meta.env.VITE_USER_SUBMIT_CART;
  private readonly CART_ENDPOINT = this.SUBMIT_CART;
  // eslint-disable-next-line @typescript-eslint/ban-types
  private subscribers: Function[] = [];

  private setCart(cart: ICartItem[]) {
    localStorage.setItem("cart", JSON.stringify(cart));
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
    productId: number,
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

  async addToCartLogged(
    productId: number,
    productName: string,
    productImage: string,
    productPrice: number
  ): Promise<void> {
    const cart = this.getCart();
    const foundSameProduct = cart.find((p) => p.product.id === productId);
    try {
      await axios.post(
        `${this.BACKEND_URL}add_${this.CART_ENDPOINT}`,
        { productId },
        {
          headers: authHeader(),
        }
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response);
        console.error("Error adding to wishlist:", error);
      } else if (foundSameProduct) {
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
      throw error;
    }
  }

  async removeFromCartLogged(productId: number): Promise<void> {
    try {
      await axios.delete(
        `${this.BACKEND_URL}${this.CART_ENDPOINT}/${productId}`,
        {
          headers: authHeader(),
        }
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response);
      } else {
        console.error("Error removing from cart:", error);
      }
      throw error;
    }
  }

  removeFromCart(productId: number) {
    const cart = this.getCart();
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    this.setCart(updatedCart);
  }

  updateCartQuantityItem(productId: number, quantity: number) {
    const cart = this.getCart();
    const updatedCart = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
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
        `${this.BACKEND_URL}${this.CART_ENDPOINT}`,
        products,
        {
          headers: this.getAuthHeaders(),
        }
      );
      if (response.status === 200) {
        localStorage.removeItem("cart");
        console.log("Cart confirmed");
        window.location.href = "/order";
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
  subscribe(callback: Subscriber) {
    // Use Subscriber type
    this.subscribers.push(callback);
  }

  // Unsubscribe from cart changes
  unsubscribe(callback: Subscriber) {
    // Use Subscriber type
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
