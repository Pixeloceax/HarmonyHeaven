import React, { Component } from "react";
import IProduct from "../../../types/product.type";
import AdminService from "../../../services/AdminService";
import Loader from "../../loader/loader.component";
import { Link } from "react-router-dom";
import IGenre from "../../../types/genreType";
import IStyle from "../../../types/styleType";
import "../AdminBoard.css";
import { MdModeEditOutline, MdDelete } from "react-icons/md";

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
      const products = await AdminService.getAllProducts();
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
        <button className="add-product-btn-container">
          <Link to={`/admin/new-product`}>Add Product</Link>
        </button>
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
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {this.state.products.map((product: IProduct) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.slug}</td>
                  <td
                    dangerouslySetInnerHTML={
                      {
                        __html: product.description,
                      } as React.DetailedHTMLProps<
                        React.HTMLAttributes<HTMLParagraphElement>,
                        HTMLParagraphElement
                      >["dangerouslySetInnerHTML"]
                    }
                  ></td>
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
                      <button className="board-button board-edit-button"><MdModeEditOutline />Edit</button>
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        if (product.id !== undefined) {
                          AdminService.deleteProduct(product.id);
                        } else {
                          console.error("Product ID is undefined.");
                        }
                      }}
                      className="board-button board-delete-button"
                    >
                      <MdDelete />
                      Delete
                    </button>
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
