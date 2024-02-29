/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;

  readonly VITE_PUBLIC_LOGIN: string;
  readonly VITE_PUBLIC_REGISTER: string;

  

  readonly VITE_ADMIN_BACK_END_URL: string;
  readonly VITE_ADMIN_MANAGE_USERS: string;
  readonly VITE_ADMIN_MANAGE_PRODUCTS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
