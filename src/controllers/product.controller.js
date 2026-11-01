const db = require('../config/db');

// Obtener todos los productos
const getProducts = async (req, res, next) => {
    try {
        const query = `
            SELECT p.id, p.title, p.description, p.price, p.image_url, c.name as category 
            FROM products p
            JOIN categories c ON p.category_id = c.id
        `;
        const [rows] = await db.execute(query);

        return res.status(200).json({
            success: true,
            data: rows
        });
    } catch (err) {
        next(err);
    }
};

// Obtener un solo producto por su ID
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT p.id, p.title, p.description, p.price, p.image_url, c.name as category, p.category_id 
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `;
        const [rows] = await db.execute(query, [id]);

        if (rows.length === 0) {
            const error = new Error('Producto no encontrado.');
            error.statusCode = 404;
            error.code = 'PRODUCT_NOT_FOUND';
            throw error;
        }

        return res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (err) {
        next(err);
    }
};

// Crear un nuevo producto
const createProduct = async (req, res, next) => {
    try {
        const { title, description, price, image_url, category_id } = req.body;

        if (!title || !price || !category_id) {
            const error = new Error('El título, el precio y la categoría son obligatorios.');
            error.statusCode = 400;
            error.code = 'MISSING_PRODUCT_FIELDS';
            throw error;
        }

        const query = `
            INSERT INTO products (title, description, price, image_url, category_id) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [title, description || null, price, image_url || null, category_id]);

        return res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente.',
            data: {
                id: result.insertId,
                title,
                description,
                price,
                image_url,
                category_id
            }
        });
    } catch (err) {
        next(err);
    }
};

// Actualizar un producto existente
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, price, image_url, category_id } = req.body;

        if (!title || !price || !category_id) {
            const error = new Error('El título, el precio y la categoría son obligatorios.');
            error.statusCode = 400;
            error.code = 'MISSING_PRODUCT_FIELDS';
            throw error;
        }

        const query = `
            UPDATE products 
            SET title = ?, description = ?, price = ?, image_url = ?, category_id = ? 
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [title, description || null, price, image_url || null, category_id, id]);

        if (result.affectedRows === 0) {
            const error = new Error('Producto no encontrado.');
            error.statusCode = 404;
            error.code = 'PRODUCT_NOT_FOUND';
            throw error;
        }

        return res.status(200).json({
            success: true,
            message: 'Producto actualizado exitosamente.',
            data: {
                id: Number(id),
                title,
                description,
                price,
                image_url,
                category_id
            }
        });
    } catch (err) {
        next(err);
    }
};

// Eliminar un producto
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const query = `DELETE FROM products WHERE id = ?`;
        const [result] = await db.execute(query, [id]);

        if (result.affectedRows === 0) {
            const error = new Error('Producto no encontrado.');
            error.statusCode = 404;
            error.code = 'PRODUCT_NOT_FOUND';
            throw error;
        }

        return res.status(200).json({
            success: true,
            message: 'Producto eliminado exitosamente.'
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};