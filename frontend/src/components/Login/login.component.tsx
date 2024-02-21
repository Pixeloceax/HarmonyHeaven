import { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import "./login.css";
import Cat from "../../assets/images/cat.jpg";

import AuthService from "../../services/auth.service";

type Props = object;

type State = {
  username: string;
  password: string;
  loading: boolean;
  message: string;
};

export default class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);

    this.state = {
      username: "",
      password: "",
      loading: false,
      message: "",
    };
  }

  validationSchema() {
    return Yup.object().shape({
      email: Yup.string().required("This field is required!"),
      password: Yup.string().required("This field is required!"),
    });
  }

  handleLogin(formValue: { email: string; password: string }) {
    const { email, password } = formValue;

    this.setState({
      message: "",
      loading: true,
    });

    AuthService.login(email, password).then(
      () => {
        window.location.href = "/user";
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        this.setState({
          loading: false,
          message: resMessage,
        });
      }
    );
  }

  render() {
    const { loading, message } = this.state;

    const initialValues = {
      email: "",
      password: "",
    };

    return (
      <div className="login">
        <div className="space">
        <h1>Log In</h1>
              <p>Welcome to Harmony Heaven</p>
          <div className="login-form-container">
            <div className="title">
              
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={this.validationSchema}
              onSubmit={this.handleLogin}
            >
              <Form>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field className="form-input" name="email" type="text" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <div>
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <a className="forgot-password-link" href="/forgot-password">
                      Forgot Password?
                    </a>
                  </div>
                  <Field
                    className="form-input"
                    name="password"
                    type="password"
                  />
                  <ErrorMessage
                    className="error-message"
                    name="password"
                    component="div"
                  />
                </div>

                <div>
                  <div>
                    <Field type="checkbox" name="rememberMe" id="rememberMe" />
                    <label htmlFor="rememberMe">Remember Me</label>
                  </div>
                </div>

                <div>
                  <button
                    className="login-submit-button"
                    type="submit"
                    disabled={loading}
                  >
                    {loading && <span></span>}
                    <span>Login</span>
                  </button>
                </div>

                <div className="redirect-to-register">
                  <p>
                    Don't have an account ?{" "}
                    <a className="sign-up-link" href="/register">
                      Sign Up
                    </a>
                  </p>
                </div>

                {message && (
                  <div>
                    <div role="alert">{message}</div>
                  </div>
                )}
              </Form>
            </Formik>
          </div>
        </div>
        <div className="login-img">
          <img src={Cat} className="login-image" alt="login-image" />
        </div>
      </div>
    );
  }
}
