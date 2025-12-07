const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// ***********************************************************************
// Esta función manejadora se utiliza para recuperar la información de un usuario basada en
// el _id único del usuario
// ***********************************************************************

const getUserById = async (req, res) => {

    const { _id } = req.params;
    const query = { _id };
try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected");

    const db = client.db("SportsPickApp");
    const result = await db.collection("users").findOne(query);
    
    client.close();
    console.log("disconnected");
    
    if(result) {
        res.status(200).json({ status: 200, user: result });
    } else {
        res.status(404).json({
            status: 404,
            message: `la información del usuario con ID ${_id} no fue encontrada`,
        });
    }

} catch (err) {
    console.log("Error:", err);
    res.status(500).json({ status: 500, message: "Error del servidor" });
}
};

module.exports = { getUserById }