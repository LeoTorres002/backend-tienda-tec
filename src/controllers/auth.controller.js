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

        // Verificar si la contraseña almacenada es un hash de bcrypt o texto plano
        if (!user.password.startsWith('$2b$')) {
            isPasswordValid = (password === user.password);
            
            // Si coincide en texto plano, la encriptamos y la guardamos encriptada de una vez
            if (isPasswordValid) {
                const hashedPassword = await bcrypt.hash(password, 10);
                await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
            }
        } else {
            // Si ya es un hash seguro, usamos bcrypt.compare normalmente
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
        const { username, email, password, role_id } = req.body;

        // 1. Validar campos obligatorios
        if (!username || !email || !password) {
            const error = new Error('Todos los campos (username, email, password) son obligatorios.');
            error.statusCode = 400;
            error.code = 'MISSING_FIELDS';
            throw error;
        }

        // 2. Verificar si el correo ya está registrado
        const [existingUser] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            const error = new Error('El correo electrónico ya se encuentra registrado.');
            error.statusCode = 409; // Conflict
            error.code = 'EMAIL_ALREADY_EXISTS';
            throw error;
        }

        // 3. Definir el rol (si no se envía role_id, por defecto asignamos el rol 2 que es 'user')
        const assignedRoleId = role_id || 2;

        // 4. Hashear la contraseña con Bcrypt por seguridad
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 5. Insertar el nuevo usuario en la base de datos
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
        next(err);
    }
};

module.exports = {
    login,
    register
};