const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/products.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Enrutamiento principal
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Manejador global de errores
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        code: err.code || 'INTERNAL_SERVER_ERROR',
        message: err.message || 'Ocurrió un error interno en el servidor.'
    });
});

// Inicialización del servidor
app.listen(PORT, () => {
    console.log(`[SERVER] Servidor corriendo exitosamente en el puerto ${PORT}`);
});