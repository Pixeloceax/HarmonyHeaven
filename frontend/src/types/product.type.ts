export default interface IProduct {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: number;
  name: string;
  description?: string;
  price: number;
  image: string;
  type?: string;
  label?: string;
  year?: number;
  country?: string;
  format?: string;
  slug?: string;
  artist?: string;
  quantity?: number;
  genre?: string;
  style?: string;
}
