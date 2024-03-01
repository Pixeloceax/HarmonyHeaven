/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;

  readonly VITE_PUBLIC_LOGIN: string;
  readonly VITE_PUBLIC_REGISTER: string;
  readonly VITE_PUBLIC_GENRES: string;
  readonly VITE_PUBLIC_SUBSCRIBE_EMAIL: string;
  readonly VITE_PUBLIC_FORGOT_PASSWORD: string;
  readonly VITE_PUBLIC_RESET_PASSWORD: string;
  readonly VITE_PUBLIC_CHECK_TOKEN: string;
  readonly VITE_PUBLIC_PRODUCTS_LIST: string;
  readonly VITE_PUBLIC_PRODUCT_DETAIL: string;

  readonly VITE_USER_GET_CURRENT_USER: string;
  readonly VITE_USER_USERBOARD: string;
  readonly VITE_USER_SUBMIT_CART: string;

  readonly VITE_ADMIN_BACKEND_URL: string;
  readonly VITE_ADMIN_MANAGE_USERS: string;
  readonly VITE_ADMIN_MANAGE_PRODUCTS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
