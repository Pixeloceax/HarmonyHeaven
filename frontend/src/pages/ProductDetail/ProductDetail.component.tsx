import React, { useState, useEffect } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import Loader from "../../components/loader/loader.component";
import ShopService from "../../services/ShopService";
import CartService from "../../services/CartService";
import IProduct from "../../types/product.type";
import { useParams } from "react-router-dom";
import "./ProductDetail.css";

interface Props extends WithTranslation {}

const ProductDetail: React.FC<Props> = ({ t }) => {
  const [thisProduct, setThisProduct] = useState<IProduct | null>(null);
  const { productId } = useParams<{ productId: string }>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await ShopService.getProductById(parseInt(productId));
        setThisProduct(product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!thisProduct) {
    return <Loader />;
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-images">
        <img
          className="PlaceholderImage"
          src={thisProduct.image || "https://via.placeholder.com/648x624"}
          alt={thisProduct.name}
        />
      </div>
      <div className="product-detail-informations">
        <h1 className="product-name">{thisProduct.name}</h1>
        <p className="product-price">{thisProduct.price}€</p>
        <div
          className="product-detail-description"
          dangerouslySetInnerHTML={
            {
              __html: thisProduct.description || "",
            } as React.HTMLProps<HTMLDivElement>["dangerouslySetInnerHTML"]
          }
        />

        <p className="product-info">Artist: {thisProduct.artist}</p>
        <p className="product-info">Country: {thisProduct.country}</p>
        <p className="product-info">Format: {thisProduct.format}</p>
        <p className="product-info">Label: {thisProduct.label}</p>
        <p className="product-info">Quantity: {thisProduct.quantity}</p>
        <p className="product-info">Year: {thisProduct.year || NaN}</p>
        <p className="product-info">Type: {thisProduct.type}</p>
        {Array.isArray(thisProduct.genre) &&
          thisProduct.genre.map((item, i) => (
            <p key={i} className="product-info">
              Genre: {item.name}
            </p>
          ))}
        {Array.isArray(thisProduct.style) &&
          thisProduct.style.map((item, i) => (
            <p key={i} className="product-info">
              Style: {item.name}
            </p>
          ))}
        <button
          onClick={() =>
            CartService.addToCart(
              thisProduct.id || 0,
              thisProduct.name || "",
              thisProduct.image || "",
              thisProduct.price || 0
            )
          }
          className="add-to-cart-btn"
        >
          {t("Add to Cart")}
        </button>
      </div>
    </div>
  );
};

export default withTranslation()(ProductDetail);
