import IProduct from "./product.type";

export default interface IWishlistItem {
  product: IProduct;
  id?: any;
  name?: string; 
  price?: any;
}
