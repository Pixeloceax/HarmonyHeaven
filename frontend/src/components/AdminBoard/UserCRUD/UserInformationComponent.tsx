import React, { Component } from "react";
import adminService from "../../../services/admin.service";
import AuthService from "../../../services/auth.service";
import IUser from "../../../types/user.type";
import Loader from "../../loader/loader.component";
import "../AdminBoard.css";
import { Link } from "react-router-dom";

type Props = object;
type State = {
  redirect: string | null;
  currentUser: IUser | null;
  error: string | null;
  message: string | null;
  getAllUsers: IUser[];
};

export default class UsersInformationComponent extends Component<Props, State> {
  constructor(props: object) {
    super(props);
    this.state = {
      redirect: null,
      currentUser: null,
      error: null,
      message: null,
      getAllUsers: [],
    };
  }

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
        });
      }
    } catch (err) {
      this.setState({ error: "Error getting current user: " + err });
    }
  }

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
                <th>Roles</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
              {getAllUsers.map((user) => (
                <tr>
                  <td>{user.name}</td>
                  <td>{user.user}</td>
                  <td>{user.address}</td>
                  <td>{user.phone}</td>
                  <td>{user.roles}</td>
                  <td>
                    <button className="board-edit-button">
                      <Link to={`/admin/user/${user.id}`}>Edit</Link>
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        adminService.deleteUser(user.id);
                      }}
                      className="board-edit-button"
                    >
                      Delete
                    </button>
                  </td>
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
