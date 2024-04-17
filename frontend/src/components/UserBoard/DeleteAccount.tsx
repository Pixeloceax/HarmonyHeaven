import { Component } from "react";
import userService from "../../services/user.service";

interface Props {
  userId: string;
}

export default class DeleteAccount extends Component<Props> {
  deleteUser = () => {
    console.log(this.props.userId);
    userService.deleteUser(this.props.userId);
  };

  render() {
    return (
      <div>
        <button onClick={this.deleteUser}>Delete Account</button>
      </div>
    );
  }
}
