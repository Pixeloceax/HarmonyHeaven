import React, { Component } from "react";
import * as Yup from "yup";
import { passwordValidation } from "../../utils/PasswordRequirement";
import { emailValidation } from "../../utils/EmailRequirement";
import UserService from "../../services/UserService";
import AuthService from "../../services/AuthService";
import IUser from "../../types/user.type";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Loader from "../loader/loader.component";

type Props = object;
type State = {
  redirect: string | null;
  currentUser: IUser | null;
  error: string | null;
  message: string | null;

  formData: Partial<IUser>;
};

export default class PersonalInformationComponent extends Component<
  Props,
  State
> {
  constructor(props: object) {
    super(props);
    this.state = {
      redirect: null,
      currentUser: null,
      error: null,
      message: null,

      formData: {
        name: "",
        user: "",
        password: "",
        address: "",
        phone: "",
      },
    };
  }

  validationSchema = Yup.object().shape({
    name: Yup.string(),
    user: emailValidation.EmailValidation(),
    password: passwordValidation.PasswordValidation(),
    address: Yup.string(),
    phone: Yup.string(),
  });

  async componentDidMount() {
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) {
        this.setState({ redirect: "/login" });
      } else {
        this.setState({
          currentUser: user,
          formData: {
            name: user.name || "",
            user: user.user || "",
            password: user.password || "",
            address: user.address || "",
            phone: user.phone || "",
          },
        });
      }
    } catch (err) {
      this.setState({ error: "Error getting current user: " + err });
    }
  }

  handleSubmit = async (formData: Partial<IUser>) => {
    try {
      const updatedFields: Partial<IUser> = {};
      const updatedFieldNames: string[] = [];
      Object.keys(formData).forEach((key) => {
        if (
          formData[key as keyof IUser] !==
            this.state.currentUser?.[key as keyof IUser] &&
          formData[key as keyof IUser] !== "" &&
          formData[key as keyof IUser] !== undefined &&
          formData[key as keyof IUser] !== null
        ) {
          updatedFields[key as keyof IUser] = formData[key as keyof IUser];
          updatedFieldNames.push(key);
        }
      });
      if (Object.keys(updatedFields).length > 0) {
        await UserService.updateUserBoard(JSON.stringify(updatedFields));
        this.setState({
          message: `Updated fields: ${updatedFieldNames.join(", ")}`,
        });
      }
    } catch (err) {
      this.setState({ error: "Update user error: " + err });
    }
  };

  render() {
    const { currentUser } = this.state;

    return (
      <React.Fragment>
        <div className="user-board-information-container">
          {currentUser ? (
            <Formik
              initialValues={this.state.formData}
              validationSchema={this.validationSchema}
              onSubmit={this.handleSubmit}
            >
              {({ errors, touched, setFieldValue }) => (
                <Form>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <Field
                      type="text"
                      name="name"
                      className={
                        "form-control" +
                        (errors.name && touched.name ? " is-invalid" : "")
                      }
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                        if (e.target.value === "") {
                          setFieldValue(
                            "name",
                            this.state.currentUser?.name || ""
                          );
                        }
                      }}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="user">Email</label>
                    <Field
                      type="text"
                      name="user"
                      className={
                        "form-control" +
                        (errors.user && touched.user ? " is-invalid" : "")
                      }
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                        if (e.target.value === "") {
                          setFieldValue(
                            "user",
                            this.state.currentUser?.user || ""
                          );
                        }
                      }}
                    />
                    <ErrorMessage
                      name="user"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <Field
                      type="password"
                      name="password"
                      className={
                        "form-control" +
                        (errors.password && touched.password
                          ? " is-invalid"
                          : "")
                      }
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                        if (e.target.value === "") {
                          setFieldValue("password", "");
                        }
                      }}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <Field
                      type="text"
                      name="address"
                      className={
                        "form-control" +
                        (errors.address && touched.address ? " is-invalid" : "")
                      }
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                        if (e.target.value === "") {
                          setFieldValue(
                            "address",
                            this.state.currentUser?.address || ""
                          );
                        }
                      }}
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <Field
                      type="text"
                      name="phone"
                      className={
                        "form-control" +
                        (errors.phone && touched.phone ? " is-invalid" : "")
                      }
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                        if (e.target.value === "") {
                          setFieldValue(
                            "phone",
                            this.state.currentUser?.phone || ""
                          );
                        }
                      }}
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>

                  <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-user-board">
                      Update
                    </button>
                  </div>

                  {this.state.message && (
                    <div className="form-group">
                      <div className="alert alert-success" role="alert">
                        {this.state.message}
                      </div>
                    </div>
                  )}

                  {this.state.error && (
                    <div className="form-group">
                      <div className="alert alert-danger" role="alert">
                        {this.state.error}
                      </div>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          ) : (
            <>
              <Loader />
            </>
          )}
        </div>
      </React.Fragment>
    );
  }
}
