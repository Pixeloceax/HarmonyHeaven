/* eslint-disable @typescript-eslint/ban-types */
import axios from "axios";
import authHeader from "./AuthHeader";
import AuthService from "./AuthService";
import ICartItem from "../types/cart-item.type";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the type for the subscriber functions
type Subscriber = () => void;

class CartService {
  private readonly BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  private readonly GET_CART = import.meta.env.VITE_USER_GET_CART;
  private readonly SUBMIT_CART = import.meta.env.VITE_SUBMIT_CART;
  private readonly ADD_TO_CART = import.meta.env.VITE_USER_ADD_TO_CART;
  private readonly ORDER = import.meta.env.VITE_ORDER;
  private readonly INCREMENT_STOCK = import.meta.env.VITE_INCREMENT_STOCK;
  private readonly DECREMENT_STOCK = import.meta.env.VITE_DECREMENT_STOCK;
  private readonly REMOVE_FROM_CART = import.meta.env
    .VITE_USER_REMOVE_FROM_CART;
  private subscribers: Function[] = [];

  //Compter le nombre d'items dans le cart et afficher dynamiquement le nombre d'items
  async getCartTotalItems(): Promise<number> {
    const user = await AuthService.getCurrentUser();
    let cart: ICartItem[] = [];
    if (user) {
      try {
        const response = await axios.get(
          `${this.BACKEND_URL}${this.GET_CART}`,
          {
            headers: authHeader(),
          }
        );
        cart = response.data.cart;
      } catch (err) {
        return 0; // or throw err;
      }
    } else {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        cart = JSON.parse(storedCart);
      }
    }
    return cart.reduce(
      (acc: number, item: ICartItem) => acc + item.quantity,
      0
    ); // Correction ici
  }

  private async setCart(cart: ICartItem[]) {
    const user = await AuthService.getCurrentUser();
    if (user) {
      try {
        const response = await axios.get(
          `${this.BACKEND_URL}${this.GET_CART}`,
          {
            headers: authHeader(),
          }
        );
        cart = response.data.cart;
      } catch (error) {
        console.error(error);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    this.notifySubscribers();
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

  //Récuperer le cart
  async getCart(): Promise<ICartItem[]> {
    const user = await AuthService.getCurrentUser();
    let cart: ICartItem[] = [];
    if (user) {
      const response = await axios.get(`${this.BACKEND_URL}${this.GET_CART}`, {
        headers: authHeader(),
      });
      cart = response.data.cart;
    } else {
      cart = JSON.parse(localStorage.getItem("cart") as string) || [];
    }
    await this.setCart(cart);
    return cart;
  }

  //Ajouter un item au cart
  async addToCart(
    productId: number,
    productName: string,
    productImage: string,
    productPrice: number
  ) {
    const cart = await this.getCart();
    const existingItem = cart.find((item: ICartItem) => item.id === productId);

    if (existingItem) {
      // Si le produit existe déja dans le panier, incrémenter la quantité
      existingItem.quantity++;
    } else {
      // Sinon ajouter le produit au panier
      const newItem: ICartItem = {
        product: {
          id: productId,
          name: productName,
          image: productImage,
          price: productPrice,
        },
        id: productId,
        name: productName,
        image: productImage,
        price: productPrice,
        quantity: 1,
      };
      cart.push(newItem);
    }

    // Mettre à jour le localStorage avec le nouveau panier uniquement si l'utilisateur n'est pas connecté
    const user = await AuthService.getCurrentUser();
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(cart));
      // Appeler l'API pour décrémenter la quantité du produit disponible en BDD
      const productToSend = cart.find(
        (item: ICartItem) => item.id === productId
      );
      if (productToSend) {
        // Vérifiez si productToSend n'est pas undefined
        await axios.post(`${this.BACKEND_URL}${this.DECREMENT_STOCK}`, {
          product: {
            id: productToSend.id,
          },
        });
        toast.success("Produit ajouté au panier");
      }
    }

    if (user) {
      // Appeler l'API pour ajouter le produit au panier de l'utilisateur connecté
      await axios.post(
        `${this.BACKEND_URL}${this.ADD_TO_CART}`,
        {
          productId: productId,
          cart: cart,
        },
        {
          headers: authHeader(),
        }
      );
      toast.success("Produit ajouté au panier");
    }

    // Mettre à jour l'état du composant avec le nouveau nombre total d'items dans le panier
    const cartTotal = await this.getCartTotalItems();
    this.notifySubscribers();
    return cartTotal;
  }

  //Supprimer un item du cart
  async removeFromCart(productId: number) {
    let cart: ICartItem[];
    const user = await AuthService.getCurrentUser();
    if (!user) {
      cart = JSON.parse(localStorage.getItem("cart") as string) || [];
      // Appeler l'API pour incrémenter la quantité du produit disponible en BDD
      const productToSend = cart.find(
        (item: ICartItem) => item.id === productId
      );
      if (productToSend) {
        // Vérifiez si productToSend n'est pas undefined
        await axios.post(`${this.BACKEND_URL}${this.INCREMENT_STOCK}`, {
          product: {
            id: productToSend.id,
            quantity: productToSend.quantity,
          },
        });
      }
      cart = cart.filter((item: ICartItem) => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      try {
        await axios.delete(
          `${this.BACKEND_URL}${this.REMOVE_FROM_CART}/${productId}`,
          {
            headers: authHeader(),
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
    this.notifySubscribers();
  }

  //Persister les items du localstorage en DB
  async persistStorage() {
    const cart = JSON.parse(localStorage.getItem("cart") as string) || [];
    const user = await AuthService.getCurrentUser();
    if (user) {
      try {
        await axios.post(`${this.BACKEND_URL}${this.SUBMIT_CART}`, cart, {
          headers: authHeader(),
        });
        //Supprimer le panier du stcoakge local une fois la requête éffectuée avec succès
        localStorage.removeItem("cart");
        // Vous pouvez ajouter un message de succès ou effectuer d'autres actions après la soumission du panier
      } catch (error) {
        console.error(error);
      }
    }
  }

  async confirmCart(totalPrice: number) {
    const user = await AuthService.getCurrentUser();
    if (!user) {
      window.location.href = "/login";
    } else {
      try {
        const headers = authHeader(); // Obtenir l'en-tête d'autorisation
        const data = { totalPrice: totalPrice };
        await axios.post(`${this.BACKEND_URL}${this.ORDER}`, data, { headers });
        window.location.href = "/order";
      } catch (error) {
        console.error(error);
      }
    }
  }
}

export default new CartService();
