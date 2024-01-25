import { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthService from "../services/auth.service";

type Props = object;

type State = {
  username: string;
  email: string;
  password: string;
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (val: any) => val && val.length >= 3 && val.length <= 20
        )
        .required("This field is required!"),
      email: Yup.string()
        .email("This is not a valid email.")
        .required("This field is required!"),
      password: Yup.string()
        .test(
          "len",
          "The password must be between 6 and 40 characters.",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (val: any) => val && val.length >= 6 && val.length <= 40
        )
        .required("This field is required!"),
      adress: Yup.string()
        .test(
          "len",
          "The adress must be between 3 and 40 characters.",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (val: any) => val && val.length >= 3 && val.length <= 40
        )
        .required("This field is required!"),
      phone: Yup.string()
        .test(
          "len",
          "The phone must be between 10 and 15 characters.",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (val: any) => val && val.length >= 10 && val.length <= 15
        )
        .required("This field is required!"),
    });
  }

  handleRegister(formValue: {
    username: string;
    email: string;
    password: string;
    adress: string;
    phone: string;
  }) {
    const { username, email, password, adress, phone } = formValue;

    this.setState({
      message: "",
      successful: false,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    

      AuthService.register(username, email, password, adress, phone).then(
        (response) => {
          this.setState({
            message: response.data.message,
            successful: true,
          });
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage,
          });
        }
      );
    };
  

  render() {
     const { successful, message } = this.state; 

    const initialValues = {
      username: "",
      email: "",
      password: "",
      adress: "",
      phone: "",
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
            validationSchema={this.validationSchema}
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
                    <label htmlFor="adress"> Adress </label>
                    <Field name="adress" type="text" className="form-control" />
                    <ErrorMessage
                      name="adress"
                      component="div"
                      className="alert alert-danger"
                    />

                    <label htmlFor="phone"> Phone </label>
                    <Field name="phone" type="text" className="form-control" />
                    <ErrorMessage
                      name="phone"
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