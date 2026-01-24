const express = require('express');
const router = express();
const controller = require('../controllers/genericController');
const upload = require('../middleware/upload'); // <--- IMPORTANTE

// Subir imagen
router.post('/upload', upload.single("file"), controller.uploadFile);

// CRUD genérico
router.get('/crud/:table', controller.getter);
router.get('/:table', controller.getAll);
router.post('/:table', controller.create);
router.get('/:table/:id', controller.getById);
router.get('/c/:table/:id', controller.getByIdNull);
router.put('/:table/:id', controller.update);
router.delete('/:table/:id', controller.remove);

module.exports = router;