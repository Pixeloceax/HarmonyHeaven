import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import shopService from "../../services/shop.service";
import IProduct from "../../types/product.type";
import IGenre from "../../types/genreType";
import IStyle from "../../types/styleType";

const AdminProductEdit = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await shopService.getProductById(Number(productId));
      setProduct(product);
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // handle change here
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <form
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <label>
            Nom du produit:
            <input type="text" name="name" value={product.name} />
          </label>
          <label>
            Prix du produit:
            <input type="number" name="price" value={product.price} />
          </label>
          <label>
            Description du produit:
            <input type="text" name="description" value={product.description} />
          </label>
          <label>
            Image du produit:
            <input type="text" name="image" value={product.image} />
          </label>
          <label>
            Stock du produit:
            <input type="number" name="stock" value={product.quantity} />
          </label>

          <label>
            Type du produit:
            <input type="text" name="type" value={product.type} />
          </label>

          <label>
            Label du produit:
            <input type="text" name="label" value={product.label} />
          </label>

          <label>
            Année du produit:
            <input type="number" name="year" value={product.year} />
          </label>

          <label>
            Pays du produit:
            <input type="text" name="country" value={product.country} />
          </label>

          <label>
            Format du produit:
            <input type="text" name="format" value={product.format} />
          </label>

          <label>
            Artiste du produit:
            <input type="text" name="artist" value={product.artist} />
          </label>

          <label>
            Genre du produit:
            {Array.isArray(product.genre) &&
              product.genre.map((genre: IGenre) => (
                <input
                  key={genre.name}
                  type="text"
                  name="genre"
                  value={genre.name}
                  onChange={handleChange}
                  readOnly
                />
              ))}
          </label>

          <label>
            Style du produit:
            {Array.isArray(product.style) &&
              product.style.map((style: IGenre) => (
                <input
                  key={style.name}
                  type="text"
                  name="style"
                  value={style.name}
                  onChange={handleChange}
                  readOnly
                />
              ))}
          </label>

          <button type="submit">Mettre à jour le produit</button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default AdminProductEdit;
