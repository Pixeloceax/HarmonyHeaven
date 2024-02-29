import { Component } from "react";
import "./register.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthService from "../../services/auth.service";
import { emailValidation } from "../../utils/email-requirement.utils";
import { passwordValidation } from "../../utils/password-requirement.utils";
import Cat from "../../assets/images/cat.jpg";

type Props = object;

type State = {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  successful: boolean;
  message: string;
};

export default class Register extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);

    this.state = {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      successful: false,
      message: "",
    };
  }

  validationSchema() {
    return Yup.object().shape({
      username: Yup.string()
        .test(
          "len",
          "The username must be between 3 and 20 characters.",
          (val) => val && val.length >= 3 && val.length <= 20
        )
        .required("This field is required!"),
      email: emailValidation.emailValidation(),
      password: passwordValidation
        .passwordValidation()
        .required("This field is required!"),
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("This field is required!"),
    });
  }

  async handleRegister(formValue: {
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  }) {
    const { username, email, password } = formValue;

    this.setState({
      message: "",
      successful: false,
    });

    try {
      AuthService.register(username, email, password).then(
        (response) => {
          this.setState({
            message: response.data.message,
            successful: true,
          });
          window.location.href = "/login";
        },
        (error) => {
          let resMessage =
            error.response?.data?.message || error.message || error.toString();
          if (resMessage.includes("already in use")) {
            resMessage = "Email already in use";
          }

          this.setState({
            successful: false,
            message: resMessage,
          });
        }
      );
    } catch (error) {
      console.error("Error hashing password:", error);
    }
  }

  render() {
    const { successful, message } = this.state;

    const initialValues = {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    };

    return (
      <div className="register">
        <div className="space">
          <h1>Sign Up</h1>
          <p>Welcome to Harmony Heaven</p>
          <div className="register-container">
            <Formik
              initialValues={initialValues}
              validationSchema={this.validationSchema()}
              onSubmit={this.handleRegister}
            >
              <Form>
                {!successful && (
                  <div>
                    <div className="form-group">
                      <label htmlFor="username"> Username </label>
                      <Field
                        name="username"
                        type="text"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="error-danger"
                      />
                    </div>

                    <div className="register-group">
                      <label htmlFor="email"> Email </label>
                      <Field
                        name="email"
                        type="email"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="error-danger"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password"> Password </label>
                      <Field
                        name="password"
                        type="password"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="error-danger"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="passwordConfirmation">
                        {" "}
                        Confirm Password{" "}
                      </label>
                      <Field
                        name="passwordConfirmation"
                        type="password"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="passwordConfirmation"
                        component="div"
                        className="error-danger"
                      />
                    </div>

                    <div className="form-group">
                      <button type="submit" className="signup">
                        <span>Sign Up</span>
                      </button>
                    </div>
                  </div>
                )}

                {message && (
                  <div className="form-group">
                    <div
                      className={
                        successful
                          ? "alert alert-success"
                          : "alert alert-danger"
                      }
                      role="alert"
                    >
                      {message}
                    </div>
                  </div>
                )}
              </Form>
            </Formik>
          </div>
        </div>
        <div className="register-image-container">
          <img src={Cat} className="register-image" alt="register" />
        </div>
      </div>
    );
  }
}
