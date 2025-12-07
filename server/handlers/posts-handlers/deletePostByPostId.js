// ***********************************************************************************
// Este handler se utiliza para eliminar todo sobre un post específico de la base de datos
// El punto final del handler podría no ser utilizado en el frontend
// En su lugar, otro handler llamado cancelPostById cancelará esa actividad
// ***********************************************************************************

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// ************************************************************************************
// Este es un handler muy importante que se utiliza para eliminar todos los datos relacionados con la actividad
// de un post específico en la base de datos. No se está utilizando en el lado del cliente (frontend) de
// esta versión de la app. Más bien, es importante usarse en el proceso de prueba
// en caso de que una publicación de actividad necesite ser eliminada completamente.
// *************************************************************************************

const deletePostById = async (req, res) => {

    try {
        const { _id } = req.params;
        const query = { _id };
    
        // Conectar a MongoDB
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        console.log("connected");
    
        // Conectar a la base de datos
        const db = client.db("Partidazo");
    
        // Eliminar el post de 'posts' colección
        await db.collection("posts").deleteOne(query);
    
        // Usar el operador $pull para eliminar todas las instancias dadas de una matriz existente
        const removeDeletedPostFromAllUsers = { $pull: { postedActivities: { _id } , joinedActivities: { _id } } };
    
        // Actualizar todos los perfiles de usuarios en colección 'users'
        await db.collection("users").updateMany({},removeDeletedPostFromAllUsers, { multi: true });
    
        // Actualizar todos los perfiles de usuarios en colección 'currentUser'
        await db.collection("currentUser").updateMany({},removeDeletedPostFromAllUsers, { multi: true });

        client.close();
        console.log("disconnected");

        return res
            .status(200)
            .json({
            status: 200,
            data: _id,
            message: "La actividad con el ID proporcionado ha sido eliminada",
            });
    }
    catch(err){
        client.close();
        console.log("disconnected");
        console.log("Error:", err);
    }
}

module.exports = { deletePostById }