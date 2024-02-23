# Bienvenido a mi API de Tareas 🚀

Esta API te permite gestionar tareas de manera eficiente con autenticación de usuarios. Perfecta para integrar en tus aplicaciones de gestión de proyectos o listas de tareas.

## Características 📋

- **Autenticación de Usuarios:** Registra usuarios, inicia sesión y cierra sesión con seguridad.
- **Gestión de Tareas:** Crea, actualiza, lista y elimina tareas.
- **Subtareas:** Soporte para subtareas, permitiendo una mejor organización.

## Tecnologías Utilizadas 🛠️

| Tecnología | Descripción                                       | Icono                                                        |
|------------|---------------------------------------------------|--------------------------------------------------------------|
| Node.js    | Entorno de ejecución para JavaScript              | ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=Node.js&logoColor=white) |
| Express    | Framework para Node.js                            | ![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=Express&logoColor=white) |
| MongoDB    | Base de datos NoSQL                               | ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=MongoDB&logoColor=white) |
| JWT        | Autenticación y transmisión de información segura | ![JWT](https://img.shields.io/badge/-JWT-000000?style=flat-square&logo=JSONWebTokens&logoColor=white) |
| Swagger    | Herramienta de diseño y documentación de API      | ![Swagger](https://img.shields.io/badge/-Swagger-85EA2D?style=flat-square&logo=Swagger&logoColor=white) |


## Endpoints 🌐

### Autenticación

- `POST /auth/registro` - Registrar un nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `POST /auth/logout` - Cerrar sesión
- `PATCH /auth/me` - Editar usuario
- `DELETE /auth/me` - Eliminar usuario

### Tareas

- `GET /tareas/` - Listar todas las tareas
- `POST /tareas/` - Crear una nueva tarea
- `POST /tareas/:id/subtareas` - Añadir una subtarea
- `PUT /tareas/:id` - Actualizar una tarea
- `PUT /tareas/:id/subtareas` - Actualizar una subtarea
- `DELETE /tareas/:id` - Eliminar una tarea
- `DELETE /tareas/:id/subtareas/:subtareaId` - Eliminar una subtarea

## Instalación y Uso 📦

Clona este repositorio y navega hasta la carpeta del proyecto:

```bash
git clone <url-repositorio>
cd mi-api-de-tareas
```

Instala las dependencias:

```bash
npm install
```

Inicia el servidor:

```bash
node src/app.js
```