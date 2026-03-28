import { MongoClient } from "mongodb";

const uri = "mongodb+srv://bhensdum15_db_user:Q1w2e3r4t5@cluster0.h5kczyf.mongodb.net/vapedb?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function updatePuffCounts() {
  let connection;
  try {
    connection = await client.connect();
    console.log("Connected to MongoDB");
    
    const db = client.db("vapedb");
    const collection = db.collection("menu_items");

    // Mapping of brand + current puffCount → new puffCount with cupboard
    const updates = [
      { brand: "Al Fakher", oldPuff: "Own Bar", newPuff: "Own Bar (3)" },
      { brand: "Breeze", oldPuff: "2K Puffs", newPuff: "2K Puffs (3)" },
      { brand: "Breeze", oldPuff: "6K Puffs", newPuff: "6K Puffs (3)" },
      { brand: "Escobar", oldPuff: "2.5K Puffs", newPuff: "2.5K Puffs (3)" },
      { brand: "Geek Bar", oldPuff: "15K Puffs", newPuff: "15K Puffs (1)" },
      { brand: "Geek Bar", oldPuff: "25K Puffs", newPuff: "25K Puffs (2)" },
      { brand: "Geek Galaxy", oldPuff: "15K Puffs", newPuff: "15K Puffs (2)" },
      { brand: "Geek Galaxy", oldPuff: "25K Puffs", newPuff: "25K Puffs (1)" },
      { brand: "Hookah Lit", oldPuff: "Pro", newPuff: "Pro (F)" },
      { brand: "Hookah Lit", oldPuff: "Standard", newPuff: "Standard (F)" },
      { brand: "Mr Fog Switch", oldPuff: "15K Puffs", newPuff: "15K Puffs (2)" },
      { brand: "North", oldPuff: "15K Puffs", newPuff: "15K Puffs (1)" },
      { brand: "North", oldPuff: "5K Puffs", newPuff: "5K Puffs (1)" },
      { brand: "Posh", oldPuff: "1.5K Puffs", newPuff: "1.5K Puffs (2)" },
      { brand: "Posh", oldPuff: "10K Puffs", newPuff: "10K Puffs (2)" },
      { brand: "Posh", oldPuff: "20K Puffs", newPuff: "20K Puffs (2)" },
      { brand: "Posh", oldPuff: "3K Puffs", newPuff: "3K Puffs (2)" },
      { brand: "Posh", oldPuff: "5.2K Puffs", newPuff: "5.2K Puffs (2)" },
      { brand: "Tesla Bar", oldPuff: "40K Puffs", newPuff: "40K Puffs (1)" },
    ];

    let totalUpdated = 0;

    for (const update of updates) {
      const result = await collection.updateMany(
        { brand: update.brand, puffCount: update.oldPuff },
        { $set: { puffCount: update.newPuff } }
      );
      totalUpdated += result.modifiedCount;
      console.log(`✓ ${update.brand} ${update.oldPuff} → ${update.newPuff} (${result.modifiedCount} items)`);
    }

    // Force flush to DB by reading back the data
    const finalCount = await collection.countDocuments({});
    console.log(`\n✅ Updated ${totalUpdated} total items with cupboard numbers!`);
    console.log(`Total items in database: ${finalCount}`);
    
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await client.close();
      console.log("Connection closed");
    }
  }
}

await updatePuffCounts();
