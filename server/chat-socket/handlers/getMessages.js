/**
 * Obtiene todos los mensajes de una actividad y los emite a todos los clientes en la sala.
 * Busca el post (actividad) por ID y extrae el array messages[].
 * Emite el evento 'get-messages' a todos los sockets en la sala (room).
 * Si no hay mensajes, emite un array vacío.
 * @param {MongoClient} client - Cliente de MongoDB conectado
 * @param {Server} io - Instancia del servidor Socket.IO
 * @param {string} room - ID de la actividad (sala de chat)
 */
const getMessages = async (client, io, room) => {

    const db = client.db("Partidazo");
    const query = {_id: room };
    const post = await db.collection('posts').find(query).toArray();
    // Verificar si existen mensajes en el post
    if(post[0].messages){
        io.in(room).emit('get-messages',post[0].messages);
    }
    else {
        io.in(room).emit('get-messages', []);
    }

};

module.exports = { getMessages }