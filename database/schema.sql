CREATE DATABASE IF NOT EXISTS tienda_tec_db;
USE tienda_tec_db;

-- 1. Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- 3. Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 4. Tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 5. Inserción de roles base
INSERT IGNORE INTO roles (id, name) VALUES (1, 'admin'), (2, 'user');

-- 6. Inserción de categorías base (Soluciona el error de llave foránea en el CRUD)
INSERT INTO categories (id, name, description) VALUES 
(1, 'Smartphones', 'Dispositivos móviles y celulares de alta gama'),
(2, 'Laptops', 'Equipos portátiles para desarrollo y productividad'),
(3, 'Teclados', 'Periféricos de entrada'),
(4, 'Monitores', 'Pantallas de alta resolución'),
(5, 'Accesorios', 'Complementos tecnológicos')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 7. Inserción del usuario Administrador inicial (Password: Admin123!)
INSERT IGNORE INTO users (name, email, password, role_id) 
VALUES ('Administrador', 'admin@tiendatec.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);