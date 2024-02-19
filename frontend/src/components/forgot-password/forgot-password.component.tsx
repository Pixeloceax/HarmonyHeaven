import { Component } from "react";
import { toast } from "react-toastify";
import resetPasswordService from "../../services/resetPassword.service";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { emailValidation } from "../../utils/email-requirement.utils";

type Props = object;

type State = {
  email: string;
  message: string;
};

export default class ForgotPassword extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: "",
      message: "",
    };
  }
  handleForgotPassword = async (values: State) => {
    const response = await resetPasswordService.forgotPassword(values.email);
    if (response.status === 200) {
      toast.success(response.data.message);
    } else if (response.status !== 200) {
      toast.error(response.data.message);
    }
  };

  validationSchema = () => {
    return Yup.object().shape({
      email: emailValidation
        .emailValidation()
        .required("This field is required!"),
    });
  };

  initialValues: State = {
    email: "",
    message: "",
  };
  render() {
    return (
      <Formik
        initialValues={this.initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.handleForgotPassword}
      >
        <Form className="form-container">
          <Field
            type="email"
            name="email"
            placeholder="Email"
            className="reset-form-input"
            required
          />
          <ErrorMessage name="email" component="div" className="error" />

          <button type="submit" className="login-submit-button">
            Reset Password
          </button>
        </Form>
      </Formik>
    );
  }
}
