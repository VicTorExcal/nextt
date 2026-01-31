const db = require('../db/db');
const crudConfig = require("../config/crudConfig");

// Funcion para validar tablas permitidas
function isValidTableAndColumn(table, column) {
    console.log("Confirmado Tablas")
  return (
        allowedTables[table] &&
        allowedTables[table].idColumn === column
    );
}

// Consulta Para tablas en ADMIN
exports.getter = async (req, res) => {
    console.log("Entrando a consulta de datos por admin")
    const {
        isNumeric,
        isEmail,
        normalizeText
    } = require("../utils/searchDetect");
    const { table } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = normalizeText(req.query.search || "");

    const config = crudConfig[table]

    if (!config) {
        return res.status(400).json({ message: "Tabla no permitida" });
    }

    const offset = (page - 1) * limit;

    let where = "";
    let values = [];
    console.log("Consulta completa ", search)
    try {
        if (search !== "") {
            console.log("Buscando ", search)
        /* ==========================
            🔢 BÚSQUEDA NUMÉRICA
        ========================== */
        if (isNumeric(search)) {
            where = `WHERE ${config.searchable.numeric
            .map(col => `${col} = ?`)
            .join(" OR ")}`;
            values.push(search);
        }

        /* ==========================
            📧 EMAIL
        ========================== */
        else if (isEmail(search)) {
            where = `WHERE ${config.searchable.contact
            .filter(col => col.includes("correo"))
            .map(col => `${col} LIKE ?`)
            .join(" OR ")}`;
            values.push(`%${search}%`);
        }

        /* ==========================
            👤 NOMBRE / APELLIDO
        ========================== */
        else {
            const words = search.split(/\s+/);

            const nameConditions = words.map(word => {
            values.push(`%${word}%`, `%${word}%`);
            return `(${config.searchable.name
                .map(col => `${col} LIKE ?`)
                .join(" OR ")})`;
            });

            where = `WHERE ${nameConditions.join(" AND ")}`;
        }
        }

        /* ==========================
        📦 DATA
        ========================== */
        const [items] = await db.query(
        `
        SELECT *
        FROM ${config.table}
        ${where}
        ORDER BY ${config.orderBy} DESC
        LIMIT ? OFFSET ?
        `,
        [...values, limit, offset]
        );

        /* ==========================
        🔢 COUNT
        ========================== */
        const [countResult] = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM ${config.table}
        ${where}
        `,
        values
        );

        res.json({
        items,
        total: countResult[0]?.total || 0
        });

    } catch (error) {
        console.error("Error en GETTER:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

// Consultar todos los datos de una tabla
exports.getAll = async (req, res) => {
    console.log("Entrando a consulta de datos por client getAll")
    const { table } = req.params;
    const config = crudConfig[table]

    if (!config) {
        return res.status(400).json({ error: 'Tabla no permitida' });
    }
    try {
        const [rows] = await db.query(`SELECT * FROM ${config.table}`);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Consulta Validacion de datos no existente
exports.getByIdNull = async (req, res) => {
    console.log("Entrando a consulta de datos por client getByNull")

    const { table, id } = req.params;
    const config = crudConfig[table]

    if (!config) {
        return res.status(400).json({ error: 'Tabla no permitida' });
    }
    
    try {
        const [rows] = await db.query(
            `SELECT * FROM ${config.table} WHERE ${config.idColumn} = ?`,
            [id]);
        res.json(rows[0] || {}) 
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};

// Consultar Validacion de datos por ID
exports.getById = async (req, res) => {
        console.log("Entrando a consulta de datos por client getbyID")

    const { table, id } = req.params;
    const config = crudConfig[table]

    if (!config) {
        return res.status(400).json({ error: 'Tabla no permitida' });
    }
    
    try {
        const [rows] = await db.query(
            `SELECT * FROM ${config.table} WHERE ${config.idColumn} = ?`,
            [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No encontrado' });
        }
        res.json(rows[0] || {}) 
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};

// Registro de datos
exports.create = async (req, res) => {
        console.log("Entrando a consulta de datos por client create")

    const { table } = req.params
    const data = req.body

    try {
        const [result] = await db.query(`INSERT INTO ?? SET ?`, [table, data])

        console.log('Resultado:', result);

        res.status(201).json({ insertedId: result.insertId })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};

// Actualizacion de datos
exports.update = async (req, res) => {
        console.log("Entrando a consulta de datos por client update")

    const { table, id } = req.params;
    const data = req.body;
    const config = crudConfig[table]


    if (!config) {
        return res.status(400).json({ error: 'Tabla no permitida' });
    }

    try {
        const query = `UPDATE ?? SET ? WHERE ?? = ?`;
        const [result] = await db.query(query, [config.table, data, config.idColumn, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Registro no encontrado para actualizar' });
        }

        res.json({ message: 'Registro actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ELiminacion de datos
exports.remove = async (req, res) => {
        console.log("Entrando a consulta de datos por client remove")

    const { table, id } = req.params;
    const config = crudConfig[table]


    if (!config) {
        return res.status(400).json({ error: 'Tabla no permitida' });
    }

    try {
        const query = `DELETE FROM ?? WHERE ?? = ?`;
        const [result] = await db.query(query, [config.table, config.idColumn, id]);

        if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Registro no encontrado' });
        }

        res.json({ message: 'Registro eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Almacenamiento de imagenes
exports.uploadFile = async (req, res) => {
        console.log("Entrando a consulta de datos por client upload")

    try {
        console.log("REQ FILE →", req.file);
        console.log("REQ BODY →", req.body);

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        res.json({
            message: "Upload successful",
            url: req.file.path,
            public_id: req.file.filename
        });

    } catch (error) {
        console.error("UPLOAD ERROR →", error);
        return res.status(500).json({ error: error.message });
    }
};
