import  { Component } from "react";
import axios from 'axios';
import IProduct from "../../types/product.type";
import "./product.css"
import parse from 'html-react-parser';
import { CiHeart } from "react-icons/ci";
import { IoMdCart } from "react-icons/io";

// tout les arguments de ma classe seront des objets
type Props = object;

// typer les données avec un import déclaré ailleurs
type State = {
  products: IProduct[] | null;
};

// classe qui englobe mes fonctions
export default class Products extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      products: null,
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  async fetchProducts() {
    try {
      const response = await axios.get<IProduct[]>('http://127.0.0.1:8000/products-list');
      this.setState({ products: response.data });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  render() {
    const { products } = this.state;

    return (
      <div>
        <h1>Product List</h1>
        <div className="products-container">
            {products && products.map((product) => (
              <div key={product.id} className="single-product-card">
                <div className="product-img">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-description">
                  <h2>{product.name}</h2>
                  <h3>{product.artist} - Out of stock</h3>
                  <h3>{product.price} €</h3>
                  <h3>{parse(product.description || '')}</h3>
                </div>
                <div className="add-to-cart">
                  <button>
                    <CiHeart />
                  </button>
                  <button>
                    <IoMdCart />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}
