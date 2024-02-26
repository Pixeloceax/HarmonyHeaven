import React, { Component } from "react";
import * as Yup from "yup";
import { passwordValidation } from "../../utils/password-requirement.utils";
import { emailValidation } from "../../utils/email-requirement.utils";
import adminService from "../../services/admin.service";
import AuthService from "../../services/auth.service";
import IUser from "../../types/user.type";
import Loader from "../loader/loader.component";
import "./AdminBoard.css";

type Props = object;
type State = {
  redirect: string | null;
  currentUser: IUser | null;
  error: string | null;
  message: string | null;
  getAllUsers: IUser[];
  formData: Partial<IUser>;
};

export default class UsersInformationComponent extends Component<
  Props,
  State
> {
  constructor(props: object) {
    super(props);
    this.state = {
      redirect: null,
      currentUser: null,
      error: null,
      message: null,
      getAllUsers: [],
      formData: {
        name: "",
        user: "",
        password: "",
        address: "",
        phone: "",
      },
    };
  }

  validationSchema = Yup.object().shape({
    name: Yup.string(),
    user: emailValidation.emailValidation(),
    password: passwordValidation.passwordValidation(),
    address: Yup.string(),
    phone: Yup.string(),
  });

  async componentDidMount() {
    try {
      const getAllUsers = await adminService.getAllUsers();
      const user = await AuthService.getCurrentUser();
      if (!user || !getAllUsers) {
        this.setState({ redirect: "/login" });
      } else {
        this.setState({
          currentUser: user,
          getAllUsers: getAllUsers,
          formData: {
            name: user.name || "",
            user: user.user || "",
            password: user.password || "",
            address: user.address || "",
            phone: user.phone || "",
          },
        });
      }
    } catch (err) {
      this.setState({ error: "Error getting current user: " + err });
    }
  }

  handleEdit = (user: IUser) => {
    this.setState({
      formData: {
        name: user.name || "",
        user: user.user || "",
        password: user.password || "",
        address: user.address || "",
        phone: user.phone || "",
      },
    });
  };

  render() {
    const { currentUser, getAllUsers } = this.state;

    return (
      <React.Fragment>
        {currentUser || getAllUsers ? (
          <>
            <h1>info</h1>
            <table>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Phone</th>
              </tr>
              {getAllUsers.map((user) => (
                <tr>
                  <td>{user.name}</td>
                  <td>{user.user}</td>
                  <td>{user.address}</td>
                  <td>{user.phone}</td>
                </tr>
              ))}
            </table>
          </>
        ) : (
          <Loader />
        )}
      </React.Fragment>
    );
  }
}
