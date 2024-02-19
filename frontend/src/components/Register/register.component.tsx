import { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthService from "../../services/auth.service";
import bcrypt from "bcryptjs";

type Props = object;

type State = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string; 
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
      confirmPassword: "", 
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
          (val: any) => val && val.length >= 3 && val.length <= 20
        )
        .required("This field is required!"),
      email: Yup.string()
        .email("This is not a valid email.")
        .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Invalid email address.")
        .required("This field is required!"),
      password: Yup.string()
        .min(12, "Password must be at least 12 characters long")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{13,}$/,
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
        )
        .required("This field is required!"),
      confirmPassword: Yup.string() 
        .oneOf([Yup.ref("password"), null], "Passwords must match") 
        .required("This field is required!"),
    });
  }

  async handleRegister(formValue: {
    username: any;
    email: any;
    password: any;
  }) {
    const { username, email, password } = formValue;

    this.setState({
      message: "",
      successful: false,
    });

    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

      AuthService.register(username, email, hashedPassword).then(
        (response) => {
          console.log("ici", hashedPassword);
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
      confirmPassword: "", // Initialize confirmPassword in initialValues
    };

    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

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
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email"> Email </label>
                    <Field name="email" type="email" className="form-control" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="alert alert-danger"
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
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword"> Confirm Password </label>
                    <Field
                      name="confirmPassword"
                      type="password"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block">
                      Sign Up
                    </button>
                  </div>
                </div>
              )}

              {message && (
                <div className="form-group">
                  <div
                    className={
                      successful ? "alert alert-success" : "alert alert-danger"
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
    );
  }
}
