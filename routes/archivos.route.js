const express = require('express');
const ruta = express();
const importExcelController = require('../controllers/importExcel.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const fileUpload = require('express-fileupload');

ruta.use(fileUpload());
ruta.post(
  '/importar-excel',
  [authMiddleware.verificarToken, authMiddleware.verificarAdminRol],
  importExcelController.importarBeneficiarios
);

module.exports = ruta;
