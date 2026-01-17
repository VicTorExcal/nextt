import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../moduls/login";
import { AuthContext } from "../context/authContext";
import { navigateTo } from "../utils/navigation";

// Mock de la API
jest.mock("../utils/fetch", () => ({
  apiRequest: jest.fn(() =>
    Promise.resolve({
      data: {
        user: { rol_usuario: "admin", estado_usuario: "activo" },
      },
      error: null,
    })
  ),
}));
jest.mock("../utils/navigation", () => ({
  navigateTo: jest.fn(),
}));

describe("Login - Prueba Unitaria", () => {
  const mockLogin = jest.fn();

  const renderLogin = () =>
    render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login switchToSignUp={jest.fn()} />
      </AuthContext.Provider>
    );

  test("Muestra error si los campos están vacíos", async () => {
    renderLogin();

    const boton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    fireEvent.click(boton);

    expect(
      await screen.findByText("Por favor completa todos los campos")
    ).toBeInTheDocument();
  });
});

describe("Login - Prueba de Integración", () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("login exitoso como admin redirige a /admin", async () => {
    render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login switchToSignUp={jest.fn()} />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/usuario/i), {
      target: { value: "admin" },
    });

    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(await screen.findByText(/cargando/i)).toBeInTheDocument();

    expect(mockLogin).toHaveBeenCalled();
    expect(navigateTo).toHaveBeenCalledWith("./admin");
  });
});


