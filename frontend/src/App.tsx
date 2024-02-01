import { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthService from "./services/auth.service";
import IUser from "./types/use.type";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./pages/home/Home";
import BoardUser from "./components/board-user.component";

import EventBus from "./common/EventBus";

type Props = object;

type State = {
  showModeratorBoard: boolean;
  showAdminBoard: boolean;
  currentUser: IUser | null;
};

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
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

    EventBus.on("logout", this.logOut);
  }

  componentWillUnmount() {
    EventBus.remove("logout", this.logOut);
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: null,
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login history={[]} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user" element={<BoardUser />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
