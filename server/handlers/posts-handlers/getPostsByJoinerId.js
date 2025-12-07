const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// ************************************************************************
// This handler gets all the actividad posts that a specific user has joined.
// Los datos de los posts se muestran luego en el perfil de ese usuario
// ************************************************************************

const getPostsByJoinerId = async (req, res) => {
try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected");

    const { _id } = req.params;

    const query = { 'participando._id':_id };

    const db = client.db("SportsPickApp");
    // Pasar por todos los posts y encontrar los posts que tienen al usuario objetivo en 'participando' matriz
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

module.exports = { getPostsByJoinerId }