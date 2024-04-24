import cartService from "../../services/cart.service";
import IProduct from "../../types/product.type";
import { useState, useEffect } from "react";
import "./cart.css";
import axios from "axios";
import authHeader from "../../services/auth-header";
import authService from "../../services/auth.service";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const UPDATE_CART_ITEM = import.meta.env.VITE_UPDATE_CART_ITEM;
const UPDATE_STOCK = import.meta.env.VITE_UPDATE_STOCK;

interface ICartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  oldQuantity?: number;
}

interface CartItem extends ICartItem {
  product: IProduct;
}

const Cart = () => {
  const [userCart, setUserCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await cartService.getCart();
        setUserCart(cart);
      } catch (err) {
        setError("Error getting cart: " + err);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    const total = userCart.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
    setTotalPrice(total);
  }, [userCart]);

  const updateQuantity = async (id: number, newQuantity: number) => {
  try {
    const user = await authService.getCurrentUser(); // Attendre la résolution de la promesse

    if (user) {
      // L'utilisateur est connecté, mettre à jour la quantité via l'API
      const oldQuantity = userCart.find((item: CartItem) => item.id === id)?.quantity || 0;

      await axios.put(
        `${BACKEND_URL}${UPDATE_CART_ITEM}/${id}`,
        { quantity: newQuantity },
        { headers: authHeader() }
      );
      const updatedCart = await cartService.getCart();
      setUserCart(updatedCart);

      // Mettre à jour le stock du produit dans la base de données
      const product = updatedCart.find((item: CartItem) => item.id === id);
      if (product) {
        product.quantity = oldQuantity; // Stockez l'ancienne quantité dans l'objet CartItem
        product.quantity = newQuantity;
        await axios.post(
          `${BACKEND_URL}${UPDATE_STOCK}`,
          { productId: product.id, oldQuantity, newQuantity },
          { headers: authHeader() }
        );
      }
    } else {
      // L'utilisateur n'est pas connecté, mettre à jour la quantité dans le localStorage
      const cart = JSON.parse(localStorage.getItem("cart") as string) || [];
      const index = cart.findIndex((item: CartItem) => item.id === id);

      if (index !== -1) {
        const oldQuantity = cart[index].quantity;
        const updatedItem = { ...cart[index], quantity: newQuantity, oldQuantity }; // Stockez l'ancienne quantité dans l'objet CartItem
        const updatedCart = [...cart];
        updatedCart[index] = updatedItem;
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setUserCart(updatedCart); // Mettre à jour l'état userCart avec le nouveau panier mis à jour

        // Appeler l'API pour mettre à jour le stock du produit en BDD
        const productToSend = updatedCart.find((item: CartItem) => item.id === id);
        if (productToSend) { // Vérifiez si productToSend n'est pas undefined
          await axios.post(`${BACKEND_URL}${UPDATE_STOCK}`, {
            productId: productToSend.id,
            oldQuantity: productToSend.oldQuantity, // Utilisez l'ancienne quantité stockée dans l'objet CartItem
            newQuantity: productToSend.quantity,
          });
        }
      }
    }
  } catch (err) {
    setError("Error updating quantity: " + err);
  }
};


  const handleConfirmCart = async () => {
    try {
      await cartService.confirmCart(totalPrice);
      // Vous pouvez ajouter un message de succès ou effectuer d'autres actions après la confirmation du panier
    } catch (error) {
      console.error(error);
    }
  }

  const removeFromCart = async (id: number) => {
    try {
        await cartService.removeFromCart(id);
        const updatedCart = await cartService.getCart();
        setUserCart(updatedCart);
    } catch (err) {
        setError("Error removing item: " + err);
    }
};

  return (
    <div className="cart-container">
      {Array.isArray(userCart) && userCart.length === 0 && (
        <h1>Your cart is empty, return to Shop?</h1>
      )}
      {Array.isArray(userCart) &&
        userCart.map((item: CartItem) => {
          return (
            <div className="item-container" key={item.id}>
              <div className="cart-item">
                <div className="item-image">
                  <img
                    className="cart-image"
                    src={item.image}
                    alt={item.name}
                  />
                </div>
                <div className="item-details">
                  <h2>{item.name}</h2>
                  <h3>{item.price}€</h3>
                </div>
                <div className="item-action">
                  <label htmlFor={`quantity-dropdown-${item.id}`}>
                    Quantité :
                  </label>
                    <select
                      id={`quantity-dropdown-${item.id}`}
                      className="quantity-dropdown"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                    >
                    {[...Array(10)].map((_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                  <button
                  onClick={() => removeFromCart(item.id)}
                  className="cart-button"
                  >
                  Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}

      <h2 className="total-price">
        Total: {Math.round(totalPrice * 100) / 100}€
      </h2>
      <button
        onClick={handleConfirmCart}
        disabled={userCart.length === 0}
        className="submit-button"
      >
        Submit cart
      </button>
    </div>
  );
};

export default Cart;
