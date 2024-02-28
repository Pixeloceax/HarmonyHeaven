import WishlistService from "../../services/wishlist.service";
import IWishlistItem from "../../types/wishlist.type";
import React from "react";
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
      userWishlist: [],
      totalPrice: 0,
    };
  }

  async componentDidMount() {
    await this.fetchWishlist();
  }

  fetchWishlist = async () => {
    try {
      const wishlist = await WishlistService.getWishlist();
      this.setState({ userWishlist: wishlist });
      this.calculateTotalPrice(wishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  removeFromWishlist = async (product: IWishlistItem) => {
  try {
    // Check if product object is valid and has an 'id' property
    if (!product || !product.id) {
      console.error(
        "Error removing from wishlist: Product is undefined or does not have an 'id' property"
      );
      return; 
    }

    // Extract productId from the product object
    const productId = product.id;

    // Pass productId directly to removeFromWishlist function
    await WishlistService.removeFromWishlist(productId);

    // Update the state to reflect the removal
    const updatedWishlist =
      this.state.userWishlist?.filter((item) => item.id !== productId) ??
      null;
    this.setState({ userWishlist: updatedWishlist });
    this.calculateTotalPrice(updatedWishlist);
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
      totalPrice += item.price;
    });
    this.setState({ totalPrice });
  };

  render() {
    const { userWishlist, totalPrice } = this.state;

    return (
      <>
        <div className="wishlist-container">
          {userWishlist &&
            userWishlist.map((item: IWishlistItem) => (
              <div key={item.id} className="wishlist-item">
                <div className="item-image">
                  {item.image && <img src={item.image} alt={item.name} />}
                </div>
                <div className="item-details">
                  <h2>{item.name}</h2>
                  <h3>{item.price}€</h3>
                  <p>Artist: {item.artist}</p>
                </div>
                <div className="item-actions">
                  <button
                    className="wish-remove"
                    onClick={() => this.removeFromWishlist(item)}
                  >
                    Remove
                  </button>
                  <button
                    className="add-cart"
                    onClick={() => this.addToCart(item)}
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
      </>
    );
  }
}

export default Wishlist;
