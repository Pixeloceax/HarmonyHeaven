import "./Narvbar.css";
import { MdClose } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import { IoCart } from "react-icons/io5";

import logo from "../../assets/icons/png/LOGO sans texte.png";

const Navbar = () => {
  const navLinks = [
    "home",
    "shop",
    "orders",
    "login",
    "user",
    "about",
    "logout",
    "register",
    "contact",
  ];

  function openNav() {
    const navElement = document.getElementById("navElement");
    if (navElement) {
      navElement.style.width = "100%";
    }
  }

  function closeNav() {
    const navElement = document.getElementById("navElement");
    if (navElement) {
      navElement.style.width = "0%";
    }
  }

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
              <button className="navbar-open-button" onClick={openNav}>
                <IoMenu className="icon" />
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <div id="navElement" className="navbar-overlay">
        <button className="navbar-close-button" onClick={closeNav}>
          <MdClose />
        </button>

        <div className="navbar-overlay-content">
          <ul>
            {navLinks.map((link, index) => (
              <li className="navbar-overlay-link-item" key={index}>
                <a className="navbar-overlay-link" href={`/${link}`}>
                  {link.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
