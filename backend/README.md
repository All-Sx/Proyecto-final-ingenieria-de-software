# Proyecto de Ingeniería de Software

## Descripción
Plantilla para usar en el proyecto final de ingenieria de software

## Características
- Autenticación con JWT
- Base de datos PostgreSQL con TypeORM
- Arquitectura MVC
- Manejo de errores con handlers personalizados
- Validaciones de entrada
- Middleware de autenticación
- Variables de entorno para configuración

## Tecnologías Utilizadas
- **Backend:** Node.js, Express.js
- **Base de Datos:** PostgreSQL
- **ORM:** TypeORM
- **Autenticación:** JSON Web Tokens (JWT)
- **Encriptación:** bcrypt
- **Desarrollo:** nodemon

## Instalación

1. Clona el repositorio:


2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el proyecto:
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

## Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

## Estructura del Proyecto
```
src/
├── config/          # Configuración de DB y variables de entorno
├── controllers/     # Controladores de las rutas
├── entities/        # Entidades de TypeORM
├── Handlers/        # Manejadores de respuestas
├── middleware/      # Middleware personalizado
├── routes/          # Definición de rutas
├── services/        # Lógica de negocio
└── index.js         # Punto de entrada de la aplicación
```