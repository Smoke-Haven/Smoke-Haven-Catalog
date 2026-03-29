import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

const uri = "mongodb+srv://bhensdum15_db_user:Q1w2e3r4t5@cluster0.h5kczyf.mongodb.net/vapedb?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function restoreFromBackup() {
  let connection;
  try {
    const backupFile = process.argv[2];
    
    if (!backupFile) {
      console.error("Usage: node restore-from-backup.mjs <backup-file.json>");
      console.error("Example: node restore-from-backup.mjs db-backup-20260329-112815.json");
      process.exit(1);
    }

    if (!fs.existsSync(backupFile)) {
      console.error(`❌ File not found: ${backupFile}`);
      process.exit(1);
    }

    connection = await client.connect();
    console.log("🔗 Connected to MongoDB");
    
    const db = client.db("vapedb");
    const collection = db.collection("menu_items");

    // Read backup file
    const data = fs.readFileSync(backupFile, 'utf-8');
    const items = JSON.parse(data);

    if (!Array.isArray(items)) {
      throw new Error("Backup file must contain an array of items");
    }

    console.log(`📦 Restoring ${items.length} items...`);
    
    // Clear existing data
    const deleteResult = await collection.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing items`);
    
    // Insert backup data
    const insertResult = await collection.insertMany(items);
    console.log(`✅ Inserted ${insertResult.insertedCount} items from backup`);
    
    // Verify
    const count = await collection.countDocuments({});
    const bestsellers = await collection.countDocuments({ isBestseller: true });
    const outOfStock = await collection.countDocuments({ inStock: false });
    
    console.log("");
    console.log("✅ Restore Complete!");
    console.log(`   📊 Total items: ${count}`);
    console.log(`   ⭐ Bestsellers: ${bestsellers}`);
    console.log(`   ❌ Out of stock: ${outOfStock}`);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await client.close();
      console.log("🔌 Connection closed");
    }
  }
}

await restoreFromBackup();
