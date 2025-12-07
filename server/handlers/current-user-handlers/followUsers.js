const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

/**
 * Handler para seguir/dejar de seguir usuarios (toggle follow/unfollow).
 * Si el usuario NO está en followers[], lo agrega (seguir).
 * Si el usuario YA está en followers[], lo elimina (dejar de seguir).
 * Actualiza tanto el array followers[] del usuario objetivo como following[] del usuario actual.
 * Llamado desde FollowButton en el frontend.
 */
const updateFollowingUsers = async (req, res) => {
    try {
        // Extraer el usuario actual (quien hace la acción) y el usuario objetivo (a quien seguir/dejar de seguir)
        const { usuarioActual , targetedUser } = req.body;

        // Conectar a MongoDB
        const client = new MongoClient(MONGO_URI, options);
        const db = client.db("Partidazo");
        await client.connect();
        console.log("connected");

        // Verificar si el usuario actual ya está siguiendo al usuario objetivo
        // Query busca el usuario objetivo Y verifica si usuarioActual está en su array followers[]
        const query = { _id: targetedUser._id, "followers._id":usuarioActual._id }

        const result = await db.collection("users").findOne(query);

        // CASO 1: Si se encuentra resultado, el usuario actual YA sigue al objetivo → DEJAR DE SEGUIR
        if(result){

            // Actualizar dos arrays:
            // 1- following[] del usuario actual (quitar al usuario objetivo)
            // 2- followers[] del usuario objetivo (quitar al usuario actual)
            const updateFollowing = { $pull: { following: { _id: targetedUser._id } } };
            const updateFollowers = { $pull: { followers: { _id: usuarioActual._id }} };

            // Actualizar a ambos usuarios el seguidor (usuario actual) y el usuario seguido en la colección de usuarios
            const resultFollowingUser = await db.collection("users").updateOne({ _id: usuarioActual._id }, updateFollowing );

            const resultFollowedUSer = await db.collection("users").updateOne({ _id: targetedUser._id }, updateFollowers);

            // Actualizar la información del usuario actual en la colección usuarioActual
            const resultusuarioActual = await db.collection("usuarioActual").updateOne({ _id: usuarioActual._id }, updateFollowing );

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
                    _id:usuarioActual._id,
                    imgSrc:usuarioActual.imgSrc,
                    displayName: usuarioActual.displayName
                },
                activity:undefined,
                message:'comenzó a seguirte',
            }

            const updateFollowing = { $addToSet: { following: { _id: targetedUser._id } } };
            const updateFollowers = { $addToSet: { followers: { _id: usuarioActual._id }} };
            const updateNotifications = { $addToSet: { notifications: { ... notification }} };

            // Actualizar a ambos usuarios el seguidor (usuario actual) y el usuario seguido en la colección de usuarios
            const resultFollowingUser = await db.collection("users").updateOne({ _id: usuarioActual._id }, updateFollowing );

            const resultFollowedUSer = await db.collection("users").updateOne({ _id: targetedUser._id }, updateFollowers);

            // Actualizar la información del usuario actual en la colección usuarioActual
            // const resultusuarioActual = await db.collection("usuarioActual").updateOne({ _id: usuarioActual._id }, updateFollowing );

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
