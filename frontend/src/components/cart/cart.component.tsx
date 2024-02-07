import { useState, useEffect } from "react";
import cartService from "../../services/cart.service";
import IProduct from "../../types/product.type";

interface CartItem {
  product: IProduct;
  quantity: number;
}

const Cart = () => {
  const [userCart, setUserCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const cart = cartService.getCart();
    setUserCart(cart);
    calculateTotalPrice(cart);
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
    if (!localStorage.getItem("user")) {
      console.log("You need to be logged in to confirm your cart");
      window.location.href = "/login";
    } else {
      cartService.confirmCart();
    }
  };

  const removeFromCart = (id: string) => {
    cartService.removeFromCart(id);
    const cart = cartService.getCart();
    setUserCart(cart);
    calculateTotalPrice(cart);
  };

  return (
    <>
      {userCart.length === 0 && <h1>Votre panier est vide</h1>}
      {userCart.map((item: CartItem) => (
        <div key={item.product.id}>
          <div>
            <img src={item.product.image} alt={item.product.name} />
          </div>
          <div>
            <h2>{item.product.name}</h2>
            <h3>{item.product.price}€/u</h3>
          </div>
          <div>
            <label htmlFor="number-dd">Quantité :</label>
            <select
              className="quantity-dropdown"
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.product.id, Number(e.target.value))
              }
            >
              {(() => {
                const options = [];
                for (let i = 1; i <= 10; i++) {
                  options.push(
                    <option key={i} value={i}>
                      {i}
                    </option>
                  );
                }
                return options;
              })()}
            </select>
            <button onClick={() => removeFromCart(item.product.id)}>
              Remove
            </button>
          </div>
        </div>
      ))}
      <h2>Total: {Math.round(totalPrice * 100) / 100}€</h2>
      <button onClick={() => confirmCart()} disabled={userCart.length === 0}>
        Submit command
      </button>
    </>
  );
};

export default Cart;
