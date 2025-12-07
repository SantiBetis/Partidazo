const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// Mapeo de inglés a español
const sportTranslations = {
    'Soccer': 'Fútbol',
    'Basketball': 'Baloncesto',
    'Tennis': 'Tenis',
    'Padel': 'Pádel',
    'Volleyball': 'Voleibol',
};

const levelTranslations = {
    'Beginner': 'Principiante',
    'Average': 'Promedio',
    'Intermediate': 'Promedio',
    'Advanced': 'Avanzado',
    'Professional': 'Profesional',
    'All': 'Todos',
};

// Script para traducir deportes y niveles de inglés a español en la BD
const translateSportsToSpanish = async () => {
    try {
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        console.log("✅ Conectado a MongoDB");

        const db = client.db("Partidazo");
        const postsCollection = db.collection("posts");

        // Encontrar todos los posts con deportes en inglés
        const allPosts = await postsCollection.find({}).toArray();
        console.log(`📊 Total de posts en la base de datos: ${allPosts.length}`);

        let updatedCount = 0;
        let alreadySpanishCount = 0;

        for (const post of allPosts) {
            const updates = {};

            // Verificar y traducir actividadType
            if (post.actividadType && sportTranslations[post.actividadType]) {
                updates.actividadType = sportTranslations[post.actividadType];
                console.log(`🔄 Traduciendo deporte: ${post.actividadType} → ${sportTranslations[post.actividadType]}`);
            } else if (post.actividadType && Object.values(sportTranslations).includes(post.actividadType)) {
                console.log(`✅ Deporte ya en español: ${post.actividadType}`);
                alreadySpanishCount++;
            }

            // Verificar y traducir level
            if (post.level && levelTranslations[post.level]) {
                updates.level = levelTranslations[post.level];
                console.log(`🔄 Traduciendo nivel: ${post.level} → ${levelTranslations[post.level]}`);
            } else if (post.level && Object.values(levelTranslations).includes(post.level)) {
                console.log(`✅ Nivel ya en español: ${post.level}`);
            }

            // Actualizar si hay cambios
            if (Object.keys(updates).length > 0) {
                await postsCollection.updateOne(
                    { _id: post._id },
                    { $set: updates }
                );
                updatedCount++;
                console.log(`✅ Post ${post._id} actualizado`);
            }
        }

        console.log("\n📊 RESUMEN:");
        console.log(`   - Total de posts: ${allPosts.length}`);
        console.log(`   - Posts actualizados: ${updatedCount}`);
        console.log(`   - Posts ya en español: ${alreadySpanishCount}`);
        console.log("\n✅ Traducción completada");

        await client.close();
    } catch (error) {
        console.error("❌ Error:", error);
    }
};

translateSportsToSpanish();
