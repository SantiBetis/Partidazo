const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;
const bcrypt = require("bcrypt");


const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// ***********************************************************************************
// Este manejador se utiliza para permitir que el usuario inicie sesión. It validates the user credentials and 
// guardar la información del usuario actual en la base de datos in 'usuario actual' colección
// ************************************************************************************

const getLoggedinUser = async (req, res) => {

    const { email, password } = req.query;
    // const query = { email, password };
    const query = { email };

    if( email === ''){
        return res.status(400).json({status: 404, message: "Por favor ingresa tu correo electrónico"})
    }
    else if( password === ''){
        return res.status(400).json({status: 404, message: "Por favor ingresa tu contraseña"})
    }

try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected");

    const db = client.db("Partidazo");
    // Buscar un usuario cuando se ingresa la dirección de correo
    const result = await db.collection("users").findOne(query);

    if(result){
        // Si la contraseña es hash ( funciona para cuentas después de que se agregue esta característica )
        // luego verifica si la contraseña ingresada coincide con la contraseña en la base de datos 
        const cmp = await bcrypt.compare(password, result.password);
        if (cmp || password === result.password) {
            client.close();
            console.log("disconnected");
            return res.status(200).json({status:200, result, message:"Usuario iniciado sesión exitosamente"})
        } else {
            client.close();
            console.log("disconnected");
            return res.status(404).json({status: 404, message: "Correo o contraseña incorrecta, por favor intenta de nuevo"})
        }
    }
    else {
        client.close();
        console.log("disconnected");
        return res.status(404).json({status: 404, message: "Correo o contraseña incorrecta, por favor intenta de nuevo"})
    }

} catch (err) {
    console.log("Error:", err);
    return res.status(500).json({status: 500, message: "Error del servidor"})
}
};

module.exports = { getLoggedinUser }