import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import shopService from "../../../services/shop.service";
import IProduct from "../../../types/product.type";
import IGenre from "../../../types/genreType";
import IStyle from "../../../types/styleType";
import Loader from "../../loader/loader.component";
import adminService from "../../../services/admin.service";

const UpdateProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [changes, setChanges] = useState<Partial<IProduct>>({});

  const fields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Image", name: "image", type: "text" },
    { label: "Description", name: "description", type: "text" },
    { label: "Price", name: "price", type: "number" },
    { label: "Stock", name: "quantity", type: "number" },
    { label: "Type", name: "type", type: "text" },
    { label: "Label", name: "label", type: "text" },
    { label: "Year", name: "year", type: "number" },
    { label: "Country", name: "country", type: "text" },
    { label: "Format", name: "format", type: "text" },
    { label: "Artist", name: "artist", type: "text" },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await shopService.getProductById(Number(productId));
        setProduct(product);
      } catch (error) {
        throw new Error("Error getting product: " + error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (product) {
        const { name, value } = event.target;
        setProduct({
          ...product,
          [name]: value,
        });
        setChanges({
          ...changes,
          [name]: value,
        });
      }
    },
    [product, changes]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      console.log(changes);
      await adminService.updateProductsInformation(
        Number(productId),
        JSON.stringify(changes)
      );
    } catch (error) {
      throw new Error("Error updating product: " + error);
    }
  };

  if (!product) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <div className="board-container">
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <label key={field.name}>
              {field.label}:
              <input
                type={field.type}
                name={field.name}
                value={product[field.name as keyof IProduct]}
                onChange={handleChange}
              />
            </label>
          ))}
          <label>
            Genre du produit:
            {Array.isArray(product.genre) &&
              product.genre.map((genre: IGenre) => (
                <input
                  key={genre.name}
                  type="text"
                  name="genre"
                  value={genre.name}
                  readOnly
                />
              ))}
          </label>

          <label>
            Style du produit:
            {Array.isArray(product.style) &&
              product.style.map((style: IStyle) => (
                <input
                  key={style.name}
                  type="text"
                  name="style"
                  value={style.name}
                  readOnly
                />
              ))}
          </label>
          <button type="submit">Update product</button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default UpdateProduct;
