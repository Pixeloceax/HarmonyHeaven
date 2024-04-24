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
      <div>
        <button onClick={this.deleteUser}>Delete Account</button>
      </div>
    );
  }
}
