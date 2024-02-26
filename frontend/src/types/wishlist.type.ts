import IProduct from "./product.type";

export default interface IWishlistItem {
  product: IProduct;
  id: string;
  name: string;
  price: number;
  image: string;
  artist: string;
}
