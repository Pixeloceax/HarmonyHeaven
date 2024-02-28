import { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthService from "./services/auth.service";
import IUser from "./types/user.type";
import Login from "./components/Login/login.component";
import Register from "./components/Register/register.component";
import Home from "./pages/home/Home";
import UserBoardComponent from "./components/UserBoard/UserBoardComponent";
import Vinyls from "./pages/shop/Shop";
import Cart from "./components/cart/cart.component";
import Navbar from "./components/Navbar/Navbar.component";
import ForgotPassword from "./components/forgot-password/forgot-password.component";
import ResetPassword from "./pages/reset-password/reset-password.page";
import Debug from "./pages/debug/debug.page";
import Footer from "./components/Footer/footer.component";
import ProductDetail from "./components/ProductDetail/ProductDetail.component";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminBoardComponent from "./components/AdminBoard/AdminBoardComponent";
import AdminUpdateProduct from "./components/AdminBoard/ProductCRUD/UpdateProduct";
import CreateProduct from "./components/AdminBoard/ProductCRUD/CreateProduct";
import UpdateUser from "./components/AdminBoard/UserCRUD/UpdateUser";

type Props = object;

type State = {
  currentUser: IUser | null;
  isLogin: boolean;
};

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentUser: null,
      isLogin: false,
    };
  }

  async componentDidMount() {
    try {
      const user = await AuthService.getCurrentUser();

      if (user) {
        this.setState({
          currentUser: user,
          isLogin: true,
        });
      }
    } catch (error) {
      throw new Error("Error getting current user: " + error);
    }
  }

  render() {
    const { currentUser, isLogin } = this.state;

    return (
      <BrowserRouter>
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
          <Route path="/login" element={isLogin ? <Home /> : <Login />} />
          <Route path="/register" element={isLogin ? <Home /> : <Register />} />
          <Route
            path="/admin"
            element={
              currentUser?.roles && currentUser.roles.includes("ROLE_ADMIN") ? (
                <AdminBoardComponent />
              ) : (
                <Home />
              )
            }
          />

          <Route
            path="/admin/product/:productId"
            element={
              currentUser?.roles && currentUser.roles.includes("ROLE_ADMIN") ? (
                <AdminUpdateProduct />
              ) : (
                <Home />
              )
            }
          />

          <Route
            path="/admin/new-product"
            element={
              currentUser?.roles && currentUser.roles.includes("ROLE_ADMIN") ? (
                <CreateProduct />
              ) : (
                <Home />
              )
            }
          />

          <Route
            path="/admin/user/:userId"
            element={
              currentUser?.roles && currentUser.roles.includes("ROLE_ADMIN") ? (
                <UpdateUser />
              ) : (
                <Home />
              )
            }
          />

          <Route
            path="/user"
            element={isLogin ? <UserBoardComponent /> : <Login />}
          />

          <Route path="/shop" element={<Vinyls />} />
          <Route path="/shop/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/debug" element={<Debug />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    );
  }
}

export default App;
