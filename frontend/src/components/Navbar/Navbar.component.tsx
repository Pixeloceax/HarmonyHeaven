import "./Narvbar.css";
import { MdClose } from "react-icons/md";
import { CgMenuMotion } from "react-icons/cg";

const Navbar = () => {
  const NavLink = [
    "shop",
    "orders",
    "login",
    "user",
    "about",
    "logout",
    "register",
  ];

  function openNav() {
    const myNav = document.getElementById("myNav");
    if (myNav) {
      myNav.style.width = "100%";
    }
  }

  function closeNav() {
    const myNav = document.getElementById("myNav");
    if (myNav) {
      myNav.style.width = "0%";
    }
  }

  return (
    <>
      <div id="myNav" className="overlay">
        <button className="closebtn" onClick={closeNav}>
          <MdClose />
        </button>

        <div className="overlay-content">
          {NavLink.map((link, index) => (
            <li className="link-li" key={index}>
              <a className="link-effect" href={`/${link}`}>
                {link.toUpperCase()}
              </a>
            </li>
          ))}
        </div>
      </div>

      <nav className="navbar-container">
        <h1>
          <a className="logo" href="/">
            Navbar
          </a>
        </h1>
        <button className="openbtn" onClick={openNav}>
          <CgMenuMotion />
        </button>
      </nav>
    </>
  );
};

export default Navbar;
