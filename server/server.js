const path = require("path");
const express = require("express");
var session = require("express-session");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { getUsers } = require('./handlers/users-handlers/getUsers');
const { getUserById} = require('./handlers/users-handlers/getUserById');
const { addNewUser } = require('./handlers/users-handlers/addNewUser');
const { getLoggedinUser } = require('./handlers/current-user-handlers/getLoggedinUser');
const { deleteCurrentUser } = require('./handlers/current-user-handlers/deleteCurrentUser');
const { getPosts } = require('./handlers/posts-handlers/getPostsHandler');
const { getPostsByCreatorId } = require('./handlers/posts-handlers/getPostsByCreatorId');
const { getPostsByJoinerId } = require('./handlers/posts-handlers/getPostsByJoinerId');
const { postNewActivityPost } = require('./handlers/posts-handlers/postNewActivityPost');
const { deletePostById } = require('./handlers/posts-handlers/deletePostByPostId');
const { getPostById } = require('./handlers/posts-handlers/getPostByPostId');
const { putjoinByUserId } = require('./handlers/posts-handlers/putJoinActivity');
const { cancelActivityByPostId } = require('./handlers/posts-handlers/cancelActivityByPostId');
const { updateFollowingUsers} = require('./handlers/current-user-handlers/followUsers');
const { chatSocket } = require('./chat-socket/index');
const { getLoginSession, postLoginSession, deleteLoginSession } = require('./handlers/express-sessoin-handlers/express-session-handlers');
const socketIo = require("socket.io");


const cors = require("cors");
var bodyParser = require('body-parser');

const PORT = 8000;
const frontUrl = "http://localhost:3000";

const app = express();

app.use(cors({
    origin: frontUrl,
    credentials: true
}));
app.use(express.json());
app.use(
    session({
        secret: "keyboard cat",
        cookie: { maxAge: 1000 * 60 * 60 }, // expira en una hora
        resave: true,
        saveUninitialized: true,
    })
);

app.use(express.json({limit: '50mb'}));

// Swagger UI - Documentación de la API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
// Obtener todos los usuarios
app.get("/users", getUsers);

/**
 * @swagger
 * /users/{_id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 */
// Obtener un usuario único por número _id único
app.get("/users/:_id", getUserById);

/**
 * @swagger
 * /users/add:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 */
// Cuando un usuario se registra con una nueva cuenta, publicar la información del nuevo usuario
app.post("/users/add", addNewUser);

/**
 * @swagger
 * /loggedin:
 *   get:
 *     summary: Obtener información del usuario actual logueado
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Usuario logueado
 */
// Almacenar información del usuario en la colección 'usuario actual' cuando un usuario inicia o cierra sesión
app.get("/loggedin", getLoggedinUser);

/**
 * @swagger
 * /loggedout/{email}:
 *   delete:
 *     summary: Cerrar sesión del usuario
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 */
// Cuando un usuario cierra sesión, borrar los datos de la colección 'usuario actual'
app.delete("/loggedout/:email", deleteCurrentUser);

/**
 * @swagger
 * /users/follow:
 *   put:
 *     summary: Seguir o dejar de seguir a un usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Acción completada
 */
// Actualizar la matriz de seguimiento para el usuario actual y las matrices de seguidores para el usuario que está siendo seguido
app.put("/users/follow", updateFollowingUsers);

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Obtener todos los posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de posts/actividades
 */
// Obtener todos los posts de la base de datos
app.get('/posts', getPosts);

/**
 * @swagger
 * /posts/creator/{_id}:
 *   get:
 *     summary: Obtener posts creados por un usuario
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Posts del creador
 */
// Obtener todos los posts por _id del creador
app.get('/posts/creator/:_id', getPostsByCreatorId);

/**
 * @swagger
 * /posts/joiner/{_id}:
 *   get:
 *     summary: Obtener posts en los que el usuario participa
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Posts en los que participa
 */
// Obtener todos los posts en los que se une un usuario
app.get('/posts/joiner/:_id', getPostsByJoinerId );

/**
 * @swagger
 * /posts/add:
 *   post:
 *     summary: Publicar una nueva actividad
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Actividad creada exitosamente
 */
// Publicar una nueva actividad
app.post('/posts/add', postNewActivityPost);

/**
 * @swagger
 * /posts/delete/{_id}:
 *   delete:
 *     summary: Eliminar un post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post eliminado
 */
// Eliminar un post existente
app.delete('/posts/delete/:_id',deletePostById);

/**
 * @swagger
 * /posts/{_id}:
 *   get:
 *     summary: Obtener un post por su ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post encontrado
 */
// Obtener post por su _id único
app.get('/posts/:_id', getPostById );

/**
 * @swagger
 * /post/updateJoining:
 *   put:
 *     summary: Unirse o salirse de una actividad
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Acción completada
 */
// Manejar al usuario actual uniéndose o retirándose de una actividad
app.put('/post/updateJoining', putjoinByUserId);

/**
 * @swagger
 * /post/cancelActivity/{postId}:
 *   delete:
 *     summary: Cancelar una actividad
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Actividad cancelada
 */
// Cancelar una actividad (solo el creador)
app.delete('/post/cancelActivity/:postId', cancelActivityByPostId);

/**
 * @swagger
 * /get-login-session:
 *   get:
 *     summary: Obtener la sesión actual
 *     tags: [Session]
 *     responses:
 *       200:
 *         description: Información de sesión
 */
// Obtener la sesión del usuario actual desde express-session
app.get("/get-login-session", getLoginSession);

/**
 * @swagger
 * /add-login-session:
 *   post:
 *     summary: Agregar datos de sesión al iniciar sesión
 *     tags: [Session]
 *     responses:
 *       200:
 *         description: Sesión creada
 */
// Agregar datos del usuario actual a express-session cuando el usuario inicia sesión
app.post("/add-login-session", postLoginSession);

/**
 * @swagger
 * /delete-login-session:
 *   delete:
 *     summary: Eliminar sesión al cerrar sesión
 *     tags: [Session]
 *     responses:
 *       200:
 *         description: Sesión eliminada
 */
// Eliminar datos del usuario actual cuando el usuario cierra sesión
app.delete("/delete-login-session", deleteLoginSession);

var server = app.listen(PORT, function () {
    console.info("🌍 Listening on port " + PORT);
});

const io = socketIo(server, {
    cors: {
        origin: [frontUrl],
    },
});

io.on("connection", (socket) => chatSocket(io,socket));