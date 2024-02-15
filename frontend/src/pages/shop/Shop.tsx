import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IProduct from "../../types/product.type";
import axios from "axios";
import "./shop.css";

type Props = object;  
type State = {
  currentPage: number;
  productsPerPage: number;
  products: IProduct[] | null;
};

export default class Vinyls extends React.Component<Props, State> {
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

  // Handle adding item to cart
  handleAddToCart(productId: number) {
    // Send request to add product to cart
    axios.post('http://127.0.0.1:8000/cart', {
      productId: productId,
      quantity: 1, // You can adjust the quantity as needed
    })
    .then(response => {
      console.log('Item added to cart:', response.data);
      // Handle success if needed (e.g., show a message to the user)
    })
    .catch(error => {
      console.error('Error adding item to cart:', error);
      // Handle error if needed
    });
  }

  render() {
    const { products, currentPage, productsPerPage } = this.state;

    // Pagination Logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products ? products.slice(indexOfFirstProduct, indexOfLastProduct) : [];

    // Change page
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
      this.setState({ currentPage: value });
    };

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
                  <button >favorite</button>
                   <button onClick={() => this.handleAddToCart(product.id)}>card</button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="pagination">
          <Stack spacing={2}>
            <Pagination
              className='vinyls-pagination'
              count={products ? Math.ceil(products.length / productsPerPage) : 1}
              page={currentPage}
              onChange={handleChange}
              renderItem={(item) => (
                <PaginationItem
                  component="button"
                  {...item}
                />
              )}
              prevIcon={<ArrowBackIcon />}
              nextIcon={<ArrowForwardIcon />}
            />
          </Stack>
        </div>
      </>
    );
  }
}
