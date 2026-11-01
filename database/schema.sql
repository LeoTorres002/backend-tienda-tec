CREATE DATABASE IF NOT EXISTS tienda_tec_db;
USE tienda_tec_db;

CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Insertar roles base y usuario admi
INSERT INTO roles (id, name) VALUES (1, 'admin'), (2, 'user') ON DUPLICATE KEY UPDATE name=name;

-- La contraseña de este admin por defecto debe coincidir con la encriptada con bcrypt
INSERT INTO users (name, email, password, role_id) 
VALUES ('Administrador', 'admin@tiendatec.com', '$2b$10$TuHashDeBcryptEjemplo...', 1)
ON DUPLICATE KEY UPDATE email=email;