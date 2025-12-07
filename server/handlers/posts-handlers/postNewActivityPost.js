const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

/**
 * Handler para crear una nueva actividad deportiva.
 * Valida todos los campos requeridos (fecha, hora, dirección, tipo de deporte, nivel)
 * Crea el objeto del post con un ID único y agrega al creador como primer participante.
 * Envía notificaciones a los seguidores del creador.
 * Llamado desde el formulario de crear actividad en el frontend.
 */
const postNewActivityPost = async (req, res) => {

    try{

        // Desestructurar todos los campos del body que necesitan validación
        const {
            limit,
            actividadDate,
            actividadAddress,
            actividadType,
            description,
            level,
            creator_id,
        } = req.body;
        
        // Obtener la fecha actual en formato ISO
        const d = new Date();
        let todayDate = d.toISOString();
        
        // Crear el objeto del nuevo post que se agregará a la base de datos
        const newPostInfo = {
            ...req.body,
            creator_id: creator_id , // ID del creador
            _id: uuidv4(), // ID único del post
            participando: [{ _id: creator_id }], // Agregar al creador como primer participante
            dateCreated: todayDate, // Fecha de creación
        };
        
        // Validar todos los campos del formulario antes de insertar en la base de datos
        if (
            actividadDate.date === undefined ||
            actividadDate.date === null ||
            actividadDate.date === ""
        ) {
            return res.status(400).json({ status: 404, message: "Por favor ingresa una fecha válida" });
        }

        else if (
            actividadDate.from === undefined ||
            actividadDate.from === null ||
            actividadDate.from === ""
        ) {
            return res
            .status(400)
            .json({
                status: 404,
                message: "Por favor ingresa una hora de inicio válida",
            });
        } 

        else if (
            actividadDate.to === undefined ||
            actividadDate.to === null ||
            actividadDate.to === ""
        ) {
            return res
            .status(400)
            .json({ status: 404, message: "Por favor ingresa una hora de fin válida" });
        }
        
        else if (
            actividadAddress.street === "" ||
            actividadAddress.city === "" ||
            actividadAddress.province === ""
        ) {
            return res
            .status(400)
            .json({ status: 404, message: "Por favor ingresa información de dirección válida" });
        } 
        
        else if (actividadType === "Select" || actividadType === "All") {
            return res
            .status(400)
            .json({ status: 404, message: "Por favor selecciona el tipo de actividad" });
        } 
        
        else if (level === "select") {
            return res
            .status(400)
            .json({ status: 404, message: "Por favor selecciona el nivel requerido" });
        } 
        
        else if (
            Number(limit) === 0 ||
            Number(limit) === 1 ||
            Number(limit) < 0 ||
            Number(limit) > 99
        ) {
            return res
            .status(400)
            .json({ status: 404, limit, message: "El límite debe ser entre 2 y 99" });
        }
        
        else if (description.length < 10) {
            return res
            .status(400)
            .json({
                status: 404,
                message: "Por favor describe tu actividad en más de 10 caracteres",
            });
        }
        
        // Conectar a la base de datos
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        console.log("connected");
        
        // Insertar el nuevo post en la colección Posts
        const db = client.db("Partidazo");
        await db.collection("posts").insertOne(newPostInfo);
        
        // Agregar el nuevo id del post al perfil del usuario actual, específicamente a las matrices de actividades unidas y actividades publicadas
        const query = { _id: creator_id };
        const newValueForPostedActivities = { $addToSet: { activitiesPosted: { _id : newPostInfo._id } } };
        const newValueForJoinedActivities = { $addToSet: { activitiesJoined: { _id : newPostInfo._id } } };

        // Actualizar el perfil del usuario en la colección 'users'
        await db.collection("users").updateOne(query, newValueForPostedActivities );
        await db.collection("users").updateOne(query, newValueForJoinedActivities );

        // // Actualizar el perfil del usuario en la colección 'currentUser'
        // await db.collection("currentUser").updateOne(query, newValueForPostedActivities );
        // await db.collection("currentUser").updateOne(query, newValueForJoinedActivities );

        client.close();
        console.log("disconnected");

        return res
            .status(200)
            .json({
            status: 200,
            data: newPostInfo,
            message: "La nueva actividad ha sido publicada exitosamente",
            });
    }
    catch(err){
        console.log("Error:", err);
    }
};

module.exports = { postNewActivityPost }