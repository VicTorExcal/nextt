const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

router.post('/', (req, res) => {
  const form = formidable({ multiples: false });
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Error al procesar la imagen' });

    const file = files.avatar;
    const folderPath = path.join(__dirname, '../public/profile');

    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

    const uniqueName = `${Date.now()}-${file.originalFilename}`;
    const filePath = path.join(folderPath, uniqueName);

    fs.renameSync(file.filepath, filePath);

    res.json({ filename: uniqueName, url: `/profile/${uniqueName}` });
  });
});

module.exports = router;
