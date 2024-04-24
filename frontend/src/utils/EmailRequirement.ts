import * as Yup from "yup";

class EmailRequirement {
  public EmailValidation() {
    return Yup.string()
      .email("This is not a valid email.")
      .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Invalid email address.")
      .required("This field is required!");
  }
}

export const emailValidation = new EmailRequirement();
