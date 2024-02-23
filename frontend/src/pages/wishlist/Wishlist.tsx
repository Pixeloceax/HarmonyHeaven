import React from "react";
import cartService from "../../services/cart.service";
import WishlistService from "../../services/wishlist.service";
import IProduct from "../../types/product.type";
import IWishlistItem from "../../types/wishlist.type";
import "./wishlist.css";

type Props = object;
type State = {
  userWishlist: IWishlistItem[] | null;
  totalPrice: number;
};

export default class Wishlist extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      userWishlist: null,
      totalPrice: 0,
    };
  }

  componentDidMount() {
    this.fetchWishlist();
  }

  async fetchWishlist() {
    try {
      const wishlist = WishlistService.getWishlist();
      this.setState({ userWishlist: await wishlist });
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }

  removeFromWishlist = async (id: string) => {
    await WishlistService.removeFromWishlist(id);
    const updatedWishlist = this.state.userWishlist?.filter(
      (item) => item.product.id !== id
    );
    this.setState({ userWishlist: updatedWishlist });
  };

  addToCart = async (product: IProduct) => {
    try {
      cartService.addToCart(
        product.id,
        product.name,
        product.image,
        product.price
      );
      await this.removeFromWishlist(product.id);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  

  render() {
    const { userWishlist } = this.state;
    console.log(userWishlist);
    return (
      <div className="wishlist-container">
        {userWishlist?.map((item) => (
          <div className="item-image">
           {item.name}
          </div>
        ))}
        {/*        
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
                {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
                <button onClick={() => this.removeFromWishlist(item.id)}>
                  Remove
                </button>
                <button onClick={() => this.addToCart(item.product)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        <h2 className="total-price">
          Total: {Math.round(totalPrice * 100) / 100}€
        </h2> */}
      </div>
    );
  }
}
