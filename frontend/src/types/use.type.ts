export default interface IUser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id?: any;
  name?: string;
  user?: string;
  address: string;
  phone: string;
  password?: string;
  roles?: Array<string>;
}
