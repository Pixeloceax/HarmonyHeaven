import { Component } from "react";

import { MdClose } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import { IoCart } from "react-icons/io5";
import AuthService from "../../services/auth.service";
import IUser from "../../types/use.type";
import "./Narvbar.css";
import logo from "../../assets/icons/png/LOGO sans texte.png";

interface State {
  error: string | null;
  currentUser: IUser | null;
  isSticky: boolean;
}

class Navbar extends Component<object, State> {
  navLinks = ["home", "shop", "orders", "user", "about"];

  constructor(props: object) {
    super(props);
    this.state = {
      error: null,
      currentUser: null,
      isSticky: false,
    };
  }

  componentDidMount() {
    this.fetchCurrentUser();
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
  render() {
    const { currentUser } = this.state;
    return (
      <>
        <nav className="navbar">
          <h1>
            <a className="navbar-logo" href="/">
              <img src={logo} alt="logo" />
            </a>
          </h1>
          <div className="navbar-link-container">
            <ul className="navbar-list">
              <li className="navbar-item">
                <a href="/cart">
                  <IoCart className="icon" />
                </a>
              </li>
              <li className="navbar-item">
                <button className="navbar-open-button" onClick={this.openNav}>
                  <IoMenu className="icon" />
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <div id="navElement" className="navbar-overlay">
          <button className="navbar-close-button" onClick={this.closeNav}>
            <MdClose />
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
      </>
    );
  }
}

export default Navbar;
