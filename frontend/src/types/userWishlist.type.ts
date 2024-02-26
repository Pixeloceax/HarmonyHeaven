import IWishlistItem from "./wishlist.type";

export default interface State {
  userWishlist: IWishlistItem[] | null;
  totalPrice: number;
}
