import React from 'react';
import AuthService from '../../services/auth.service';
import IUser from '../../types/use.type';
import "./Narvbar.css"

interface State {
  error: string | null;
  currentUser: IUser | null;
  isSticky: boolean;
}

class Navbar extends React.Component<object, State> {
  constructor(props: object) {
    super(props);
    this.state = {
      error: null,
      currentUser: null,
      isSticky: false,
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.fetchCurrentUser();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
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

  handleScroll() {
    if (window.scrollY > 0 && !this.state.isSticky) {
      this.setState({ isSticky: true });
    } else if (window.scrollY === 0 && this.state.isSticky) {
      this.setState({ isSticky: false });
    }
  }

  logout() {
    AuthService.logout();
    this.setState({ currentUser: null });
  }

  render() {
    const { currentUser, isSticky } = this.state;

    return (
      <header>
        <nav className={`navbar ${isSticky ? 'sticky' : ''}`}>
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
          </div>
        </nav>
      </header>
    );
  }
}

export default Navbar;
