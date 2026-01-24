"use client"
import CrudInterfaze from "../../../moduls/crudinterfaze"

export default function Usuarios() {
    
    return(
    <>
        <div className="pt-16">
            <h2>Bienvenido Admin. aqui la interfaz de Usuarios</h2>
            <CrudInterfaze tableName="usuarios"/>
        </div>
    </>
)}