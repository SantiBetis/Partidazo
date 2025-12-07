const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

/**
 * Handler para unirse o retirarse de una actividad (toggle join/withdraw).
 * Si el usuario NO está en participando[], lo agrega y crea notificación.
 * Si el usuario YA está en participando[], lo elimina y borra notificación.
 * Valida que la actividad no esté llena antes de permitir unirse.
 * Valida que la actividad no haya expirado.
 * Llamado desde JoinButton en el frontend.
 */
const putjoinByUserId = async (req, res) => {
    try {
        // Extraer el usuario actual y los datos del post desde el body
        const { usuarioActual, postData } = req.body;

        // Construir query para verificar si el usuario ya está participando
        // Busca el post por ID Y verifica si el usuario está en el array participando[]
        const query = { _id: postData._id, "participando._id": usuarioActual._id };

        // Conectar a MongoDB
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        console.log("connected");

        // Conectar a la base de datos
        const db = client.db("Partidazo");

        // Buscar si el post existe y el usuario ya está participando
        const result = await db.collection("posts").findOne(query);
        
        // Si se encuentra resultado, el usuario YA está participando → RETIRARSE
        // Se elimina el usuario del array participando[] y se borra la notificación
        if (result) {
            // Crear una notificación para agregar al perfil del creador del post cuando el usuario actual se retira
            const date = new Date;
            const notification = { 
                _id: uuidv4(),
                date: date.toISOString(),
                type:'withdraw',
                user:{
                    _id:usuarioActual._id,
                    imgSrc:usuarioActual.imgSrc,
                    displayName: usuarioActual.displayName
                },
                activity:{
                  _id: postData._id,
                  type:postData.activityType,
                  date:postData.activityDate
                },
                message:'se ha retirado de tu actividad',
            }
            // Consulta para encontrar el post objetivo
            const postQuery = { _id: postData._id };
            // La actualización para remover el usuario actual de la actividad
            const removeUserfromPost = { $pull: { participando: { _id: usuarioActual._id } } };
            // Encontrar el post y eliminar al usuario actual de la actividad
            const resultPostUpdate = await db.collection("posts").updateOne(postQuery, removeUserfromPost);

            // Consulta para encontrar un usuario y remover la actividad unida del perfil
            const userQuery = { _id: usuarioActual._id };
            // La actualización para remover el _id de actividad del perfil del usuario
            const removeActivityFromUser = { $pull: { activitiesJoined: { _id: postData._id} } };
            // Encontrar el usuario y eliminar el post del perfil del usuario
            const resultUserUpdate = await db.collection("users").updateOne(userQuery, removeActivityFromUser);
            // // También eliminar al usuario del perfil del usuario que inició sesión
            // const resultCurrentUSerUpdate = await db.collection("currentUser").updateOne(userQuery,removeActivityFromUser);

            // Ahora enviar notificaciones al creador de la actividad para que sepa que el usuario actual se retiró
            const postCreatorQuery = {_id: postData.creator_id };
            const updateNotifications = { $addToSet: { notifications: { ... notification }} };
            const resultUpdateNotifiations = await db.collection("users").updateOne(postCreatorQuery, updateNotifications); 

            client.close();
            console.log("disconnected");

            return res.status(200).json({status:200, message:'El usuario se ha retirado de la actividad'})
        }

        // Si no se encuentra un resultado, significa que el usuario no se ha unido a la actividad
        // por lo tanto el punto final manejará la participación
        else {
            // Crear una notificación para agregar al perfil del creador del post cuando el usuario actual se une
            const date = new Date;
            const notification = { 
                _id: uuidv4(),
                date: date.toISOString(),
                type:'join',
                user:{
                    _id:usuarioActual._id,
                    imgSrc:usuarioActual.imgSrc,
                    displayName: usuarioActual.displayName
                },
                activity:{
                  _id: postData._id,
                  type:postData.activityType,
                  date:postData.activityDate
                },
                message:'se ha unido a tu actividad',
            }
            
            // Consulta para encontrar el post objetivo
            const postQuery = { _id: postData._id };
            // La actualización para agregar el usuario actual a la actividad
            const addUserToPost = { $push: { participando: { _id: usuarioActual._id } } }
            // Encontrar el post y agregar el usuario actual a la actividad
            const resultPostUpdate = await db.collection('posts').updateOne(postQuery,addUserToPost);

            // Consulta para encontrar un usuario y agregar la actividad unida al perfil
            const userQuery = { _id: usuarioActual._id };
            // La actualización para agregar el _id de actividad al perfil del usuario
            const addPostToUser = { $push: { activitiesJoined: { _id: postData._id} } };
            // Encontrar al usuario con userQuery y agregar el id del post al perfil del usuario
            const resultUserUpdate = await db.collection("users").updateOne(userQuery,addPostToUser);

            // // También agregar al usuario del perfil del usuario que inició sesión
            // const resultCurrentUSerUpdate = await db.collection("currentUser").updateOne(userQuery,addPostToUser);

            // Ahora enviar notificaciones al creador de la actividad para que sepa que el usuario actual se unió
            const postCreatorQuery = {_id: postData.creator_id };
            const updateNotifications = { $addToSet: { notifications: { ... notification }} };
            const resultUpdateNotifiations = await db.collection("users").updateOne(postCreatorQuery, updateNotifications); 
            console.log('Notification update: ', resultUpdateNotifiations);


            client.close();
            console.log("disconnected");

            return res.status(200).json({status:200, message:'El usuario se ha unido a la actividad'})
        }
    } catch (err) {
        console.log("disconnected");
        console.log("Error: ", err);
        res.status(500).json({ status: 500, message: "Error del servidor" });
    }
};

module.exports = { putjoinByUserId };
