import { MongoClient } from "mongodb";

const uri = "mongodb+srv://bhensdum15_db_user:Q1w2e3r4t5@cluster0.h5kczyf.mongodb.net/vapedb?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function setBestsellers() {
  let connection;
  try {
    connection = await client.connect();
    console.log("Connected to MongoDB");
    
    const db = client.db("vapedb");
    const collection = db.collection("menu_items");

    // First, clear all bestsellers
    await collection.updateMany({}, { $set: { isBestseller: false } });
    console.log("Cleared all bestsellers");

    // Now set specific items as bestsellers
    // These are popular items across different brands and puff counts
    const bestsellerCriteria = [
      // Popular North items
      { brand: "North", flavor: { $in: ["Strawberry Mango", "Watermelon", "Mint"] } },
      // Popular Breeze items
      { brand: "Breeze", flavor: { $in: ["Blueberry Mint", "Strawberry Banana", "Watermelon"] } },
      // Popular Elfbar items
      { brand: "Elfbar", flavor: { $in: ["Blueberry Raspberry", "Watermelon Ice"] } },
      // Popular IGET items
      { brand: "IGET", flavor: { $in: ["Blueberry Raspberry", "Watermelon"] } },
      // Popular Hookah Lit items
      { brand: "Hookah Lit", flavor: { $in: ["Mint", "Berry Mix"] } },
      // Popular Geek Bar items
      { brand: "Geek Bar", flavor: { $in: ["Miami Mint", "Strawberry Watermelon"] } },
      // Popular Geek Galaxy items
      { brand: "Geek Galaxy", flavor: { $in: ["Miami Mint", "Tropical Burst"] } },
      // Popular Posh items
      { brand: "Posh", flavor: { $in: ["Watermelon Ice", "Mint Ice"] } },
      // Popular Mr Fog Switch items
      { brand: "Mr Fog Switch", flavor: { $in: ["Strawberry Ice", "Cool Mint"] } },
    ];

    let totalBestsellers = 0;
    for (const criteria of bestsellerCriteria) {
      const result = await collection.updateMany(criteria, { $set: { isBestseller: true } });
      totalBestsellers += result.modifiedCount;
      console.log(`✓ ${criteria.brand}: ${result.modifiedCount} items marked as bestseller`);
    }

    // Get count of bestsellers
    const bestsellerCount = await collection.countDocuments({ isBestseller: true });
    console.log(`\n✅ Set ${bestsellerCount} total items as bestsellers`);
    
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

await setBestsellers();
