"use client";
import { useState } from "react";
import { apiRequest } from "../utils/fetch";
import Textbox from "../components/input";
import Selectbox from "../components/select";
import InputButton from "../components/inputbutton";
import ImageCropper from "../components/imageCroper"; // Componente independiente
import { FaEye, FaEyeSlash } from "react-icons/fa";


function NewUser({ switchToLogin }) {
  const options = [
    { value: "", label: "Seleccione" },
    { value: "CC", label: "C.C" },
    { value: "CE", label: "C.E" },
  ];

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const tableName = "usuarios";
  const fcreacion = new Date().toISOString().split("T")[0];
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  // Datos del formulario
  const [id, setId] = useState();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fnacido, setFnacido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmContrasena, setConfirmContrasena] = useState("");
  const [selectTipoId, setSelectTipoId] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("M");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleChangeSelect = (e) => setSelectTipoId(e.target.value);
  const handleChangeRadio = (e) => setSelectedRadio(e.target.value);

  const handleFileChange = (file) => {
    console.log("Archivo recibido en newUser:", file);
    setFile(file);
  };

  const avatarUploading = async () => {
    if (file) {
     
      const formData = new FormData();
      formData.append("file", file);
        const  { data, error } = await apiRequest("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (error) {
          console.error("Upload error:", error);
          return;
        }

        console.log("UPLOAD RESPONSE:", data);
        //setImageUrl(data.url); // ⬅ URL que viene de Cloudinary
        return data.url;
    } else {
      console.log("entra a tipo avatar")
      const avatarValue = generateAvatar(nombre, apellido);
      setFile(avatarValue);
      return avatarValue;
    }
  }
  
  const generateAvatar = (nombre, apellido) => {
    const initials =
      (nombre.trim().split(" ")[0]?.[0] ?? "") +
      (apellido.trim().split(" ")[0]?.[0] ?? "");
    const hexColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
    console.log(initials+"-"+hexColor)
    return `${initials} ${hexColor}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!id || !nombre || !apellido || !correo || !contrasena || !confirmContrasena) {
      setError("Todos los campos obligatorios deben estar completos.");
      setLoading(false);
      return;
    }

    if (contrasena !== confirmContrasena) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    const avatarValue = await avatarUploading();
    console.log("Avatar:: ", avatarValue)
    if (!avatarValue) return;

    const datos = {
      id_usuario: id,
      tipo_id_usuario: selectTipoId,
      nombre_usuario: nombre,
      apellido_usuario: apellido,
      fecha_nacimiento_usuario: fnacido,
      genero_usuario: selectedRadio,
      telefono_usuario: telefono,
      correo_usuario: correo,
      contrasena_usuario: contrasena,
      fecha_creacion_usuario: fcreacion,
      avatar_usuario: avatarValue,
      rol_usuario: "cliente",
      estado_usuario: "activo",
    };

    try {
      const { info, error: reqError } = await apiRequest(`/api/c/${tableName}/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (reqError) {
        setError("Error al consultar", reqError);
        setLoading(false);
        return;
      }

      if (info && info.length > 0) {
        setError("El usuario ya existe.");
        setLoading(false);
        return;
      }
      console.log("Ejecucion actual, registrando")
      const { data, error: requestError } = await apiRequest(`/api/${tableName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (requestError) {
        setError("Error al realizar el registro", requestError);
      } else {
        console.log("Registro exitoso:", data);
        //window.location.reload("/");
      }
    } catch (err) {
      console.error(err);
      setError("Error inesperado al registrar.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="gap-x-1 w-4xl p-2 m-auto border border-gray-700/30 shadow-xl/40 shadow-blue-600 
                bg-white rounded justify-center"
    >
      <h1 className="text-xl font-semibold text-neutral-500/90 mb-4">Registro de usuario</h1>

      <div className="flex ">
        <div className="grid grid-cols-8 gap-3">
          {/* Tipo de ID */}
          <div className="col-span-2">
            <Selectbox
              id="tipo"
              label="Tipo"
              options={options}
              value={selectTipoId}
              onChange={handleChangeSelect}
            />
          </div>

          {/* ID */}
          <div className="col-span-3">
            <Textbox onChange={(e) => setId(e.target.value)} label="Identificación" id="identificacion"/>
          </div>

          {/* Nombres y apellidos */}
          <div className="col-span-3">
            <Textbox onChange={(e) => setNombre(e.target.value)} label="Nombre" id="nombre"/>
          </div>
          <div className="col-span-3">
            <Textbox onChange={(e) => setApellido(e.target.value)} label="Apellidos" id="apellidos"/>
          </div>

          {/* Fecha de nacimiento */}
          <div className="col-span-3">
            <Textbox type="date" onChange={(e) => setFnacido(e.target.value)} 
              label="Fecha de nacimiento" id="fechaNacimiento"/>
          </div>

          {/* Genero */}
          <div className="col-span-2 grid grid-cols-3 gap-2">
            <label className="block text-sm text-gray-700 col-span-3" id="genero">Género</label>
              <div className="flex justify-start px-2 gap-1 ">
                <Textbox type="radio" value="M" id="genero-M" name="genero" 
                  checked={selectedRadio === "M"} onChange={handleChangeRadio} />
                <span>M</span>
              </div>
              <div className="flex justify-end px-2 gap-1">
                <Textbox type="radio" value="F" id="genero-F" name="genero" 
                  checked={selectedRadio === "F"} onChange={handleChangeRadio} />
                <span>F</span>
              </div>
          </div>

          {/* Teléfono */}
          <div className="col-span-3">
            <Textbox onChange={(e) => setTelefono(e.target.value)} label="Telefono" id="telefono"/>
          </div>

          {/* Correo */}
          <div className="col-span-4">
            <Textbox onChange={(e) => setCorreo(e.target.value)} label="Correo" id="correo"/>
          </div>

          {/* Contraseña y Confirmar contraseña */}
          <div className="col-span-3 relative">
            <Textbox
              id="pass"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setContrasena(e.target.value)}
              label="Contraseña"
            />
            <span
              className="absolute right-2 top-10 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="col-span-3 relative">          
            <Textbox
              id="confirmPass"
              type={showConfirmPassword ? "text" : "password"}
              onChange={(e) => setConfirmContrasena(e.target.value)}
              label="Confirmar contraseña"
            />
            <span
              className="absolute right-2 top-10 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        {/* Image Cropper */}
          <div className="col-span-4">
            <ImageCropper onFinish={handleFileChange} title="Sube tu foto" type="profile"/>
          </div>
      </div>

      <div className="flex justify-between p-3">
        <button type="button" className="text-md" onClick={switchToLogin}>
          Regresar
        </button>
        <InputButton 
          className="bg-sky-700 text-white p-2 text-md"
          type="submit"
        >
          {loading ? "Cargando..." : "Registrar"}
        </InputButton>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <p className="mt-4 text-sm text-gray-600">
        ¿Ya tienes una cuenta?
        <button className="text-blue-600 hover:underline pl-2" onClick={switchToLogin}>
          Inicia sesión
        </button>
      </p>
    </form>
  );
}

export default NewUser;
