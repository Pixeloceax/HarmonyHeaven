import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import IUser from "../../types/user.type";
import "./Narvbar.css";
import logo from "../../assets/icons/png/LOGO sans texte.png";
import cartService from "../../services/cart.service";
import { ImCart } from "react-icons/im";

interface State {
  error: string | null;
  currentUser: IUser | null;
  isSticky: boolean;
  cartTotal: number;
}

class Navbar extends Component<object, State> {
  navLinks = ["home", "shop", "orders", "user", "about"];

  constructor(props: object) {
    super(props);
    this.state = {
      error: null,
      currentUser: null,
      isSticky: true,
      cartTotal: cartService.getCartTotalItems(), // Initialize with current cart total
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.updateCartTotal = this.updateCartTotal.bind(this);
  }

  componentDidMount() {
    this.fetchCurrentUser();
    window.addEventListener("scroll", this.handleScroll);
    cartService.subscribe(this.updateCartTotal); // Subscribe to cart changes
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    cartService.unsubscribe(this.updateCartTotal); // Unsubscribe from cart changes
  }

  async fetchCurrentUser() {
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        this.setState({ currentUser: user });
      }
    } catch (err) {
      this.setState({ error: "Error getting current user: " + err });
    }
  }

  logout() {
    AuthService.logout();
    this.setState({ currentUser: null });
  }

  openNav() {
    const navElement = document.getElementById("navElement");
    if (navElement) {
      navElement.style.width = "100%";
    }
  }

  closeNav() {
    const navElement = document.getElementById("navElement");
    if (navElement) {
      navElement.style.width = "0%";
    }
  }

  handleScroll() {
    const MIN_PAGE_HEIGHT = 20; // Adjust this value as needed
    const { isSticky } = this.state;

    if (window.scrollY > 40 && !isSticky) {
      this.setState({ isSticky: true });
    } else if (
      window.scrollY <= 50 &&
      isSticky &&
      window.innerHeight > MIN_PAGE_HEIGHT
    ) {
      this.setState({ isSticky: false });
    } else if (window.innerHeight <= MIN_PAGE_HEIGHT) {
      this.setState({ isSticky: true });
    }
  }

  updateCartTotal() {
    this.setState({ cartTotal: cartService.getCartTotalItems() }); // Update cart total
  }

  render() {
    const { currentUser, isSticky, cartTotal } = this.state;
    return (
      <>
        <nav className={`navbar ${isSticky ? "sticky" : ""}`}>
          <ul className="navbar-list">
            <li>
              <a className="navbar-cart" href="/cart">
                <ImCart />
                <p>{cartTotal}</p> {/* Display updated cart total */}
              </a>
            </li>
            <li>
              <a className="navbar-logo" href="/">
                <img src={logo} alt="logo" />
              </a>
            </li>
            <li>
              <button className="navbar-open-button" onClick={this.openNav}>
                menu
              </button>
            </li>
          </ul>

          <div id="navElement" className="navbar-overlay">
            <button className="navbar-close-button" onClick={this.closeNav}>
              close
            </button>

            <div className="navbar-overlay-content">
              <ul>
                {this.navLinks
                  .filter(
                    (link) => !["login", "register", "logout"].includes(link)
                  )
                  .map((link, index) => (
                    <li className="navbar-overlay-link-item" key={index}>
                      <a className="navbar-overlay-link" href={`/${link}`}>
                        {link.toUpperCase()}
                      </a>
                    </li>
                  ))}
                {currentUser ? (
                  <li className="navbar-overlay-link-item">
                    <a
                      className="navbar-overlay-link"
                      href="/logout"
                      onClick={this.logout}
                    >
                      LOGOUT
                    </a>
                  </li>
                ) : (
                  <>
                    <li className="navbar-overlay-link-item">
                      <a className="navbar-overlay-link" href="/login">
                        LOGIN
                      </a>
                    </li>
                    <li className="navbar-overlay-link-item">
                      <a className="navbar-overlay-link" href="/register">
                        REGISTER
                      </a>
                    </li>
                  </>
                )}
                <li className="navbar-overlay-link-item">
                  <a className="navbar-overlay-link" href="/contact">
                    CONTACT
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </>
    );
  }
}

export default Navbar;
