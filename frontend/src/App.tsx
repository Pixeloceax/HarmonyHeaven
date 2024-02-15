import { Component } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthService from "./services/auth.service";
import IUser from "./types/use.type";
import Login from "./components/Login/login.component";
import Register from "./components/Register/register.component";
import Home from "./pages/home/Home";
import BoardUser from "./components/board-user.component";
import Product from "./pages/product/Product.page";
import Cart from "./components/cart/cart.component";
import Navbar from "./components/Navbar/Navbar.component";
import ForgotPassword from "./components/Password Reset/forgot-password.component";
import ResetPassword from "./pages/reset-password/reset-password.page";
import Debug from "./pages/debug/debug.page";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = object;

type State = {
  currentUser: IUser | null;
};

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentUser: null,
    };
  }

  async componentDidMount() {
    try {
      const user = await AuthService.getCurrentUser();

      if (user) {
        this.setState({
          currentUser: user,
        });
      }
    } catch (error) {
      console.error("Error getting current user:", error);
    }
  }

  render() {
    const { currentUser } = this.state;

    return (
      <BrowserRouter>
        <div>
          <Navbar />
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />} />
            <Route
              path="/login"
              element={currentUser ? <Navigate to="/" /> : <Login />}
            />
            <Route
              path="/register"
              element={currentUser ? <Navigate to="/" /> : <Register />}
            />
            <Route path="/user" element={<BoardUser />} />

            <Route path="/products" element={<Product />} />
            <Route path="/cart" element={<Cart />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/debug" element={<Debug />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
