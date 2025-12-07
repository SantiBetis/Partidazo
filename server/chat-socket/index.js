const { MongoClient } = require("mongodb");
const { getMessages } = require('./handlers/getMessages');
const { sendMessage } = require('./handlers/sendMessage');

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

/**
 * Handler principal para gestionar conexiones de chat en tiempo real con Socket.IO.
 * Cada actividad tiene su propia sala de chat identificada por actividadId.
 * Escucha eventos de envío de mensajes y desconexión.
 * Mantiene la conexión a MongoDB durante toda la sesión del socket.
 * @param {Object} io - Instancia de Socket.IO server
 * @param {Object} socket - Socket individual del cliente conectado
 */
const chatSocket = async (io,socket) => {
    const client = new MongoClient(MONGO_URI, options);
    // Obtener el ID de la actividad desde el handshake para unirse a la sala correcta
    const room = socket.handshake.query.actividadId;
    console.log("---------------------");

    await client.connect();

    console.log("MongoClient connected");
    console.log("New client connected: ", socket.id);

    await socket.join(room);
    console.log("Client joined ", room);

    // Escuchar evento cuando un usuario envía un mensaje
    // Guarda el mensaje en MongoDB y emite los mensajes actualizados a todos en la sala
    await socket.on("send-message", async (message) => {
        await sendMessage(client, message, room);
        await getMessages(client, io, room);
    });

    // Escuchar evento de desconexión para cerrar la conexión a MongoDB
    await socket.on("disconnect", () => {
        client.close();
        console.log("MongoClient disconnected");
        console.log("Client Left ", room);
        console.log("Client disconnected", socket.id);
    });

    getMessages(client, io, room);
};

module.exports = { chatSocket }