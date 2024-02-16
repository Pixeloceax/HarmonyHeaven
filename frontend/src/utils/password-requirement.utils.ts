import * as Yup from "yup";

class passwordRequirment {
  private readonly regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{13,}$/;

  public passwordValidation() {
    return Yup.string()
      .min(13, "Password must be at least 13 characters long")
      .matches(
        this.regex,
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
      )
      .required("This field is required!");
  }
}

export const passwordValidation = new passwordRequirment();
