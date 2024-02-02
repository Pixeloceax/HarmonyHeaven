import { Component } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthService from "./services/auth.service";
import IUser from "./types/use.type";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./pages/home/Home";
import BoardUser from "./components/board-user.component";

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
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
