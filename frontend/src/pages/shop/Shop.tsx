import * as React from "react";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import IProduct from "../../types/product.type";
import cartService from "../../services/cart.service";
import shopService from "../../services/shop.service";
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
    shopService
  }




  render() {
    const { products, currentPage, productsPerPage } = this.state;

    // Pagination Logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products
      ? products.slice(indexOfFirstProduct, indexOfLastProduct)
      : [];

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
                  <button>favorite</button>
                  <button
                    onClick={() =>
                      cartService.addToCart(
                        product.id,
                        product.name as string,
                        product.image,
                        product.price as number
                      )
                    }
                  >
                    card
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="pagination">
          <Stack spacing={2}>
            <Pagination
              className="vinyls-pagination"
              count={
                products ? Math.ceil(products.length / productsPerPage) : 1
              }
              page={currentPage}
              onChange={handleChange}
              renderItem={(item) => (
                <PaginationItem component="button" {...item} />
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
