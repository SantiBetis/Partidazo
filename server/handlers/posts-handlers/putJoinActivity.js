const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// *******************************************************************************************
// Este manejador es para gestionar la participación y el retiro de una actividad
// Si el usuario no se ha unido a la actividad aún, el manejador permitirá que el usuario se una
// Si el usuario ya se ha unido a la actividad, el manejador permitirá que el usuario se retire
// *******************************************************************************************

const putjoinByUserId = async (req, res) => {
    try {
        // El _id del usuario actual, se utilizará para permitir que el usuario se una o se retire de una actividad
        // El _id del post determinará cuál actividad el usuario actual está apuntando
        const { currentUser, postData } = req.body;

        // Encontrar el post con post _id y encontrar el _id del usuario actual en la matriz 'participando'
        const query = { _id: postData._id, "participando._id": currentUser._id };

        // Conectar a MongoDB
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        console.log("connected");

        // Conectar a la base de datos
        const db = client.db("Partidazo");

        // Encontrar el post con la consulta proporcionada
        const result = await db.collection("posts").findOne(query);
        
        // Si se encuentra un resultado, significa que el usuario ya se ha unido 
        // por lo que el punto final manejará el retiro de la actividad
        if (result) {
            // Crear una notificación para agregar al perfil del creador del post cuando el usuario actual se retira
            const date = new Date;
            const notification = { 
                _id: uuidv4(),
                date: date.toISOString(),
                type:'withdraw',
                user:{
                    _id:currentUser._id,
                    imgSrc:currentUser.imgSrc,
                    displayName: currentUser.displayName
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
            const removeUserfromPost = { $pull: { participando: { _id: currentUser._id } } };
            // Encontrar el post y eliminar al usuario actual de la actividad
            const resultPostUpdate = await db.collection("posts").updateOne(postQuery, removeUserfromPost);

            // Consulta para encontrar un usuario y remover la actividad unida del perfil
            const userQuery = { _id: currentUser._id };
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
                    _id:currentUser._id,
                    imgSrc:currentUser.imgSrc,
                    displayName: currentUser.displayName
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
            const addUserToPost = { $push: { participando: { _id: currentUser._id } } }
            // Encontrar el post y agregar el usuario actual a la actividad
            const resultPostUpdate = await db.collection('posts').updateOne(postQuery,addUserToPost);

            // Consulta para encontrar un usuario y agregar la actividad unida al perfil
            const userQuery = { _id: currentUser._id };
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
