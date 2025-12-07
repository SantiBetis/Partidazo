const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// Script para limpiar posts inválidos de la base de datos
const cleanInvalidPosts = async () => {
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        console.log("✅ Conectado a MongoDB");

        const db = client.db("Partidazo");
        const postsCollection = db.collection("posts");

        // Encontrar todos los posts
        const allPosts = await postsCollection.find({}).toArray();
        console.log(`📊 Total de posts en la base de datos: ${allPosts.length}`);

        let deletedCount = 0;
        let validCount = 0;

        for (const post of allPosts) {
            let isValid = true;
            const reasons = [];

            // Validar actividadDate
            if (!post.actividadDate || 
                !post.actividadDate.date || 
                !post.actividadDate.from || 
                !post.actividadDate.to) {
                isValid = false;
                reasons.push("actividadDate incompleto");
            }

            // Validar actividadAddress
            if (!post.actividadAddress || 
                !post.actividadAddress.street || 
                !post.actividadAddress.city || 
                !post.actividadAddress.province) {
                isValid = false;
                reasons.push("actividadAddress incompleto");
            }

            // Validar actividadType
            if (!post.actividadType || 
                post.actividadType === "Select" || 
                post.actividadType === "All") {
                isValid = false;
                reasons.push("actividadType inválido");
            }

            // Validar level
            if (!post.level || post.level === "select") {
                isValid = false;
                reasons.push("level inválido");
            }

            // Validar limit
            if (!post.limit || post.limit < 2) {
                isValid = false;
                reasons.push("limit inválido");
            }

            // Validar participando
            if (!post.participando || !Array.isArray(post.participando)) {
                isValid = false;
                reasons.push("participando inválido");
            }

            if (!isValid) {
                console.log(`❌ Post inválido (ID: ${post._id}): ${reasons.join(", ")}`);
                await postsCollection.deleteOne({ _id: post._id });
                deletedCount++;
            } else {
                validCount++;
            }
        }

        console.log("\n📈 Resumen:");
        console.log(`   ✅ Posts válidos: ${validCount}`);
        console.log(`   ❌ Posts eliminados: ${deletedCount}`);

        client.close();
        console.log("\n✅ Desconectado de MongoDB");
        console.log("🎉 Limpieza completada");

    } catch (err) {
        console.error("❌ Error:", err);
    }
};

// Ejecutar el script
cleanInvalidPosts();
