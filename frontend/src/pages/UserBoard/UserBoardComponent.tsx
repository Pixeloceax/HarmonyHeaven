import { withTranslation, WithTranslation } from "react-i18next";
import PersonalInformationComponent from "./PersonalInformationComponent";
import PaymentMethodsComponent from "./PaymentMethodsComponent";
import PrintBillComponent from "./PrintBillComponent";
import AuthService from "../../services/AuthService";
import React, { useState, useEffect } from "react";
import Loader from "../../components/loader/loader.component";
import OrderComponent from "./OrderComponent";
import DeleteAccount from "./DeleteAccount";
import IUser from "../../types/user.type";
import "./UserBoard.css";

interface Props extends WithTranslation {}

const UserBoardComponent: React.FC<Props> = ({ t }) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<React.ReactNode | null>(null);
  const [redirect, setRedirect] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (!user) {
          setRedirect("/login");
        } else {
          setCurrentUser(user);
        }
      } catch (err) {
        setError("Error getting current user: " + err);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleComponentSelection = (component: React.ReactNode) => {
    setSelectedComponent(component);
  };

  const nav = [
    {
      title: t("Personal informations"),
      component: <PersonalInformationComponent />,
      desc: t("Update your personal informations"),
    },
    {
      title: t("Orders"),
      component: <OrderComponent />,
      desc: t("Check your orders"),
    },
    {
      title: t("Payment Methods"),
      component: <PaymentMethodsComponent />,
      desc: t("Add or remove payment methods"),
    },
    {
      title: t("Print a bill"),
      component: <PrintBillComponent />,
      desc: t("Print your bill"),
    },
    {
      title: t("Delete account"),
      component: currentUser && <DeleteAccount userId={currentUser.id} />,
      desc: t("Delete your account"),
    },
  ];

  if (redirect) {
    // Redirect logic can be added here
    return null;
  }

  return (
    <React.Fragment>
      {currentUser ? (
        <div className="user-board-container">
          <div className="user-board-nav">
            <h2>{t("My profil")}</h2>
            <nav>
              <ul className="user-board-nav-items">
                {nav.map((item, index) => (
                  <li key={index} onClick={() => handleComponentSelection(item.component)}>
                    {item.title}
                    <p className="user-board-nav-desc">{item.desc}</p>
                  </li>
                ))}
                <li onClick={() => AuthService.logout()}>{t("Logout")}</li>
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
};

export default withTranslation()(UserBoardComponent);
