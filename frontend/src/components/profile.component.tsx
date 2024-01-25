import { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/use.type";

type Props = object;

type State = {
  redirect: string | null;
  userReady: boolean;
  currentUser: IUser | null;
};
export default class Profile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: null,
    };
  }

  async componentDidMount() {
    try {
      const currentUser = await AuthService.getCurrentUser();

      if (!currentUser) {
        this.setState({ redirect: "/home" });
      } else {
        this.setState({ currentUser, userReady: true });
      }
    } catch (error) {
      console.error("Error getting current user:", error);
    }
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }

    const { currentUser } = this.state;
    return (
      <div className="container">
        {this.state.userReady && currentUser != null ? (
          <div>
            <header>
              <h3>
                <strong>{currentUser.name}</strong> Profile
              </h3>
            </header>
            <p>
              <strong>Email:</strong> {currentUser.user}
            </p>
            <p>{currentUser.roles}</p>
            <p>{currentUser.address}</p>
            <p>{currentUser.phone}</p>
            <p>{currentUser.password}</p>
          </div>
        ) : null}
      </div>
    );
  }
}
