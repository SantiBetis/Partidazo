const path = require("path");
const express = require("express");
var session = require("express-session");
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


// Obtener todos los usuarios
app.get("/users", getUsers);
// Obtener un usuario único por número _id único
app.get("/users/:_id", getUserById);
// Cuando un usuario se registra con una nueva cuenta, publicar la información del nuevo usuario
app.post("/users/add", addNewUser);
// Almacenar información del usuario en la colección 'usuario actual' cuando un usuario inicia o cierra sesión
app.get("/loggedin", getLoggedinUser);
// Cuando un usuario cierra sesión, borrar los datos de la colección 'usuario actual'
app.delete("/loggedout/:email", deleteCurrentUser);
// Actualizar la matriz de seguimiento para el usuario actual y las matrices de seguidores para el usuario que está siendo seguido
app.put("/users/follow", updateFollowingUsers);

// Obtener todos los posts de la base de datos
app.get('/posts', getPosts);
// Obtener todos los posts por _id del creador
app.get('/posts/creator/:_id', getPostsByCreatorId);
// Obtener todos los posts en los que se une un usuario
app.get('/posts/joiner/:_id', getPostsByJoinerId );
// Publicar una nueva actividad
app.post('/posts/add', postNewActivityPost);
// Eliminar un post existente
app.delete('/posts/delete/:_id',deletePostById);
// Obtener post por su _id único
app.get('/posts/:_id', getPostById );

// Manejar al usuario actual uniéndose o retirándose de una actividad
app.put('/post/updateJoining', putjoinByUserId);

// Obtener la sesión del usuario actual desde express-session
app.get("/get-login-session", getLoginSession);
// Agregar datos del usuario actual a express-session cuando el usuario inicia sesión
app.post("/add-login-session", postLoginSession);
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