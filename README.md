# catalogo tec - Backend

API REST desarrollada con **Node.js**, **Express** y **MySQL** para la gestión de un catálogo de productos tecnológicos con autenticación JWT y control de acceso basado en roles (RBAC).

##  Requisitos Previos
Asegúrate de tener instalado en tu equipo:
- [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada)
- [MySQL](https://www.mysql.com/) o un entorno como XAMPP / Laragon.
- [Postman](https://www.postman.com/) (Opcional, para probar los endpoints).

---

##  Instalación y Configuración

1. **Clona el repositorio:**
   ```bash
   git clone [https://github.com/LeoTorres002/backend-tienda-tec](https://github.com/tu-usuario/tu-repositorio-backend.git)
   cd tu-repositorio-backend

##  Instalar dependencias
npm install

 ## Configurar la Base de Datos
Abre tu gestor de base de datos MySQL favorito (MySQL Workbench, phpMyAdmin, DBeaver, etc.).

Ejecuta el script SQL que se encuentra en la ruta:
database/schema.sql
(Este script creará la base de datos tienda_tec_db, sus tablas correspondientes y los datos base de roles y usuario admin).

## Configurar variables de entorno
Crea un archivo llamado .env en la raíz del proyecto tomando como referencia el archivo .env.example.

Define los parámetros de conexión correspondientes a tu entorno local:

PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=tienda_tec_db
JWT_SECRET=tu_clave_secreta_jwt

## ejecucion del servidor
modo desarrollo:
npm run dev

modo produccion:
npm start

##  Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registro de usuario (normal o admin).
- `POST /api/auth/login` - Inicio de sesión para obtener el Token JWT.

### Productos (CRUD)
- `GET /api/products` - Obtener todos los productos (Público).
- `GET /api/products/:id` - Obtener un producto por ID.
- `POST /api/products` - Crear un producto (Requiere rol `admin` + Token).
- `PUT /api/products/:id` - Actualizar un producto (Requiere rol `admin` + Token).
- `DELETE /api/products/:id` - Eliminar un producto (Requiere rol `admin` + Token).

##  en caso de tener algun problema...

1. **Credenciales de MySQL:** Si tu entorno local de MySQL no utiliza el usuario `root` o requiere una contraseña específica, asegúrate de actualizar las variables `DB_USER` y `DB_PASSWORD` en tu archivo `.env`.
2. **Creación manual de la BD (Opcional):** Si el script `schema.sql` no crea la base de datos automáticamente por restricciones de permisos, puedes crearla manualmente antes de ejecutar el script:
   ```sql
   CREATE DATABASE tienda_tec_db;