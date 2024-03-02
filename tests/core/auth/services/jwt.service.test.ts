import { JwtService } from "@core/auth/services/jwt.service";

describe("JwtService", () => {
  const secret = "secret";

  it("should correctly handle expiresIn when signing a token", async () => {
    jest.useFakeTimers();
    const payload = { data: "test" };

    const token1h = await JwtService.signTokenAsync(payload, secret, "1h");
    if (!token1h) fail("Token not created");

    jest.advanceTimersByTime(60 * 60 * 1000 * 2); // Advance time by 2 hours
    await expect(JwtService.verifyTokenAsync(token1h, secret)).rejects.toThrow(
      "Token has expired"
    );

    const token1m = await JwtService.signTokenAsync(payload, secret, "1m");
    if (!token1m) fail("Token not created");

    jest.advanceTimersByTime(60 * 1000 * 2); // Advance time by 2 minute
    await expect(JwtService.verifyTokenAsync(token1m, secret)).rejects.toThrow(
      "Token has expired"
    );

    jest.useRealTimers();
  });

  it("should reject with an error when given an invalid expiresIn format", async () => {
    const payload = { data: "test" };
    await expect(
      JwtService.signTokenAsync(payload, secret, "1w")
    ).rejects.toThrow("Invalid expiresIn format");
  });

  it("should reject with an error when given a token with an invalid signature", async () => {
    const token = "invalid.token.signature";
    await expect(JwtService.verifyTokenAsync(token, secret)).rejects.toThrow(
      "Invalid token format"
    );
  });

  it("should return null when given a header without a token", () => {
    const header = "Bearer";
    const token = JwtService.extractToken(header);
    expect(token).toBeNull();
  });

  it("should return null when given a header with an invalid format", () => {
    const header = "Invalid format";
    const token = JwtService.extractToken(header);
    expect(token).toBeNull();
  });

  it("should correctly sign and verify a token", async () => {
    const payload = { data: "test" };
    const token = await JwtService.signTokenAsync(payload, secret, "1h");
    if (!token) fail("Token not created");
    const verifiedPayload = await JwtService.verifyTokenAsync(token, secret);
    expect(verifiedPayload.data).toBe(payload.data);
  });
});
