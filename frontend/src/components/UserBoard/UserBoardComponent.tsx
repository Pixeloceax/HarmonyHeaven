import React, { Component } from "react";
import Loader from "../loader/loader.component";
import AuthService from "../../services/auth.service";
import "./UserBoard.css";
import OrderComponent from "./OrderComponent";
import PersonalInformationComponent from "./PersonalInformationComponent";
import PaymentMethodsComponent from "./PaymentMethodsComponent";
import PrintBillComponent from "./PrintBillComponent";
import IUser from "../../types/user.type";

type Props = object;

type State = {
  redirect: string | null;
  currentUser: IUser | null;
  error: string | null;
  message: string | null;
  selectedComponent: React.ReactNode | null;
};

export default class UserBoardComponent extends Component<Props, State> {
  constructor(props: object) {
    super(props);
    this.state = {
      redirect: null,
      currentUser: null,
      error: null,
      message: null,
      selectedComponent: null,
    };
  }

  async componentDidMount() {
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) {
        this.setState({ redirect: "/login" });
      } else {
        this.setState({
          currentUser: user,
        });
      }
    } catch (err) {
      this.setState({ error: "Error getting current user: " + err });
    }
  }

  render() {
    const { currentUser, selectedComponent } = this.state;
    const nav = [
      {
        title: "Personal Information",
        component: <PersonalInformationComponent />,
        desc: "Update your personal information",
      },
      {
        title: "Orders",
        component: <OrderComponent />,
        desc: "Check your orders",
      },
      {
        title: "Payment Methods",
        component: <PaymentMethodsComponent />,
        desc: "Add or remove payment methods",
      },
      {
        title: "Print bill",
        component: <PrintBillComponent />,
        desc: "Print your bill",
      },
    ];

    return (
      <React.Fragment>
        {currentUser ? (
          <div className="user-board-container">
            <div className="user-board-nav">
              <h2>My Profile</h2>
              <nav>
                <ul className="user-board-nav-items">
                  {nav.map((item, index) => {
                    return (
                      <li
                        key={index}
                        onClick={() =>
                          this.setState({ selectedComponent: item.component })
                        }
                      >
                        {item.title}
                        <p className="user-board-nav-desc">{item.desc}</p>
                      </li>
                    );
                  })}
                  <li onClick={() => AuthService.logout()}>Logout</li>
                </ul>
              </nav>
            </div>
            <div className="user-board-content">{selectedComponent}</div>
          </div>
        ) : (
          <Loader />
        )}
      </React.Fragment>
    );
  }
}
