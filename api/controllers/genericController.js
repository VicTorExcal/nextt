const db = require('../db/db');

// Listas permitidas
const allowedTables = {
  usuarios: 'idusuario',
  clientes: 'idcliente',
  productos: 'idproducto'
};
function isValidTableAndColumn(table, column) {
  return allowedTables[table] && allowedTables[table] === column;
}

exports.getAll = async (req, res) => {
    const { table } = req.params;
    const idColumn = allowedTables[table];

    if (!isValidTableAndColumn(table, idColumn)) {
        return res.status(400).json({ error: 'Tabla o columna no permitida' });
    }
    try {
        const [rows] = await db.query(`SELECT * FROM ${table}`);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    const { table, id } = req.params
    const idColumn = allowedTables[table];

    if (!isValidTableAndColumn(table, idColumn)) {
        return res.status(400).json({ error: 'Tabla o columna no permitida' });
    }
    
    try {
        const [rows] = await db.query(`SELECT * FROM ?? WHERE ?? = ?`, [table, idColumn, id])
        res.json(rows[0] || {}) 
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};

exports.create = async (req, res) => {
    const { table } = req.params
    const data = req.body

    console.log('Tabla:', table);
    console.log('Datos a insertar:', data);

    try {
        const [result] = await db.query(`INSERT INTO ?? SET ?`, [table, data])

        console.log('Resultado:', result);

        res.status(201).json({ insertedId: result.insertId })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};

exports.update = async (req, res) => {
    const { table, id } = req.params;
    const idColumn = allowedTables[table];
    const data = req.body;

    if (!isValidTableAndColumn(table, idColumn)) {
        return res.status(400).json({ error: 'Tabla o columna no permitida' });
    }

    try {
        const query = `UPDATE ?? SET ? WHERE ?? = ?`;
        const [result] = await db.query(query, [table, data, idColumn, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Registro no encontrado para actualizar' });
        }

        res.json({ message: 'Registro actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    const { table, id } = req.params;
    const idColumn = allowedTables[table];

    if (!isValidTableAndColumn(table, idColumn)) {
        return res.status(400).json({ error: 'Tabla o columna no permitida' });
    }

    try {
        const query = `DELETE FROM ?? WHERE ?? = ?`;
        const [result] = await db.query(query, [table, idColumn, id]);

        if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Registro no encontrado' });
        }

        res.json({ message: 'Registro eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

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
