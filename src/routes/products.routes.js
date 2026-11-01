const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

// --- RUTAS PÚBLICAS ---
// Listar todos los productos
router.get('/', productController.getProducts);

// Obtener un solo producto por su ID
router.get('/:id', productController.getProductById);


// --- RUTAS PROTEGIDAS (Solo Administradores) ---
// Crear un nuevo producto
router.post('/', verifyToken, verifyAdmin, productController.createProduct);

// Actualizar un producto existente por ID
router.put('/:id', verifyToken, verifyAdmin, productController.updateProduct);

// Eliminar un producto por ID
router.delete('/:id', verifyToken, verifyAdmin, productController.deleteProduct);

module.exports = router;