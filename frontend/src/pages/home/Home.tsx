import { Component } from "react";
import UserService from "../../services/user.service";
import Navbar from "../../components/Navbar/Navbar.component";
import Footer from "../../components/Footer/footer.component";
import "./Home.css";

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
      <>
        <Navbar />
        <main className="main-content">
          <section className="container section-container">
            <div className="div-container">
              <h1 className="text-content">
                Harmony <br /> Heaven
              </h1>
            </div>
          </section>
          <section className="another-section">
            <div className="another-div">
              <h1 className="another-text">
                Welcome to Harmony Heaven, a place to share your music with the
                world.
              </h1>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }
}
