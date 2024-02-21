import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import shopService from "../../services/shop.service";
import IProduct from "../../types/product.type";
import Loader from "../loader/loader.component";
import cartService from "../../services/cart.service";
import "./ProductDetail.css";

const ProductDetail = () => {
  const [thisProduct, setThisProduct] = useState<IProduct | null>(null);
  const getProductId = useParams();

  if (getProductId.productId === undefined) {
    try {
      throw new Error("Product ID is undefined");
    } catch (error) {
      throw new Error("Product ID is undefined");
    }
  }

  const productId: number = parseInt(getProductId.productId);

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await shopService.getProductById(productId);

      setThisProduct(product);
    };

    fetchProduct();
  }, [productId]);

  if (!thisProduct) {
    return (
      <React.Fragment>
        <Loader />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="product-detail-container">
        <div className="product-detail-images">
          <img src={thisProduct.image} alt={thisProduct.name} />
        </div>
        <div className="product-detail-informations">
          <p className="product-name">{thisProduct.name}</p>
          <p className="product-price">{thisProduct.price}€</p>
        </div>
        <div className="product-detail-description">
          <p className="product-description">{thisProduct.description}</p>
        </div>
        <p className="product-info">Artist: {thisProduct.artist}</p>
        <p className="product-info">Country: {thisProduct.country}</p>
        <p className="product-info">Format: {thisProduct.format}</p>
        <p className="product-info">Label: {thisProduct.label}</p>
        <p className="product-info">Quantity: {thisProduct.quantity}</p>
        <p className="product-info">
          Year: {(thisProduct.year = thisProduct.year || NaN)}
        </p>
        <p className="product-info">Type: {thisProduct.type}</p>
        {Array.isArray(thisProduct.genre) &&
          thisProduct.genre.map((item: { name: string }, i: number) => (
            <p key={i} className="product-info">
              Genre: {item.name}
            </p>
          ))}
        {Array.isArray(thisProduct.style) &&
          thisProduct.style.map((item: { name: string }, i: number) => (
            <p key={i} className="product-info">
              Style: {item.name}
            </p>
          ))}

        <button
          onClick={() =>
            cartService.addToCart(
              thisProduct.id,
              thisProduct.name as string,
              thisProduct.image,
              thisProduct.price as number
            )
          }
          className="add-to-cart-btn"
        >
          Add to Cart
        </button>
      </div>
    </React.Fragment>
  );
};

export default ProductDetail;
