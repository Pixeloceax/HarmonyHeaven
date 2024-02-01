import { Component } from "react";
import UserService from "../../services/user.service";
import "./Home.css";
import HH_header from "../../assets/images/HH_header.png";

type Props = object;

type State = {
  content: string;
};

export default class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: "",
    };
  }

  componentDidMount() {
    UserService.getPublicContent().then(
      (response) => {
        this.setState({
          content: response.data,
        });
      },
      (error) => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }

  render() {
    return (
      <div className="containt">
        <div className="Mainheader">
          <img src={HH_header} className="neon" />
        </div>
        <main>main</main>
        <footer>footer</footer>
      </div>
    );
  }
}
