const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
/**
 * Handler para obtener todos los posts de actividades con filtros opcionales.
 * Retorna todas las actividades de la base de datos.
 * Soporta filtrado por tipo de actividad (deporte) y nivel de habilidad.
 * Los filtros "All" (Todos) retornan todos los posts sin filtrar ese campo.
 * Llamado desde el feed principal (Home) para mostrar actividades disponibles.
 */
const getPosts = async (req, res) => {
try {

    const { actividadType, level } = req.query;

    let query = {};

    // Construir la consulta de MongoDB según los filtros seleccionados
    // Si ambos son "All", no se aplica ningún filtro (query vacío)
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

    const db = client.db("Partidazo");
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