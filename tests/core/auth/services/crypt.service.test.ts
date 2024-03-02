import { CryptService } from "@core/auth/services/crypt.service";
import crypto from "crypto";

jest.mock("crypto");

describe("CryptService", () => {
  let service: CryptService;

  beforeEach(() => {
    service = new CryptService();
  });

  it("should hash password correctly", async () => {
    const password = "password";
    const salt = "salt";
    const hash = "hash";
    const hexHash = Buffer.from(hash).toString("hex");

    (crypto.pbkdf2Sync as jest.Mock).mockReturnValue(Buffer.from(hash));

    const result = await service.hashPassword(password, salt);

    expect(result).toEqual(`${salt}$${hexHash}`);
    expect(crypto.pbkdf2Sync).toHaveBeenCalledWith(
      password,
      salt,
      1000,
      64,
      "sha512"
    );
  });

  it("should generate salt correctly", async () => {
    const salt = "salt";
    const hexSalt = Buffer.from(salt).toString("hex");

    (crypto.randomBytes as jest.Mock).mockReturnValue(Buffer.from(salt));

    const result = await service.generateSalt();

    expect(result).toEqual(hexSalt);
    expect(crypto.randomBytes).toHaveBeenCalledWith(16);
  });

  it("should compare passwords correctly", async () => {
    const enteredPassword = "password";
    const salt = "salt";
    const hash = "hash";
    const hexHash = Buffer.from(hash).toString("hex");
    const storedPassword = `${salt}$${hexHash}`;

    (crypto.pbkdf2Sync as jest.Mock).mockReturnValue(Buffer.from(hash));

    const result = await service.comparePasswords(
      enteredPassword,
      storedPassword
    );

    expect(result).toEqual(true);
    expect(crypto.pbkdf2Sync).toHaveBeenCalledWith(
      enteredPassword,
      salt,
      1000,
      64,
      "sha512"
    );
  });
});
