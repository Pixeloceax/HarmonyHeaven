import React from "react";
import WishlistService from "../../services/wishlist.service";
import IWishlistItem from "../../types/wishlist.type";
import "./wishlist.css";

interface Props {}

interface State {
  userWishlist: IWishlistItem[] | null;
  totalPrice: number;
}

class Wishlist extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      userWishlist: null,
      totalPrice: 0,
    };
  }

  async componentDidMount() {
    await this.fetchWishlist();
  }

  fetchWishlist = async () => {
    try {
      const wishlist = await WishlistService.getWishlist();
      console.log(wishlist)
      this.setState({ userWishlist: wishlist });
      this.calculateTotalPrice(wishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  removeFromWishlist = async (id: string) => {
    try {
      await WishlistService.removeFromWishlist(id);
      const updatedWishlist = this.state.userWishlist?.filter(
        (item) => item.id !== id
      );
      this.setState({ userWishlist: updatedWishlist ?? [] });
      this.calculateTotalPrice(updatedWishlist ?? []);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  addToCart = async (product: IWishlistItem) => {
    try {
      // Add logic to add the product to cart
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  calculateTotalPrice = (wishlist: IWishlistItem[] | null) => {
    if (!wishlist) return;
    let totalPrice = 0;
    wishlist.forEach((item) => {
      if (item.product && item.product.price) {
        totalPrice += item.product.price;
      }
    });
    this.setState({ totalPrice });
  };

  render() {
    const { userWishlist, totalPrice } = this.state;

    return (
      <div className="wishlist-container">
        {userWishlist &&
          userWishlist.map((item: IWishlistItem) => (
            <div key={item.id} className="wishlist-item">
              <div className="item-image">
                {item.product && (
                  <img src={item.product.image} alt={item.product.name} />
                )}
              </div>
              <div className="item-details">
                <h2>{item.product && item.product.name}</h2>
                <h3>{item.product && item.product.price}€/unit</h3>
              </div>
              <div className="item-actions">
                <button onClick={() => this.removeFromWishlist(item.id)}>
                  Remove
                </button>
                <button onClick={() => this.addToCart(item)}>
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
  }
}

export default Wishlist;
