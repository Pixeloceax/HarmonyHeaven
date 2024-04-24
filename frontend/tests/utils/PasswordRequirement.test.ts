import { suite } from "vitest";
import * as Yup from "yup";
import { passwordValidation } from "../../src/utils/PasswordRequirement";

const passwordSchema = Yup.object().shape({
  password: passwordValidation.PasswordValidation(),
});

suite("Validation Tests", (test) => {
  test("Password Validation: Success Case", async () => {
    const successData = {
      password: "Password123@",
    };

    try {
      await passwordSchema.validate(successData);
      return true;
    } catch (error) {
      return false;
    }
  });

  test("Password Validation: Failure Case", async () => {
    const failureData = {
      password: "weakpassword",
    };

    try {
      await passwordSchema.validate(failureData);
      return false;
    } catch (error) {
      return true;
    }
  });
});
