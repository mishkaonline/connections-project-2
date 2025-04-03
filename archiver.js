// This script syncs questions from a MongoDB collection to a local JSON archive file.

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO_URL = process.env.mongodburl;
const ARCHIVE_PATH = path.join(__dirname, 'archive', 'questions_archive.json');
async function syncQuestionsToArchive() {
    const client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(); // Uses the default DB from your URL
        const collection = db.collection('quiz'); // Adjust if your collection name is different

        const questionsFromDB = await collection.find({}).toArray();

        let archive = [];
        if (fs.existsSync(ARCHIVE_PATH)) {
            const archiveData = fs.readFileSync(ARCHIVE_PATH, 'utf8');
            archive = JSON.parse(archiveData);
        }

        // Deduplicate based on the question text
        const existingQuestions = new Set(archive.map(q => q.question));
        const newQuestions = [];

        for (const q of questionsFromDB) {
            if (!existingQuestions.has(q.question)) {
                // Add a timestamp to indicate when it was archived
                const archivedEntry = { ...q, addedAt: new Date().toISOString() };
                archive.push(archivedEntry);
                newQuestions.push(archivedEntry);
            }
        }

        if (newQuestions.length > 0) {
            fs.writeFileSync(ARCHIVE_PATH, JSON.stringify(archive, null, 2));
            console.log(`✅ Added ${newQuestions.length} new question(s) to the archive.`);
            newQuestions.forEach(q =>
                console.log(`→ "${q.question}" archived at ${q.addedAt}`)
            );
        } else {
            console.log('👌 Archive is already up to date. No new questions found.');
        }
    } catch (err) {
        console.error('❌ Error syncing archive:', err);
    } finally {
        await client.close();
    }
}

syncQuestionsToArchive();