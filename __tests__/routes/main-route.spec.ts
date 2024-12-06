import request from "supertest";
import express from "express";

jest.mock("../../src/config.js", () => ({
  configuration: {
    username: "testUser",
    apikey: "123456",
  },
}));

describe("MainRouter Tests", () => {
  let app: express.Application;

  beforeEach(() => {
    jest.resetModules();
    app = express();

    jest.mock("../../src/app/rut.js", () => ({
      validarRUT: jest.fn((rut) => rut === "12345678-9"),
    }));

    jest.mock("../../src/app/cadenas.js", () => ({
      contarCoincidenciasEnCadena: jest.fn((cadena, subcadena) => {
        if (cadena === "abcabc" && subcadena === "abc") return 2;
        return 0;
      }),
    }));

    const mainRouter = require("../../src/routes/main-route.js").default;
    app.use(mainRouter);
  });

  it('GET / - Should return "Hola mundo al usuario testUser"', async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hola mundo al usuario testUser");
  });

  it("GET /api-key - Should return the API key", async () => {
    const res = await request(app).get("/api-key");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("la apikey de mi aplicacion es: 123456");
  });

  it("GET /validar-rut - Should validate RUT correctly", async () => {
    const resValid = await request(app)
      .get("/validar-rut")
      .query({ rut: "12345678-9" });
    expect(resValid.statusCode).toBe(200);
    expect(resValid.text).toBe("El rut suministrado (12345678-9) es : valido");

    const resInvalid = await request(app)
      .get("/validar-rut")
      .query({ rut: "11111111-1" });
    expect(resInvalid.statusCode).toBe(200);
    expect(resInvalid.text).toBe(
      "El rut suministrado (11111111-1) es : invalido"
    );
  });

  it("GET /buscar-subcadena - Should count substring occurrences correctly", async () => {
    const res = await request(app)
      .get("/buscar-subcadena")
      .query({ cadena: "abcabc", subcadena: "abc" });

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe(
      'La cadeja "abcabc" tiene 2 repeticiones de la subcadena "abc"'
    );
  });
});
