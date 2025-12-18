const bcrypt = require('bcrypt');
const db = require('../db/db');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query(`SELECT * FROM USUARIOS WHERE correo_usuario = ? OR telefono_usuario = ?`, [username, username])

        if (rows.length === 0) {
            // Usuario no encontrado
            return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.contrasena_usuario) // comparacion de contraseña con bcrypt
        
        // Validacion de contraseña
        if (password == user.contrasena_usuario) {
            // Login correcto
            return res.json({ success: true, message: 'Login correcto', user});
        } else {
            // Contraseña incorrecta
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }


    } catch (err) {
        console.error('Error en login:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};
