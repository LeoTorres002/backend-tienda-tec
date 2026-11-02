const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('El correo y la contraseña son obligatorios.');
            error.statusCode = 400;
            error.code = 'MISSING_CREDENTIALS';
            throw error;
        }

        const query = `
            SELECT u.id, u.username, u.email, u.password, r.name as role 
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.email = ?
        `;
        const [rows] = await db.execute(query, [email]);

        if (rows.length === 0) {
            const error = new Error('Credenciales inválidas.');
            error.statusCode = 401;
            error.code = 'INVALID_CREDENTIALS';
            throw error;
        }

        const user = rows[0];
        let isPasswordValid = false;

        if (!user.password.startsWith('$2b$')) {
            isPasswordValid = (password === user.password);
            
            if (isPasswordValid) {
                const hashedPassword = await bcrypt.hash(password, 10);
                await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
            }
        } else {
            isPasswordValid = await bcrypt.compare(password, user.password);
        }

        if (!isPasswordValid) {
            const error = new Error('Credenciales inválidas.');
            error.statusCode = 401;
            error.code = 'INVALID_CREDENTIALS';
            throw error;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.status(200).json({
            success: true,
            message: 'Autenticación exitosa.',
            token,
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};

const register = async (req, res, next) => {
    try {
        console.log('Datos recibidos en registro:', req.body);

        // Aceptamos tanto 'username' como 'name' por si el frontend envía uno u otro
        const username = req.body.username || req.body.name;
        const { email, password, role_id } = req.body;

        if (!username || !email || !password) {
            const error = new Error('Todos los campos (username, email, password) son obligatorios.');
            error.statusCode = 400;
            error.code = 'MISSING_FIELDS';
            throw error;
        }

        const [existingUser] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            const error = new Error('El correo electrónico ya se encuentra registrado.');
            error.statusCode = 409;
            error.code = 'EMAIL_ALREADY_EXISTS';
            throw error;
        }

        const assignedRoleId = role_id ? Number(role_id) : 2;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Usamos 'username' que es la columna real que tiene tu tabla en MySQL
        const insertQuery = `
            INSERT INTO users (username, email, password, role_id) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.execute(insertQuery, [username, email, hashedPassword, assignedRoleId]);

        return res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente.',
            data: {
                id: result.insertId,
                username,
                email,
                role_id: assignedRoleId
            }
        });
    } catch (err) {
        console.error('ERROR DETALLADO EN REGISTER:', err);
        next(err);
    }
};

module.exports = {
    login,
    register
};  