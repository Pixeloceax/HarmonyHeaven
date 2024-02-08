import React from "react";
import AuthService from "../../services/auth.service";
import IUser from "../../types/use.type";

class Navbar extends React.Component<
  object,
  {
    error: string | null;
    currentUser: IUser | null;
  }
> {
  constructor(props: object) {
    super(props);
    this.state = {
      error: null,
      currentUser: null,
    };
  }

  logout() {
    AuthService.logout();
    this.setState({ currentUser: null });
  }

  async componentDidMount() {
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        this.setState({ currentUser: user });
      }
    } catch (err) {
      this.setState({ error: "Error getting current user: " + err });
    }
  }

  render() {
    const { currentUser } = this.state;

    return (
      <header>
        <nav className="navbar">
          <a href="/" className="navbar-brand">
            Home
          </a>
          <div className="navbar-nav mr-auto">
            {currentUser ? (
              <>
                <li className="nav-item">
                  <a href="/user" className="nav-link">
                    User
                  </a>
                </li>
                <li>
                  <button className="logout" onClick={() => this.logout()}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a href="/login" className="nav-link">
                    Login
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/register" className="nav-link">
                    Register
                  </a>
                </li>
              </>
            )}

            <li className="nav-item">
              <a href="/products" className="nav-link">
                Products
              </a>
            </li>

            <li className="nav-item">
              <a href="/cart">
                <img
                  src="https://img.icons8.com/material-outlined/24/000000/shopping-cart.png"
                  alt="cart"
                  className="cart-icon"
                  style={{ filter: "invert(100%)" }}
                />
              </a>
            </li>
          </div>
        </nav>
      </header>
    );
  }
}

export default Navbar;
