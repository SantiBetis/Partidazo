const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// ******************************************************************
// El manejador borra los datos del usuario que cerró sesión
// de la colección 'currentUser' en la base de datos
// *******************************************************************

const deleteCurrentUser = async (req,res) => {
    const { email } = req.params;
    const query = { email };
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        console.log("connected");

        const db = client.db("SportsPickApp");

        client.close();
        console.log("disconnected");

        return res.status(200).json({ status: 200, email, message: 'Usuario cerró sesión exitosamente'});

    } catch (err) {
        console.log("Error:", err);
    }
};

module.exports = { deleteCurrentUser };
