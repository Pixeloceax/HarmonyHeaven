import React from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import IUser from "../types/use.type";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

function getAutocompleteValue(fieldName: string): string {
  switch (fieldName) {
    case "email":
      return "email";
    case "password":
      return "current-password";
    default:
      return "off";
  }
}

const validationSchema = Yup.object().shape({
  name: Yup.string(),
  user: Yup.string()
    .email()
    .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Invalid email address."),
  password: Yup.string()
    .min(12, "Password must be at least 12 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),
  address: Yup.string(),
  phone: Yup.string(),
});

type FormField = {
  label: string;
  name: keyof IUser;
};

const formFields: FormField[] = [
  { label: "Name", name: "name" },
  { label: "Email", name: "user" },
  { label: "Password", name: "password" },
  { label: "Address", name: "address" },
  { label: "Phone", name: "phone" },
];

class BoardUser extends React.Component<
  object,
  {
    redirect: string | null;
    currentUser: IUser | null;
    error: string | null;
    message: string | null;
    formData: Partial<IUser>;
  }
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

  async componentDidMount() {
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) {
        this.setState({ redirect: "/" });
      } else {
        this.setState({ currentUser: user, formData: user });
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
        console.log(updatedFields);
        this.setState({
          message: `Updated fields: ${updatedFieldNames.join(", ")}`,
        });
      }
    } catch (err) {
      this.setState({ error: "Update user error: " + err });
    }
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }

    if (this.state.error) {
      return <div>Error: {this.state.error}</div>;
    }

    const { currentUser } = this.state;

    if (!currentUser) {
      return <div>Loading...</div>;
    }
    delete currentUser.roles;

    return (
      <Formik<IUser>
        initialValues={{
          ...currentUser,
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={this.handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            {formFields.map((field: FormField) => (
              <div className="form-group" key={field.name}>
                <label htmlFor={field.name}>{field.label}</label>
                <Field
                  id={field.name}
                  type={field.label.toLowerCase()}
                  name={field.name}
                  className={`form-control ${
                    errors[field.name as keyof IUser] &&
                    touched[field.name as keyof IUser]
                      ? "is-invalid"
                      : ""
                  }`}
                  autoComplete={getAutocompleteValue(field.name)}
                />
                <ErrorMessage
                  name={field.name}
                  component="div"
                  className="invalid-feedback"
                />
              </div>
            ))}
            <button type="submit">Update</button>
            {this.state.message && <div>{this.state.message}</div>}
          </Form>
        )}
      </Formik>
    );
  }
}

export default BoardUser;
