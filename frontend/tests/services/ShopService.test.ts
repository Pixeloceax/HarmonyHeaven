/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { suite } from "vitest";
import ShopService from "../../src/services/ShopService";

const BACKEND_URL = (import.meta as any).env.VITE_BACKEND_URL;
const PRODUCTS_LIST = (import.meta as any).env.VITE_PUBLIC_PRODUCTS_LIST;
const PRODUCT_DETAIL = (import.meta as any).env.VITE_PUBLIC_PRODUCT_DETAILS;

const mock = new MockAdapter(axios);

suite("ShopService", (test) => {
  test("should fetch products from the backend", async () => {
    const products = [
      { id: 1, name: "Product 1", price: 10 },
      { id: 2, name: "Product 2", price: 20 },
    ];

    mock.onGet(`${BACKEND_URL}${PRODUCTS_LIST}`).reply(200, products);

    const result = await ShopService.getProducts();

    return JSON.stringify(result) === JSON.stringify(products);
  });

  test("should fetch product by ID from the backend", async () => {
    const productId = 1;
    const product = { id: productId, name: "Product 1", price: 10 };

    mock
      .onGet(`${BACKEND_URL}${PRODUCT_DETAIL}/${productId}`)
      .reply(200, product);

    const result = await ShopService.getProductById(productId);

    return JSON.stringify(result) === JSON.stringify(product);
  });

  test("should throw an error if fetching products fails", async () => {
    mock.onGet(`${BACKEND_URL}${PRODUCTS_LIST}`).reply(500);

    try {
      await ShopService.getProducts();
      return false;
    } catch (err) {
      return true;
    }
  });

  test("should throw an error if fetching product by ID fails", async () => {
    const productId = 1;
    mock.onGet(`${BACKEND_URL}${PRODUCT_DETAIL}/${productId}`).reply(404);

    try {
      await ShopService.getProductById(productId);
      return false;
    } catch (err) {
      return true;
    }
  });
});
