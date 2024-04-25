import { withTranslation, WithTranslation } from "react-i18next";
import logo from "../../assets/icons/png/LOGO sans texte.png";
import AuthService from "../../services/AuthService";
import CartService from "../../services/CartService";
import { GoHeartFill } from "react-icons/go";
import { useEffect, useState } from "react";
import IUser from "../../types/user.type";
import { ImCart } from "react-icons/im";
import "./Narvbar.css";

interface Props extends WithTranslation {}

const Navbar: React.FC<Props> = ({ t }) => {
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [cartTotal, setCartTotal] = useState<number>(
    CartService.getCartTotalItems()
  );

  const navLinks: string[] = [
    "home",
    "shop",
    "Wishlist",
    "orders",
    "profil",
    "about",
  ];

  const fetchCurrentUser = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    } catch (err) {
      setError("Error getting current user: " + err);
    }
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  const openNav = () => {
    const navElement = document.getElementById("navElement");
    if (navElement) {
      navElement.style.width = "100%";
    }
  };

  const closeNav = () => {
    const navElement = document.getElementById("navElement");
    if (navElement) {
      navElement.style.width = "0%";
    }
  };

  const updateCartTotal = () => {
    setCartTotal(CartService.getCartTotalItems());
  };

  useEffect(() => {
    fetchCurrentUser();
    CartService.subscribe(updateCartTotal);
    return () => {
      CartService.unsubscribe(updateCartTotal);
    };
  }, []);

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
            <button className="navbar-open-button" onClick={openNav}>
              menu
            </button>
          </li>
        </ul>

        <div id="navElement" className="navbar-overlay">
          <button className="navbar-close-button" onClick={closeNav}>
            {t("close")}
          </button>

          <div className="navbar-overlay-content">
            <ul>
              {navLinks.map((link, index) => (
                <li className="navbar-overlay-link-item" key={index}>
                  <a className="navbar-overlay-link" href={`/${link}`}>
                    {t(link).toUpperCase()}
                  </a>
                </li>
              ))}
              {currentUser ? (
                <li className="navbar-overlay-link-item">
                  <a
                    className="navbar-overlay-link"
                    href="/logout"
                    onClick={logout}
                  >
                    {t("LOGOUT")}
                  </a>
                </li>
              ) : (
                <>
                  <li className="navbar-overlay-link-item">
                    <a className="navbar-overlay-link" href="/login">
                      {t("LOGIN")}
                    </a>
                  </li>
                  <li className="navbar-overlay-link-item">
                    <a className="navbar-overlay-link" href="/register">
                      {t("REGISTER")}
                    </a>
                  </li>
                </>
              )}
              <li className="navbar-overlay-link-item">
                <a className="navbar-overlay-link" href="/contact">
                  {t("CONTACT")}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default withTranslation()(Navbar);
