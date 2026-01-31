module.exports = {
  usuarios: {
    table: "usuarios",
    idField: "id_usuario",
    endpoint: "usuarios",
    searchable: {
      name: ["nombre_usuario", "apellido_usuario"],
      contact: ["correo_usuario", "telefono_usuario"],
      text: ["estado_usuario"],
      numeric: ["id_usuario"],
    },
    excludeFromSearch: [
      "avatar_usuario",
      "fecha_nacimiento_usuario",
      "genero_usuario",
    ],
    orderBy: "nombre_usuario"
  },
};