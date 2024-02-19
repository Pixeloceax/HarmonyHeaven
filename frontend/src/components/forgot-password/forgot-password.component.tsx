import { toast } from "react-toastify";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import AuthService from "../../services/auth.service";
import { emailValidation } from "../../utils/email-requirement.utils";

type State = {
  email: string;
  message: string;
};

const ForgotPassword: React.FC = () => {
  const handleForgotPassword = async (values: State) => {
    const response = await AuthService.forgotPassword(values.email);
    console.log(response);
    if (response.status === 200) {
      toast.success(response.data.message);
    } else if (response.status !== 200) {
      toast.error(response.data.message);
    }
  };

  const validationSchema = () => {
    return Yup.object().shape({
      email: emailValidation
        .emailValidation()
        .required("This field is required!"),
    });
  };

  const initialValues: State = {
    email: "",
    message: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleForgotPassword}
    >
      <Form className="form-container">
        <Field
          type="email"
          name="email"
          placeholder="Email"
          className="form-input-reset"
          required
        />
        <button type="submit" className="login-submit-button">
          Reset Password
        </button>
      </Form>
    </Formik>
  );
};

export default ForgotPassword;
