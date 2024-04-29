import { Component } from "react";
import UserService from "../../services/UserService";

interface Props {
  userId: string;
}

export default class DeleteAccount extends Component<Props> {
  deleteUser = () => {
    console.log(this.props.userId);
    UserService.deleteUser(this.props.userId);
  };

  render() {
    return (
      <div className="delete-account-container">
        <button onClick={this.deleteUser} className="btn btn-primary">Delete Account</button>
      </div>
    );
  }
}
