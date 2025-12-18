"use client";

import { useState, useContext } from "react";
import { apiRequest } from "../utils/fetch";
import Textbox from "../components/input";
import Inputbutton from "../components/inputbutton";
import { AuthContext } from "../context/authContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";

function generateRandomToken() {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, "0")).join("");
}

const Login = ({ switchToSignUp }) => {
  const [usuario, setUsuario] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);

  const handleLoginSuccess = (userData) => {
    const token = generateRandomToken();
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    login(userData, token);
  };

  const handleSubmit = async (e) => {
    console.log("clickeado")
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!usuario || !pass) {
      setError("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    try {
      const { data, error: apiError } = await apiRequest("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usuario, password: pass }),
      });

      if (apiError) {
        setError(apiError);
      } else {
        // Extraer rol del usuario
        const rol = data.user?.rol_usuario;
        const estado = data.user?.estado_usuario

        if (rol && estado) {
          // Redireccionamiento según rol
          console.log("Entro a condicion de rol")
          if (rol === "admin" && estado === "activo") {
            alert("Entro rol admin")
            handleLoginSuccess(data.user);
            window.location.replace("./admin");
          } else if (rol === "cliente" && estado === "activo") {
            alert("Entro a rol client")
            handleLoginSuccess(data.user);
            window.location.reload("/cliente");
          }
          else {
            alert("Lo sentimos. El usuario se encuentra bloqueado. Consulte con su administrador")
            window.location.reload("/cliente");
          }
        }
      }
    } catch (err) {
      setError("Error inesperado al iniciar sesión");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        m-auto gap-x-1 items-center w-70 p-4 border border-gray-700/30 
        shadow-xl/40 shadow-blue-600 bg-white rounded"
    >
      <h1 className="text-2xl font-semibold text-neutral-500/90 mb-4">
        Inicio de sesión
      </h1>

      <div className="mb-3">
        <Textbox
          id="usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          label="Usuario"
        />
      </div>

      <div className="mb-3 relative">
        <Textbox
          id="pass"
          type={showPassword ? "text" : "password"}
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          label="Contraseña"
        />
        <span
          className="absolute right-3 top-9 cursor-pointer text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>

        <Link
          href="#"
          className="text-sm relative left-2 top-2 hover:text-blue-700 cursor-pointer"
        >
          Olvidó su contraseña?
        </Link>
      </div>

      <div className="pt-3 text-white">
        <Inputbutton
          type="submit"
          className="bg-sky-600 w-full p-2"
        >
           {loading ? "Cargando..." : "Iniciar Sesión"}
        </Inputbutton>

        <button
          type="button"
          className="text-blue-600 hover:underline p-2 cursor-pointer"
          onClick={switchToSignUp}
        >
          Quiero Registrarme
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
};

export default Login;
