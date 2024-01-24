export default interface IUser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id?: any | null;
  username?: string | null;
  email?: string;
  password?: string;
  roles?: Array<string>;
}
