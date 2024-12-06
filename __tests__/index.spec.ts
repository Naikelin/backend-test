import { startServer } from "../src/index.js";
import { configuration } from "../src/config.js";
import app from "../src/server.js";

jest.mock("../src/server.js", () => ({
  listen: jest.fn((port, callback) => callback()),
}));

describe("index.js", () => {
  it("debería iniciar el servidor y mostrar el mensaje esperado en la consola", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    startServer();

    expect(app.listen).toHaveBeenCalledWith(
      configuration.port,
      expect.any(Function)
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      `El usuario ${configuration.username} ha levantado la aplicacion en el puerto ${configuration.port}`
    );

    consoleSpy.mockRestore();
  });
});
