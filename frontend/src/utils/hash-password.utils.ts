import bcrypt from "bcryptjs";

class HashPassword {
  private readonly saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return hashedPassword;
  }

  async compareHashedPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  }
}

export const hashPassword = new HashPassword();
