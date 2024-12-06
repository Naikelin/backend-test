import { contarCoincidenciasEnCadena } from "../../src/app/cadenas";

describe("contarCoincidenciasEnCadena", () => {
  it("should return 0 when the substring is not found", () => {
    const result = contarCoincidenciasEnCadena("abcde", "xyz");
    expect(result).toBe(0);
  });

  it("should return the correct count when the substring is found once", () => {
    const result = contarCoincidenciasEnCadena("abcde", "abc");
    expect(result).toBe(1);
  });

  it("should return the correct count when the substring is found multiple times", () => {
    const result = contarCoincidenciasEnCadena("abcabcabc", "abc");
    expect(result).toBe(3);
  });

  it("should handle overlapping substrings correctly", () => {
    const result = contarCoincidenciasEnCadena("aaaa", "aa");
    expect(result).toBe(3);
  });

  it("should return 0 when the substring is longer than the string", () => {
    const result = contarCoincidenciasEnCadena("abc", "abcd");
    expect(result).toBe(0);
  });

  it("should return the length of the string when the substring is a single character", () => {
    const result = contarCoincidenciasEnCadena("aaaa", "a");
    expect(result).toBe(4);
  });

  it("should return 0 for an empty substring", () => {
    const result = contarCoincidenciasEnCadena("abc", "");
    expect(result).toBe(0);
  });

  it("should return 0 for an empty string", () => {
    const result = contarCoincidenciasEnCadena("", "abc");
    expect(result).toBe(0);
  });

  it("should return 0 when both the string and substring are empty", () => {
    const result = contarCoincidenciasEnCadena("", "");
    expect(result).toBe(0);
  });
});
