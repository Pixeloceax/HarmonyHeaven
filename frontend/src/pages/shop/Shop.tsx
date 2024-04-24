import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import WishlistService from "../../services/wishlist.service.ts";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import cartService from "../../services/cart.service.ts";
import IWishlistItem from "../../types/wishlist.type.ts";
import AuthService from "../../services/auth.service.ts";
import shopService from "../../services/shop.service.ts";
import Pagination from "@mui/material/Pagination";
import IProduct from "../../types/product.type.ts";
import { GoHeartFill } from "react-icons/go";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import { ImCart } from "react-icons/im";
import * as React from "react";
import "./shop.css";

type Props = object;
type State = {
products: IProduct[] | null;
currentUser: boolean;
productsPerPage: number;
scrolledDown: boolean;
error: string | null;
currentPage: number;
cartTotal: number;
};

export default class Shop extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
        scrolledDown: false,
        productsPerPage: 9,
        currentUser: false,
        currentPage: 1,
        products: null,
        error: null,
        cartTotal: 0, // Ajoutez cette ligne
        };
    }

    componentDidMount() {
        this.fetchCurrentUser();
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

    async fetchCurrentUser() {
        try {
            const user = await AuthService.getCurrentUser();
        if (user) {
            this.setState({ currentUser: true });
        }
        } catch (err) {
            this.setState({ error: "Error getting current user: " + err });
        }
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

    async handleAddToCart(productId: number, productName: string, productImage: string, productPrice: number) {
        await cartService.addToCart(productId, productName, productImage, productPrice);
        const cartTotal = await cartService.getCartTotalItems();
        this.setState({ cartTotal });
    }
    
    

    render() {
    const { products, currentPage, productsPerPage, scrolledDown } = this.state;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products
    ? products.slice(indexOfFirstProduct, indexOfLastProduct)
    : [];

    // Change page
    const handleChange = (value?: number) => {
        if (typeof value === "number") {
          this.setState({ currentPage: value });
        }
      };
      


    // Add product to wishlist
    const addToWishlist = (product: IProduct) => {
    const wishlistItem: IWishlistItem = {
    product: product,
    id: product.id,
    price: product.price,
    name: "",
    image: "",
    artist: "",
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
                            onClick={() => this.handleAddToCart(
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
