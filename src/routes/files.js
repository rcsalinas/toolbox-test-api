const express = require('express');
// un comentario de prueba
const router = express.Router();
const filesController = require('../controllers/filesController');

router.get('/data', filesController.getFilesData);

router.get('/list', filesController.listFiles);

module.exports = router;

//a comment
