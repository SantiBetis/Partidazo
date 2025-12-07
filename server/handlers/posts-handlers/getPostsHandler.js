const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// *******************************************************************************
// Este manejador obtiene todos los posts de la base de datos. Giving that the initial
// data there for posts are small, el feed de inicio muestra todos los posts en la base de datos.
// 2 se han agregado consultas para filtrar los posts: actividad type, and level required
// *******************************************************************************

const getPosts = async (req, res) => {
try {

    const { actividadType, level } = req.query;

    let query = {};

    // Verificar los filtros y crear una consulta basada en los valores de los filtros
    if( actividadType === "All" && level === "All" ){
        query = {};
    }
    else if( actividadType && level === "All" ){
        query = { actividadType };
    }
    else if ( actividadType === "All" && level ){
        query = { level };
    }
    else if( actividadType && level ){
        query = { actividadType, level };
    }

    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected");

    const db = client.db("SportsPickApp");
    const posts = await db.collection("posts").find(query).toArray();

    client.close();
    console.log("disconnected");

    res.status(200).json({
        status: 200,
        posts,
    });
} catch (err) {
    client.close();
    console.log("disconnected");
    console.log("Error:", err);
}
};

module.exports = { getPosts }