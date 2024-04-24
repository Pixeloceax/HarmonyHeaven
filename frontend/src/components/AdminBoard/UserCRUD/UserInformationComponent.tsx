import React, { Component } from "react";
import AdminService from "../../../services/AdminService";
import AuthService from "../../../services/AuthService";
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
      const getAllUsers = await AdminService.getAllUsers();
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
              <tbody>
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
                  <tr key={user.id}>
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
                          AdminService.deleteUser(user.id);
                        }}
                        className="board-edit-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <Loader />
        )}
      </React.Fragment>
    );
  }
}
