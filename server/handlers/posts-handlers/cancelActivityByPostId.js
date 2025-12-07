const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

/**
 * Handler para cancelar (eliminar) una actividad por su ID.
 * Solo el creador de la actividad puede cancelarla.
 * Elimina el post de la base de datos.
 * Elimina todas las notificaciones asociadas a esta actividad de todos los usuarios participantes.
 * Llamado desde CancelButton en el frontend.
 */
const cancelActivityByPostId = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const { postId } = req.params;
    const { usuarioActual } = req.body;

    // Verificar que el usuario esté autenticado
    if (!usuarioActual || !usuarioActual._id) {
        return res.status(401).json({ 
            status: 401, 
            message: "No autorizado. Debes iniciar sesión." 
        });
    }

    try {
        await client.connect();
        const db = client.db("Partidazo");
        const postsCollection = db.collection("posts");
        const usersCollection = db.collection("users");

        // Buscar la actividad
        const post = await postsCollection.findOne({ _id: postId });

        if (!post) {
            return res.status(404).json({ 
                status: 404, 
                message: "Actividad no encontrada." 
            });
        }

        // Verificar que el usuario actual sea el creador de la actividad
        if (post.creator_id !== usuarioActual._id) {
            return res.status(403).json({ 
                status: 403, 
                message: "No tienes permiso para cancelar esta actividad. Solo el creador puede cancelarla." 
            });
        }

        // Obtener lista de participantes para notificarles
        const participantIds = post.participando ? post.participando.map(p => p._id) : [];
        
        // Eliminar la actividad de la base de datos
        await postsCollection.deleteOne({ _id: postId });

        // Eliminar la actividad de las listas de postsPosted y postsJoined de todos los usuarios
        await usersCollection.updateMany(
            { _id: { $in: [...participantIds, usuarioActual._id] } },
            { 
                $pull: { 
                    postsPosted: postId,
                    postsJoined: postId 
                } 
            }
        );

        // Crear notificaciones para todos los participantes (excepto el creador)
        if (participantIds.length > 0) {
            const notifications = participantIds
                .filter(id => id !== usuarioActual._id)
                .map(participantId => ({
                    type: "activity_cancelled",
                    message: `La actividad "${post.actividadType || 'actividad'}" ha sido cancelada por el organizador.`,
                    date: new Date().toISOString(),
                    read: false,
                    relatedUser: usuarioActual._id,
                    relatedPost: postId
                }));

            if (notifications.length > 0) {
                await usersCollection.updateMany(
                    { _id: { $in: participantIds.filter(id => id !== usuarioActual._id) } },
                    { $push: { notifications: { $each: notifications } } }
                );
            }
        }

        res.status(200).json({ 
            status: 200, 
            message: "Actividad cancelada exitosamente.",
            deletedPostId: postId 
        });

    } catch (err) {
        console.error("Error al cancelar la actividad:", err);
        res.status(500).json({ 
            status: 500, 
            message: "Error del servidor al cancelar la actividad.",
            error: err.message 
        });
    } finally {
        await client.close();
    }
};

module.exports = { cancelActivityByPostId };
