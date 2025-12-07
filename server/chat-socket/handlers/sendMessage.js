/**
 * Guarda un nuevo mensaje en la base de datos.
 * Agrega el mensaje al array messages[] del post (actividad) correspondiente.
 * El room es el _id de la actividad (post).
 * Llamado desde el evento 'send-message' del socket.
 * @param {MongoClient} client - Cliente de MongoDB conectado
 * @param {Object} message - Objeto del mensaje con texto, autor, timestamp
 * @param {string} room - ID de la actividad (sala de chat)
 */
const sendMessage = async (client, message, room) => {

    const db = client.db("Partidazo");
    const query = {_id: room };
    // Agregar el mensaje al array messages[] usando $push
    const addMessage = { $push: { messages: { ...message } } };

    await db.collection("posts").updateOne(query, addMessage); 
}
;

module.exports = { sendMessage }