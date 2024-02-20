import * as React from "react";
import { useState, useEffect } from "react";
import cartService from "../../services/cart.service";
import wishlistService from "../../services/wishlist.service";
import IProduct from "../../types/product.type";
import "./wishlist.css";

interface WishlistItem {
  product: IProduct;
  quantity: number;
}

const Wishlist: React.FC = () => {
  const [userWishlist, setUserWishlist] = useState<WishlistItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const wishlist = wishlistService.getWishlist();
    setUserWishlist(wishlist);
    calculateTotalPrice(wishlist);
  }, []);

  const calculateTotalPrice = (wishlist: WishlistItem[]) => {
    const total = wishlist.reduce(
      (acc, item) => acc + (item.product.price ?? 0) * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    wishlistService.updateWishlistQuantityItem(id, newQuantity);
    const wishlist = wishlistService.getWishlist();
    setUserWishlist(wishlist);
    calculateTotalPrice(wishlist);
  };

  const removeFromWishlist = (id: string) => {
    wishlistService.removeFromWishlist(id);
    const wishlist = wishlistService.getWishlist();
    setUserWishlist(wishlist);
    calculateTotalPrice(wishlist);
  };

  const addToCart = (
    id: string,
    name: string,
    image: string,
    price: number
  ) => {
    cartService.addToCart(id, name, image, price);
    removeFromWishlist(id); // Remove the product from the wishlist after adding to cart
  };

  return (
    <div className="wishlist-container">
      {userWishlist.length === 0 && <h1>Your wishlist is empty</h1>}
      {userWishlist.map((item: WishlistItem) => (
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
            <button
              onClick={() =>
                addToCart(
                  item.product.id,
                  item.product.name,
                  item.product.image,
                  item.product.price
                )
              }
            >
              Add to Cart
            </button>
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
