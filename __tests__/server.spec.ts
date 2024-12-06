import request from "supertest";
import { Request, Response } from "express";
import app from "../src/server";

jest.mock("../src/routes/main-route", () => {
  const express = require("express");
  const router = express.Router();
  router.get("/", (req: Request, res: Response) =>
    res.status(200).send("Ruta principal activa")
  );
  return router;
});

describe("Server configuration", () => {
  it("should use JSON as middleware", async () => {
    const response = await request(app).post("/").send({ prueba: "dato" });
    expect(response.status).not.toBe(500);
  });

  it("should allow CORS", async () => {
    const response = await request(app).get("/");
    expect(response.headers["access-control-allow-origin"]).toBe("*");
  });

  it("should use the main router", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Ruta principal activa");
  });
});
