// ***********************************************************************************
// Este manejador se utiliza para eliminar todo about a specific post de la database
// El punto final del manejador podría no ser utilizado in the frontend 
// En su lugar, otro manejador llamado cancelPostById will cancel that actividad
// ***********************************************************************************

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// ************************************************************************************
// Este es un manejador muy importante that is used to delete all actividad related data of
// of specific post in the databse. No se está utilizando en el lado del cliente (frontend) of 
// this version of the app.Más bien, es importante usarse en el proceso de prueba
// in case an actividad post needs to be deleted completely.
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
        const db = client.db("SportsPickApp");
    
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