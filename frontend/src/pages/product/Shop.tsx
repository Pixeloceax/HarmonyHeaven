import React, { Component } from "react";
import IProduct from "../../types/product.type";
import axios from "axios";
import "./shop.css";

type Props = object;
type State = {
  currentPage: number;
  productsPerPage: number;
  products: IProduct[] | null;
};

export default class Vinyls extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: 1,
      productsPerPage: 6,
      products: null,
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  async fetchProducts() {
    try {
      const response = await axios.get<IProduct[]>(
        "http://127.0.0.1:8000/products-list"
      );

      this.setState({ products: response.data });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  render() {
    const { products, currentPage, productsPerPage } = this.state;

    // Pagination Logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products ? products.slice(indexOfFirstProduct, indexOfLastProduct) : [];

    // Change page
    const paginate = (pageNumber: number) => this.setState({ currentPage: pageNumber });

    return (
      <>
        <section className="vinyls-section">
          <div className="vinyls">
            {currentProducts.map((product, index) => (
              <div key={index} className="child-section">
                <img src={product.image} className="vinyl-cover" alt="cover" />
                <p>{product.name}</p>
                <p>{product.artist}</p>
                <p>{product.price}€</p>
                <div className="buttons-div">
                  <button>favorite</button>
                  <button>card</button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="pagination">
          {products &&
            Array.from({ length: Math.ceil(products.length / productsPerPage) }).map((_, index) => (
              <button key={index} onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            ))}
        </div>
      </>
    );
  }
}
