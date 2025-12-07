const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// *************************************************************************
// The handler gets an actividad post data de la database
// *************************************************************************

const getPostById = async (req,res) => {

    try{
        const { _id } = req.params; // Obtener el _id del post 
        const query = { _id };
    
        // Conectar a MongoDB
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        console.log("connected");

        // Conectar a la base de datos
        const db = client.db("SportsPickApp");
        // Encontrar el post basado en el _id del post proporcionado
        const result = await db.collection("posts").findOne(query);
        
        client.close();
        console.log("disconnected");
        
        if(result) {
            res.status(200).json({ status: 200, post: result });
        } else {
            res.status(404).json({
                status: 404,
                message: `Información de la actividad no encontrada con el ID proporcionado ${_id}`,
            });
        }
            
    }
    catch(err){
        console.log("disconnected");
        console.log(err);
        res.status(500).json({ status: 500, message: "Error del servidor" });
    }
}

module.exports = { getPostById }
