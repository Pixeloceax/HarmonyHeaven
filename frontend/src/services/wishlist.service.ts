/* eslint-disable @typescript-eslint/ban-types */
import authHeader from "./auth-header";
import ICartItem from "../types/cart-item.type";

class WishlistService {
  private readonly BACKEND_URL = "http://localhost:8000";
  private readonly WISHLIST_ENDPOINT = "/wishlist";
  private subscribers: Function[] = [];

  private setWishlist(wishlist: ICartItem[]) {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    // Notify subscribers whenever wishlist is updated
    this.notifySubscribers();
  }

  getWishlist(): ICartItem[] {
    return JSON.parse(localStorage.getItem("wishlist") as string) || [];
  }


  addToWishlist(
    productId: string,
    productName: string,
    productImage: string,
    productPrice: number
  ) {
    const wishlist = this.getWishlist();

    const foundSameProduct = wishlist.find((p) => p.product.id === productId);

    if (!foundSameProduct) {
      wishlist.push({
        product: {
          id: productId,
          name: productName,
          image: productImage,
          price: productPrice,
        },
        quantity: 1,
      });

      this.setWishlist(wishlist);
    }
  }

  removeFromWishlist(productId: string) {
    const wishlist = this.getWishlist();
    const updatedWishlist = wishlist.filter((item) => item.product.id !== productId);
    this.setWishlist(updatedWishlist);
  }

  updateWishlistQuantityItem(productId: string, quantity: number) {
    const wishlist = this.getWishlist();
    const updatedWishlist = wishlist.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    this.setWishlist(updatedWishlist);
  }

  // Subscribe to wishlist changes
  subscribe(callback: Function) {
    this.subscribers.push(callback);
  }

  // Unsubscribe from wishlist changes
  unsubscribe(callback: Function) {
    this.subscribers = this.subscribers.filter(
      (subscriber) => subscriber !== callback
    );
  }

  // Notify all subscribers whenever wishlist is updated
  private notifySubscribers() {
    this.subscribers.forEach((subscriber) => subscriber());
  }

  private getAuthHeaders() {
    return authHeader();
  }
}

export default new WishlistService();
