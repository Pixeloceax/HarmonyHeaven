import IProduct from "./product.type";
export default interface ICartItem {
  product: IProduct;
  quantity: number;
}
