const db = require('../db/db');

// Listas permitidas
const allowedTables = {
    usuarios: { 
        table:'usuarios',
        idColumn: 'id_usuario',
        searchable: 'name'
    },
    productos: {
        table: 'productos',
        idColumn: 'id_producto',
        searchable : ['name', 'categoria']
    },
    categorias: {
        table: 'categorias',
        idColumn: 'id_categoria',
        searchable :'name'
    }
};

// Funcion para validar tablas permitidas
function isValidTableAndColumn(table, column) {
  return (
        allowedTables[table] &&
        allowedTables[table].idColumn === column
    );
}

// Consulta Para tablas en ADMIN
exports.getter = async (req, res) => {
    const { table } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    const config = allowedTables[table];

    if (!config) {
        return res.status(400).json({ message: "Tabla no permitida" });
    }

    const offset = (page - 1) * limit;

    try {
        // WHERE dinámico
        let where = "";
        let values = [];

        if (search) {
            const conditions = config.searchable.map(
                (col) => `${col} ILIKE ?`
            );

            where = `WHERE ${conditions.join(" OR ")}`;
            values = config.searchable.map(() => `%${search}%`);
        }

        // DATA
        const [items] = await db.query(
            `
            SELECT *
            FROM ${config.table}
            ${where}
            ORDER BY id DESC
            LIMIT ? OFFSET ?
            `,
            [...values, limit, offset]
        );

        // TOTAL
        const [countResult] = await db.query(
            `
            SELECT COUNT(*) as total
            FROM ${config.table}
            ${where}
            `,
            values
        );

        res.json({
            items,
            total: countResult[0].total,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

// Consultar todos los datos de una tabla
exports.getAll = async (req, res) => {
    const { table } = req.params;
    const config = allowedTables[table];

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
    const { table, id } = req.params;
    const config =   allowedTables[table];

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
    const { table, id } = req.params;
    const config =   allowedTables[table];

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
    const { table, id } = req.params;
    const data = req.body;
    const config = allowedTables[table];

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
    const { table, id } = req.params;
    const config = allowedTables[table];

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
