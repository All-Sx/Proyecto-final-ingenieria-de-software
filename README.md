# Proyecto final ingenieria de software

Proyecto final para la asignatura de **Ingeniería de Software**. Este repositorio contiene el código fuente del sistema de inscripcion y recomendacion de electivos universitarios.

## Sobre el Proyecto

Proyecto final de Ingeniería de Software. Aplicación web full-stack para inscripcion y recomendacion de electivos universitarios usando Node.js (Express, TypeORM) y React (Vite, Tailwind).)

### Características Principales

* **Autenticación de Usuarios:** Registro e inicio de sesión seguros con JWT.
* **Gestión de Proyectos:** Creación, edición y eliminación de tableros de proyectos.
* **Diseño Responsivo:** Interfaz adaptable a dispositivos móviles y de escritorio.

## Tecnologías y Herramientas Utilizadas

### Backend
* **Framework:** Node.js con Express.js
* **Base de Datos:** PostgreSQL
* **ORM:** TypeORM
* **Autenticación:** JSON Web Tokens (JWT) y Bcrypt
* **Variables de Entorno:** Dotenv

### Frontend
* **Framework/Librería:** React.js
* **Bundler:** Vite
* **Estilos:** Tailwind CSS
* **Peticiones HTTP:** Axios
* **Routing:** React Router DOM

## Guía de Instalación y Uso Local (pendiente)

### Prerrequisitos
* Node.js (v18.x o superior)
* npm (v9.x o superior)
* PostgreSQL

### Pasos
1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/All-Sx/Proyecto-final-ingenieria-de-software](https://github.com/All-Sx/Proyecto-final-ingenieria-de-software.git)
    cd TU_REPO
    ```

2.  **Configurar el Backend:**
    ```bash
    cd backend
    npm install
    ```
    * Renombra el archivo `.env.example` a `.env`.
    * Modifica el archivo `.env` con tus credenciales de la base de datos y un secreto para JWT.

3.  **Configurar el Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```
    * (Si tienes variables de entorno en el frontend, explica cómo configurarlas aquí).

4.  **Iniciar la base de datos:**
    * Asegúrate de que tu servidor de PostgreSQL esté corriendo y crea una base de datos con el nombre que especificaste en el `.env` del backend.

5.  **Ejecutar el proyecto:**
    * **Para el Backend (desde la carpeta `backend`):**
        ```bash
        npm run dev
        ```
        El servidor se iniciará en `http://localhost:3000` (o el puerto que hayas configurado).

    * **Para el Frontend (desde la carpeta `frontend`):**
        ```bash
        npm run dev
        ```
        La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique Vite).

## Autores

Un agradecimiento a los miembros del equipo.

* **Manuel Cofré Yepes** - *Desarrollo Backend & Frontend* - [@manolococo](https://github.com/manolococo)
* **Alan Fica Contreras** - *Desarrollo Backend & Frontend* - [@All-Sx](https://github.com/All-Sx)
* **Gabriel Jerez Salas** - *Desarrollo Backend & Frontend* - [@Gabo288](https://github.com/Gabo288)
* **David Parraguez Miranda** - *Desarrollo Backend & Frontend* - [@davidparraguez1809](https://github.com/davidparraguez1809)
* **Pablo Saavedra Araneda** - *Desarrollo Backend & Frontend* - [@Pablo-Saave](https://github.com/Pablo-Saave)
