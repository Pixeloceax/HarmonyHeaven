/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ResetPasswordService from "../../services/ResetPasswordService";
import { toast } from "react-toastify";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { passwordValidation } from "../../utils/PasswordRequirement";
import "./reset-password.css";

type State = {
  password: string;
  confirmPassword: string;
  token: string | null;
};

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  const validationSchema = () => {
    return Yup.object().shape({
      password: passwordValidation
        .PasswordValidation()
        .required("This field is required!"),
      confirmPassword: passwordValidation
        .PasswordValidation()
        .required("This field is required!"),
    });
  };

  const initialValues: State = {
    password: "",
    confirmPassword: "",
    token: token || null,
  };

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          await ResetPasswordService.checkToken(token);
          if ((await ResetPasswordService.checkToken(token)).status != 200) {
            toast.error("Invalid token!");
          }
        } catch (error: any) {
          toast.error(error.response.data.message, {
            // Sans id le toast est rendu plusieurs fois.
            toastId: "error1",
          });
        }
      }
    };
    fetchData();
  }, [token]);

  const handleResetPassword = async (values: State) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (!token || token === null) {
      return;
    }
    try {
      const response = await ResetPasswordService.resetPassword(
        values.password,
        token
      );
      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error(
        "There was an error while trying to reset the password:",
        error
      );
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleResetPassword}
    >
      <Form className="form-container">
        <div className="reset-form-group">
          <Field
            type="password"
            name="password"
            placeholder="Your password"
            className="reset-form-input"
            required
          />
          <ErrorMessage name="password" component="div" className="error" />
        </div>
        <div className="reset-form-group">
          <Field
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            className="reset-form-input"
            required
          />
          <ErrorMessage
            name="confirmPassword"
            component="div"
            className="error"
          />
        </div>
        <button type="submit" className="login-submit-button">
          Submit
        </button>
      </Form>
    </Formik>
  );
};

export default ResetPassword;
