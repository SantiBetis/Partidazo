const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const saltRounds = 10;

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// *************************************************************************
// Esta función manejadora se utiliza para manejar la adición de un nuevo usuario to the database
// Su punto final se llama cuando un nuevo usuario se registra de la sign-up page
// *************************************************************************

const addNewUser = async (req, res) => {
    try {
        // Desestructurando las entradas del usuario para validaciones
        const { 
            displayName,
            email,
            DOB,
            location,
            password,
            confirmPassword,
            imgSrc,
        } = req.body;

        // consulta para verificar si ya existe una cuenta asociada con este correo electrónico
        const query = { email };

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Escribir la fecha en formato ISO YYYY-MM-DDTHH:mm:ss.sssZ
        const d = new Date();
        let todayDate = d.toISOString();

        // agregar los nuevos datos del usuario con todos los demás valores iniciales for a new user
        const newUserInfo = 
        { ...req.body,
            password:hashedPassword,// used the hashed password
            _id: uuidv4(), // crear un nuevo _id para el nuevo usuario
            followers:[], // los seguidores se guardan en una matriz of follower users _ids. Example: [{ _id: <follower1_id> }, { _id: <follower2_id> }, ... ]
            following:[], // similar to matriz de seguidores, los usuarios seguidos se guardan en una matriz of following users _ids
            joined: todayDate,
            activitiesPosted: [], // Las actividades publicadas se guardarán en una matriz con cada _id del post. Ejemplo: [{ _id: <post1_id> }, { _id: <post2_id> }, ... ]
            activitiesJoined: [],  // Similar a la matriz activitiesPosted.
            notifications:[] // los detalles de notificaciones contienen al usuario, actividad,  tipo de notificación, and mensaje de notificación
        }

        // Validar las entradas del usuario
        if( password === "" ){
            return res.status(400).json({ status: 400, data:newUserInfo,  message: "Tu contraseña falta"})
        }
        else if( password !== confirmPassword ){
            return res.status(400).json({ status: 400, data:newUserInfo,  message: "Las contraseñas no coinciden"})
        }
        else if( displayName === ""){
            return res.status(400).json({ status: 400, data:newUserInfo,  message: "Tu nombre completo falta"})
        }
        else if ( email === ""){
            return res.status(400).json({ status: 400,data:newUserInfo, message: "Tu correo electrónico falta"})
        }
        else if ( DOB === ""){
            return res.status(400).json({ status: 400,data:newUserInfo, message: "Tu fecha de nacimiento falta"})
        }
        else if ( imgSrc === ""){
            return res.status(400).json({ status: 400,data:newUserInfo, message: "Tu imagen de perfil falta"})
        }
        else if ( location === ""){
            return res.status(400).json({ status: 400,data:newUserInfo, message: "Tu ciudad falta"})
        }


        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        console.log("connected");

        const db = client.db("SportsPickApp");

        // Verificar si ya existe una cuenta con el correo electrónico registrado
        const result = await db.collection("users").find(query).toArray();

        if(result.length !== 0){
            client.close();
            console.log("disconnected");
            return res.status(400).json({ status: 400, result:newUserInfo,  message: "Ya existe una cuenta con el correo proporcionado"})
        };

        await db.collection("users").insertOne(newUserInfo);

        client.close();
        console.log("disconnected");

        // si todas las entradas pasan la validación, entonces permitir que el usuario cree la nueva cuenta
        return res.status(200).json({ status: 200, data: newUserInfo, message: "La información del usuario ha sido agregada"})

    } catch (err) {
        console.log("Error:", err);
    }
};

module.exports = { addNewUser }