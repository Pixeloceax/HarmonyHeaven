import React, { Component } from "react";
import IProduct from "../../../types/product.type";
import adminService from "../../../services/admin.service";
import Loader from "../../loader/loader.component";
import { Link } from "react-router-dom";
import IGenre from "../../../types/genreType";
import IStyle from "../../../types/styleType";
import "../AdminBoard.css";

type Props = object;

type State = {
  products: IProduct[];
};

export default class ProductComponent extends Component<Props, State> {
  constructor(props: object) {
    super(props);
    this.state = {
      products: [],
    };
  }

  async componentDidMount() {
    try {
      const products = await adminService.getAllProducts();
      const firstFiveProducts = products.slice(10, 15);
      this.setState({
        products: firstFiveProducts,
      });
    } catch (error) {
      console.error("Error getting all products: " + error);
    }
  }

  render() {
    const { products } = this.state;

    return (
      <React.Fragment>
        <h2>Products</h2>
        {products ? (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Type</th>
                <th>Label</th>
                <th>Year</th>
                <th>Country</th>
                <th>Format</th>
                <th>Artist</th>
                <th>Genre</th>
                <th>Style</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {this.state.products.map((product: IProduct) => (
                <tr key={product.id}>
                  <td>
                    <img
                      style={{ width: "100px" }}
                      src={product.image}
                      alt={product.name}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.slug}</td>
                  <td>{product.description}</td>
                  <td>{product.price}€</td>
                  <td>{product.quantity}</td>
                  <td>{product.type}</td>
                  <td>{product.label}</td>
                  <td>{product.year}</td>
                  <td>{product.country}</td>
                  <td>{product.format}</td>
                  <td>{product.artist}</td>
                  <td>
                    {Array.isArray(product.genre) &&
                      product.genre.map((genre: IGenre, index: number) => (
                        <p key={index}>{genre.name}</p>
                      ))}
                  </td>
                  <td>
                    {Array.isArray(product.style) &&
                      product.style.map((style: IStyle, index: number) => (
                        <p key={index}>{style.name}</p>
                      ))}
                  </td>
                  <td>
                    <Link to={`/admin/product/${product.id}`}>
                      <button className="board-edit-button">Edit</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Loader />
        )}
      </React.Fragment>
    );
  }
}
