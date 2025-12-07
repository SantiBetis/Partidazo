const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const updateNotifications = async () => {
    const client = new MongoClient(MONGO_URI, options);
    const db = client.db("SportsPickApp");
    
    try {
        await client.connect();
        console.log("Conectado a la base de datos");

        // Actualizar "started following you" a "comenzó a seguirte"
        const result1 = await db.collection("users").updateMany(
            { "notifications.message": "started following you" },
            { $set: { "notifications.$[elem].message": "comenzó a seguirte" } },
            { arrayFilters: [{ "elem.message": "started following you" }] }
        );

        // Actualizar "joined your actividad" a "se ha unido a tu actividad"
        const result2 = await db.collection("users").updateMany(
            { "notifications.message": "joined your actividad" },
            { $set: { "notifications.$[elem].message": "se ha unido a tu actividad" } },
            { arrayFilters: [{ "elem.message": "joined your actividad" }] }
        );

        // Actualizar "withdrew from your actividad" a "se ha retirado de tu actividad"
        const result3 = await db.collection("users").updateMany(
            { "notifications.message": "withdrew from your actividad" },
            { $set: { "notifications.$[elem].message": "se ha retirado de tu actividad" } },
            { arrayFilters: [{ "elem.message": "withdrew from your actividad" }] }
        );

        console.log(`Notificaciones "started following you" actualizadas: ${result1.modifiedCount}`);
        console.log(`Notificaciones "joined your actividad" actualizadas: ${result2.modifiedCount}`);
        console.log(`Notificaciones "withdrew from your actividad" actualizadas: ${result3.modifiedCount}`);
        
        client.close();
        console.log("Desconectado de la base de datos");
    } catch (err) {
        console.error("Error:", err);
    }
};

updateNotifications();
