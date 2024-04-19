import { suite } from "vitest";
import * as Yup from "yup";
import { emailValidation } from "../../src/utils/EmailRequirement";

const emailSchema = Yup.object().shape({
  email: emailValidation.EmailValidation(),
});

suite("Validation Tests", (test) => {
  test("Email Validation: Success Case", async () => {
    const successData = {
      email: "example@example.com",
    };

    try {
      await emailSchema.validate(successData);
      return true;
    } catch (error) {
      return false;
    }
  });

  test("Email Validation: Failure Case", async () => {
    const failureData = {
      email: "invalidemail",
    };

    try {
      await emailSchema.validate(failureData);
      return false;
    } catch (error) {
      return true;
    }
  });
});
