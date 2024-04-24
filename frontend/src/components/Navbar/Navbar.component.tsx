import { Component } from "react";
import AuthService from "../../services/AuthService";
import IUser from "../../types/user.type";
import "./Narvbar.css";
import logo from "../../assets/icons/png/LOGO sans texte.png";
import CartService from "../../services/CartService";
import { ImCart } from "react-icons/im";
import { GoHeartFill } from "react-icons/go";

interface State {
  error: string | null;
  currentUser: IUser | null;
  cartTotal: number;
}

class Navbar extends Component<object, State> {
  navLinks = ["home", "shop", "Wishlist", "orders", "user", "about"];

  constructor(props: object) {
    super(props);
    this.state = {
      error: null,
      currentUser: null,
      cartTotal: 0,
    };
    this.updateCartTotal = this.updateCartTotal.bind(this);
    this.logout = this.logout.bind(this);
  }

  async getCartTotal() {
    const cartTotal = await CartService.getCartTotalItems();
    this.setState({ cartTotal });
  }

  async componentDidMount() {
    this.fetchCurrentUser();
    CartService.subscribe(this.updateCartTotal);
  }

  componentWillUnmount() {
    CartService.unsubscribe(this.updateCartTotal);
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

  async updateCartTotal() {
    this.setState({ cartTotal: await CartService.getCartTotalItems() });
  }

  render() {
    const { currentUser, cartTotal } = this.state;
    return (
      <header>
        <nav className="navbar">
          <ul className="navbar-list">
            <div className="nav-icons">
              <li>
                <a className="navbar-cart" href="/cart">
                  <ImCart />
                  <p>{cartTotal}</p>
                </a>
              </li>
              <li>
                <a className="navbar-wishlist" href="/wishlist">
                  <GoHeartFill />
                </a>
              </li>
            </div>
            <li>
              <a className="navbar-logo" href="/">
                <img src={logo} alt="logo" />
              </a>
            </li>
            <li className="navbar-menu-button">
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
      </header>
    );
  }
}

export default Navbar;
