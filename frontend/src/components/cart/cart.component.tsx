import AuthService from "../../services/auth.service";
import cartService from "../../services/cart.service";
import IProduct from "../../types/product.type";
import { useState, useEffect } from "react";
import IUser from "../../types/user.type";
import "./cart.css";

interface CartItem {
  product: IProduct;
  quantity: number;
}

const Cart = () => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [userCart, setUserCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      const cart = cartService.getCart();
      setUserCart(cart);
      calculateTotalPrice(cart);
    };
    fetchCart();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
      } catch (err) {
        setError("Error getting current user: " + err);
      }
    };
    fetchCurrentUser();
  }, []);

  const calculateTotalPrice = (cart: CartItem[]) => {
    const total = cart.reduce(
      (acc, item) => acc + (item.product.price ?? 0) * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    cartService.updateCartQuantityItem(id, newQuantity);
    const cart = cartService.getCart();
    setUserCart(cart);
    calculateTotalPrice(cart);
  };

  const confirmCart = () => {
    if (!currentUser) {
      window.location.href = "/login";
    } else {
      cartService.confirmCart();
    }
  };

  const removeFromCart = (id: number) => {
    cartService.removeFromCart(id);
    const cart = cartService.getCart();
    setUserCart(cart);
    calculateTotalPrice(cart);
  };

  const removeFromCartLogged = (id: number) => {
    cartService.removeFromCartLogged(id);
    const cart = cartService.getCart();
    setUserCart(cart);
    calculateTotalPrice(cart);
  };

  return (
    <div className="cart-container">
      {userCart.length === 0 && <h1>Your cart is empty, return to Shop?</h1>}
      {userCart.map((item: CartItem) => (
        <div className="item-container" key={item.product.id}>
          <div className="cart-item">
            <div className="item-image">
              <img
                className="cart-image"
                src={item.product.image}
                alt={item.product.name}
              />
            </div>
            <div className="item-details">
              <h2>{item.product.name}</h2>
              <h3>{item.product.price}€</h3>
            </div>
            <div className="item-actions">
              <label htmlFor={`quantity-dropdown-${item.product.id}`}>
                Quantité :
              </label>
              <select
                id={`quantity-dropdown-${item.product.id}`}
                className="quantity-dropdown"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.product.id!, Number(e.target.value))
                }
              >
                {[...Array(10)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  currentUser
                    ? removeFromCartLogged(item.product.id!)
                    : removeFromCart(item.product.id!);
                }}
                className="cart-button"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
      <h2 className="total-price">
        Total: {Math.round(totalPrice * 100) / 100}€
      </h2>
      <button
        onClick={confirmCart}
        disabled={userCart.length === 0}
        className="submit-button"
      >
        Submit cart
      </button>
    </div>
  );
};

export default Cart;
