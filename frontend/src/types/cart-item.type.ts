import IProduct from "./product.type";
export default interface ICartItem {
  product: IProduct;
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}
