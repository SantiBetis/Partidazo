const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;
const bcrypt = require("bcrypt");


const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

/**
 * Handler para autenticar e iniciar sesión de usuarios.
 * Valida las credenciales (email y contraseña) contra la base de datos.
 * Soporta contraseñas hasheadas con bcrypt y contraseñas legacy en texto plano.
 * Retorna la información completa del usuario si las credenciales son válidas.
 * Llamado desde LoginPage en el frontend.
 */
const getLoggedinUser = async (req, res) => {

    // Extraer email y contraseña de los query parameters
    const { email, password } = req.query;
    // const query = { email, password };
    const query = { email };

    // Validar que los campos no estén vacíos antes de consultar la base de datos
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
    // Buscar usuario en la base de datos por email
    const result = await db.collection("users").findOne(query);

    if(result){
        // Verificar la contraseña usando bcrypt (para cuentas con hash)
        // o comparación directa (para cuentas legacy sin hash)
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