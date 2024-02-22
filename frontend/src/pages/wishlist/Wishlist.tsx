import * as React from "react";
import { useState, useEffect } from "react";
import cartService from "../../services/cart.service";
import wishlistService from "../../services/wishlist.service";
import IProduct from "../../types/product.type";
import IWishlistItem from "../../types/wishlist.type";
import "./wishlist.css";

const Wishlist: React.FC = () => {
  const [userWishlist, setUserWishlist] = useState<IWishlistItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlist = await wishlistService.getWishlist();
        setUserWishlist(wishlist);
        calculateTotalPrice(wishlist);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  const calculateTotalPrice = (wishlist: IWishlistItem[]) => {
    const total = wishlist.reduce(
      (acc, item) => acc + (item.product.price ?? 0) * (item.quantity ?? 1),
      0
    );
    setTotalPrice(total);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    wishlistService.updateWishlistQuantityItem(id, newQuantity);
    const updatedWishlist = userWishlist.map((item) =>
      item.product.id === id ? { ...item, quantity: newQuantity } : item
    );
    setUserWishlist(updatedWishlist);
    calculateTotalPrice(updatedWishlist);
  };

  const removeFromWishlist = async (id: string) => {
    await wishlistService.removeFromWishlist(id);
    const updatedWishlist = userWishlist.filter(
      (item) => item.product.id !== id
    );
    setUserWishlist(updatedWishlist);
    calculateTotalPrice(updatedWishlist);
  };

  const addToCart = async (product: IProduct) => {
    try {
      cartService.addToCart(product.id, product.name, product.image, product.price);
      await removeFromWishlist(product.id);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <div className="wishlist-container">
      {userWishlist.length === 0 && <h1>Your wishlist is empty</h1>}
      {userWishlist.map((item: IWishlistItem) => (
        <div key={item.product.id} className="wishlist-item">
          <div className="item-image">
            <img src={item.product.image} alt={item.product.name} />
          </div>
          <div className="item-details">
            <h2>{item.product.name}</h2>
            <h3>{item.product.price}€/unit</h3>
          </div>
          <div className="item-actions">
            <label htmlFor={`quantity-dropdown-${item.product.id}`}>
              Quantity:
            </label>
            <select
              id={`quantity-dropdown-${item.product.id}`}
              className="quantity-dropdown"
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.product.id, Number(e.target.value))
              }
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <button onClick={() => removeFromWishlist(item.product.id)}>
              Remove
            </button>
            <button onClick={() => addToCart(item.product)}>Add to Cart</button>
          </div>
        </div>
      ))}
      <h2 className="total-price">
        Total: {Math.round(totalPrice * 100) / 100}€
      </h2>
    </div>
  );
};

export default Wishlist;
