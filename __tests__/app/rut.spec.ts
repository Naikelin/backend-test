import { validarRUT } from "../../src/app/rut";

describe("validarRUT", () => {
  it("should return true for a valid RUT without formatting", () => {
    expect(validarRUT("252936068")).toBe(true);
  });

  it("should return true for a valid RUT with dots and hyphen", () => {
    expect(validarRUT("25.293.606-8")).toBe(true);
  });

  it("should return false for an invalid RUT without formatting", () => {
    expect(validarRUT("12345678X")).toBe(false);
  });

  it("should return false for an invalid RUT with dots and hyphen", () => {
    expect(validarRUT("12.345.678-X")).toBe(false);
  });

  it("should return false if the RUT is too short", () => {
    expect(validarRUT("12")).toBe(false);
  });

  it("should return false if the RUT is too long", () => {
    expect(validarRUT("1234567890123")).toBe(false);
  });

  it("should return false if the RUT contains non-numeric characters (except the verifier)", () => {
    expect(validarRUT("12345A67K")).toBe(false); // Invalid RUT with a non-numeric character
  });

  it("should return false if the RUT contains non-numeric characters in the verifier", () => {
    expect(validarRUT("12345678Z")).toBe(false); // Invalid verifier
  });
});
