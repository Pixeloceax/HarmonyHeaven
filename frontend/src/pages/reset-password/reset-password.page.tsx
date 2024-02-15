import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthService from "../../services/auth.service";
import axios from "axios";
import { toast } from 'react-toastify';
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import './reset-password.css'

type State = {
  password: string;
  confirmPassword: string;
  token: string | null;
};

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const BACKEND_URL = "http://localhost:8000";
  console.log(token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.post(BACKEND_URL + "/check-token", { token });
      } catch (error: any) {
        toast.error(error.response.data.message, {
          // Sans id le toast est rendu plusieurs fois.
          toastId: 'error1',
        });
      }
    };
    fetchData();
  }, [token]);

  const handleResetPassword = async (values: State) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    if (!token || token === null) {
      return;
    }
    try {
      const response = await AuthService.resetPassword(values.password, token);
      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
      console.error('Erreur lors de la réinitialisation du mot de passe :', error);
    }
  };

  const validationSchema = () => {
    return Yup.object().shape({
      password: Yup.string().required("This field is required!"),
      confirmPassword: Yup.string().required("This field is required!"),
    });
  };

  const initialValues: State = {
    password: "",
    confirmPassword: "",
    token: token || null,
  };
  

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleResetPassword}>
      <Form className="form-container">
      <Field
        type="password"
        name="password"
        placeholder="Your password"
        className="form-input-reset"
        required
      />
      <Field
        type="password"
        name="confirmPassword"
        placeholder="Confirm your password"
        className="form-input-reset"
        required
      />
      <button type="submit" className="login-submit-button">Submit</button>
      </Form>
    </Formik>
  );
};

export default ResetPassword;
