const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// ***************************************************************
// Este manejador de actualización se encarga de actualizar los seguidores y 
// información de seguimiento para usuarios en la base de datos
//****************************************************************
const updateFollowingUsers = async (req, res) => {
    try {
        const { currentUser , targetedUser } = req.body;

        // Conectar a MongoDB
        const client = new MongoClient(MONGO_URI, options);
        const db = client.db("Partidazo");
        await client.connect();
        console.log("connected");

        // Primero queremos saber si el usuario actual ha seguido al usuario objetivo. Hay 2 posibles actualizaciones:
        // Caso 1: si el usuario actual no ha seguido al usuario objetivo, entonces el punto final manejará el seguimiento
        // Caso 2: si el usuario actual ya ha seguido al usuario objetivo, entonces el punto final manejará dejar de seguir

        const query = { _id: targetedUser._id, "followers._id":currentUser._id }

        const result = await db.collection("users").findOne(query);

        // Caso 1: se encuentra un resultado, lo que significa que el usuario actual ya ha seguido al usuario objetivo
        // por lo tanto, el punto final manejará dejar de seguir
        if(result){

            // Queremos actualizar dos cosas
            // 1- la matriz de seguimiento que contiene todas las cuentas que el usuario actual está siguiendo
            // 2- la matriz de seguidores que contiene las cuentas que siguen a un usuario
            const updateFollowing = { $pull: { following: { _id: targetedUser._id } } };
            const updateFollowers = { $pull: { followers: { _id: currentUser._id }} };

            // Actualizar a ambos usuarios el seguidor (usuario actual) y el usuario seguido en la colección de usuarios
            const resultFollowingUser = await db.collection("users").updateOne({ _id: currentUser._id }, updateFollowing );

            const resultFollowedUSer = await db.collection("users").updateOne({ _id: targetedUser._id }, updateFollowers);

            // Actualizar la información del usuario actual en la colección currentUser
            const resultCurrentUser = await db.collection("currentUser").updateOne({ _id: currentUser._id }, updateFollowing );

            client.close();
            console.log("disconnected");
        
            return res.status(200).json({ status: 200, message: 'Has dejado de seguir a esta cuenta exitosamente'})

        }

        // Caso 2: no se encuentra un resultado, lo que significa que el usuario actual no ha seguido al usuario objetivo
        // por lo tanto, el punto final manejará el seguimiento
        else {

            // Queremos actualizar 3 cosas
            // 1- la matriz de seguimiento que contiene todas las cuentas que el usuario actual está siguiendo
            // 2- la matriz de seguidores que contiene las cuentas que siguen a un usuario
            // 3- Agregar una notificación al perfil del usuario objetivo

            const date = new Date;

            const notification = { 
                _id: uuidv4(),
                date: date.toISOString(),
                type:'follow',
                user:{
                    _id:currentUser._id,
                    imgSrc:currentUser.imgSrc,
                    displayName: currentUser.displayName
                },
                activity:undefined,
                message:'comenzó a seguirte',
            }

            const updateFollowing = { $addToSet: { following: { _id: targetedUser._id } } };
            const updateFollowers = { $addToSet: { followers: { _id: currentUser._id }} };
            const updateNotifications = { $addToSet: { notifications: { ... notification }} };

            // Actualizar a ambos usuarios el seguidor (usuario actual) y el usuario seguido en la colección de usuarios
            const resultFollowingUser = await db.collection("users").updateOne({ _id: currentUser._id }, updateFollowing );

            const resultFollowedUSer = await db.collection("users").updateOne({ _id: targetedUser._id }, updateFollowers);

            // Actualizar la información del usuario actual en la colección currentUser
            // const resultCurrentUser = await db.collection("currentUser").updateOne({ _id: currentUser._id }, updateFollowing );

            // Agregar las notificaciones al perfil del usuario objetivo
            const resultNotifications = await db.collection("users").updateOne({ _id: targetedUser._id }, updateNotifications); 


            client.close();
            console.log("disconnected");
        
            return res.status(200).json({ status: 200, message: 'Has seguido a esta cuenta exitosamente'})

        }
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ status: 500, message: "Error del servidor" });
    }
}

module.exports = { updateFollowingUsers }