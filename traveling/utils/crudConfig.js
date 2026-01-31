import Avatar from "../components/avatar";
export const crudConfig = {
  usuarios: {
    endpoint: "usuarios",
    idField: "id_usuario",
    editPath: "/admin/usuarios",
    columns: [
        { header: "Avatar", field: "avatar_usuario", 
          render: (item) => (
            <Avatar user={item} />
          )
        },
        { header: "Identificacion", field: "id_usuario"},
        { header: "Nombre", field: "nombre_usuario"},
        { header: "Apellido", field: "apellido_usuario"},
        { header: "Fecha Nacimiento", field: "fecha_nacimiento_usuario"},
        { header: "Genero", field: "genero_usuario"},
        { header: "Telefono", field: "telefono_usuario"},
        { header: "E-mail", field: "correo_usuario"},
        { header: "Expedido", field: "fecha_creacion_usuario"},
        { header: "Estado", field: "estado_usuario"},
    ],
  },
};