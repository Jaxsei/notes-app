import dotenv from 'dotenv';
dotenv.config();
import { MongoClient } from 'mongodb';
// USE WITH CAUTION
// This script drops the given collection
// usefull for starting over
// enter 'npm run drop' tp run this cmd
//                       Enter collection name here
const COLLECTION_NAME = 'notes'; // fallback name
if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env');
    process.exit(1);
}
if (!COLLECTION_NAME) {
    console.error('❌ Collection name not specified. Set COLLECTION_NAME in .env or edit the script.');
    process.exit(1);
}
async function deleteCollection() {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const db = client.db(); // Default DB from URI
        const collections = await db.listCollections().toArray();
        const exists = collections.find((col) => col.name === COLLECTION_NAME);
        if (!exists) {
            console.warn(`⚠️ Collection "${COLLECTION_NAME}" does not exist.`);
            return;
        }
        const result = await db.collection(COLLECTION_NAME).drop();
        console.log(`✅ Collection "${COLLECTION_NAME}" dropped:`, result);
    }
    catch (err) {
        console.error('❌ Error:', err);
    }
    finally {
        await client.close();
    }
}
deleteCollection();
//# sourceMappingURL=dropCollection.js.map
