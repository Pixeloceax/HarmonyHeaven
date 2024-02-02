import React from "react";

class Navbar extends React.Component {
  render() {
    return (
      <header>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a href="/home" className="navbar-brand">
            Home
          </a>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <a href="/login" className="nav-link">
                login
              </a>
            </li>
            <li className="nav-item">
              <a href="/register" className="nav-link">
                register
              </a>
            </li>
            <li className="nav-item">
              <a href="/user" className="nav-link">
                User
              </a>
            </li>
          </div>
        </nav>
      </header>
    );
  }
}

export default Navbar;
