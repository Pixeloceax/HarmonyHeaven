import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import WishlistService from "../../services/wishlist.service.ts";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import cartService from "../../services/cart.service.ts";
import IWishlistItem from "../../types/wishlist.type.ts";
import shopService from "../../services/shop.service";
import Pagination from "@mui/material/Pagination";
import IProduct from "../../types/product.type";
import { GoHeartFill } from "react-icons/go";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import { ImCart } from "react-icons/im";
import * as React from "react";
import "./shop.css";

type Props = object;
type State = {
  currentPage: number;
  productsPerPage: number;
  products: IProduct[] | null;
  scrolledDown: boolean;
};

export default class Vinyls extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: 1,
      productsPerPage: 9,
      products: null,
      scrolledDown: false,
    };
  }

  componentDidMount() {
    shopService
      .getProducts()
      .then((products) => {
        this.setState({ products });
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const { scrolledDown } = this.state;
    const threshold = 100;
    const isScrolled = window.scrollY > threshold;

    if (isScrolled !== scrolledDown) {
      this.setState({ scrolledDown: isScrolled });
    }
  };

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  render() {
    const { products, currentPage, productsPerPage, scrolledDown } = this.state;

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

    // Add product to wishlist
    const addToWishlist = (product: IProduct) => {
      const wishlistItem: IWishlistItem = {
        product: product || 0,
        id: product.id || 0,
        price: product.price || 0,
      };

      WishlistService.addToWishlist(wishlistItem.product.id); // Pass productId
    };

    return (
      <>
        <section className="vinyls-section">
          <div className="vinyls">
            {currentProducts.map((product, index) => (
              <div key={index} className="child-section">
                <img src={product.image} className="vinyl-cover" alt="cover" />
                <Link to={`/shop/${product.id}`}>
                  <p>{product.name}</p>
                </Link>
                <p>{product.artist}</p>
                <p>{product.price}€</p>
                <div className="buttons-div">
                  <button
                    onClick={() => addToWishlist(product)}
                    className="wishlist-button"
                  >
                    <GoHeartFill />
                  </button>
                  <button
                    onClick={() =>
                      cartService.addToCart(
                        product.id,
                        product.name,
                        product.image,
                        product.price
                      )
                    }
                    className="cart-button"
                  >
                    <ImCart />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        {scrolledDown && (
          <div className="scroll-to-top" onClick={this.scrollToTop}>
            <KeyboardArrowUpIcon />
          </div>
        )}
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
