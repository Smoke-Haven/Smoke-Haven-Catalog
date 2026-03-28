import { MongoClient } from "mongodb";

const uri = "mongodb+srv://bhensdum15_db_user:Q1w2e3r4t5@cluster0.h5kczyf.mongodb.net/vapedb?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function addFlavors() {
  let connection;
  try {
    connection = await client.connect();
    console.log("Connected to MongoDB");
    
    const db = client.db("vapedb");
    const collection = db.collection("menu_items");

    // Get the highest ID
    const lastItem = await collection.findOne({}, { sort: { id: -1 } });
    let nextId = (lastItem?.id || 0) + 1;

    // New flavors to add
    const newFlavors = [
      // Geek Bar 15K
      { brand: "Geek Bar", puffCount: "15K Puffs", flavor: "Juicy Peach Ice", inStock: true },
      { brand: "Geek Bar", puffCount: "15K Puffs", flavor: "Crazy Melon", inStock: true },
      { brand: "Geek Bar", puffCount: "15K Puffs", flavor: "Pink Lemonade", inStock: true },
      { brand: "Geek Bar", puffCount: "15K Puffs", flavor: "Strawberry Mango", inStock: true },
      { brand: "Geek Bar", puffCount: "15K Puffs", flavor: "Watermelon Ice", inStock: true },
      { brand: "Geek Bar", puffCount: "15K Puffs", flavor: "Cool Mint", inStock: true },
      { brand: "Geek Bar", puffCount: "15K Puffs", flavor: "Fucking Fab", inStock: true },
      { brand: "Geek Bar", puffCount: "15K Puffs", flavor: "Frozen Strawberry", inStock: true },
      { brand: "Geek Bar", puffCount: "15K Puffs", flavor: "Blueberry Watermelon", inStock: true },
      { brand: "Geek Bar", puffCount: "15K Puffs", flavor: "California Cherry", inStock: true },
      { brand: "Geek Bar", puffCount: "15K Puffs", flavor: "Miami Mint", inStock: true },
      { brand: "Geek Bar", puffCount: "15K Puffs", flavor: "Mexico Mango", inStock: true },
      // Geek Bar 25K
      { brand: "Geek Bar", puffCount: "25K Puffs", flavor: "Brain Sour Mango Pineapple", inStock: true },
      { brand: "Geek Bar", puffCount: "25K Puffs", flavor: "Miami Mint", inStock: true },
      { brand: "Geek Bar", puffCount: "25K Puffs", flavor: "Sour Fucking Fab", inStock: true },
      { brand: "Geek Bar", puffCount: "25K Puffs", flavor: "Strawberry Watermelon", inStock: true },
      { brand: "Geek Bar", puffCount: "25K Puffs", flavor: "Blue Rancher", inStock: true },
      { brand: "Geek Bar", puffCount: "25K Puffs", flavor: "Strawberry Jam", inStock: true },
      { brand: "Geek Bar", puffCount: "25K Puffs", flavor: "Sour Apple Ice", inStock: true },
      { brand: "Geek Bar", puffCount: "25K Puffs", flavor: "Watermelon Ice", inStock: true },
      { brand: "Geek Bar", puffCount: "25K Puffs", flavor: "White Peach Raspberry", inStock: true },
      { brand: "Geek Bar", puffCount: "25K Puffs", flavor: "Orange Slush", inStock: true },
      { brand: "Geek Bar", puffCount: "25K Puffs", flavor: "Cool Mint", inStock: true },
      { brand: "Geek Bar", puffCount: "25K Puffs", flavor: "Raspberry Peach Lime", inStock: true },
      // Geek Galaxy 15K
      { brand: "Geek Galaxy", puffCount: "15K Puffs", flavor: "Sour Apple Ice", inStock: true },
      { brand: "Geek Galaxy", puffCount: "15K Puffs", flavor: "Mango Slush", inStock: true },
      { brand: "Geek Galaxy", puffCount: "15K Puffs", flavor: "Strawberry Kiwi", inStock: true },
      { brand: "Geek Galaxy", puffCount: "15K Puffs", flavor: "Strawberry Mango", inStock: true },
      { brand: "Geek Galaxy", puffCount: "15K Puffs", flavor: "Mexican Mango", inStock: true },
      { brand: "Geek Galaxy", puffCount: "15K Puffs", flavor: "Fucking Fab", inStock: true },
      { brand: "Geek Galaxy", puffCount: "15K Puffs", flavor: "White Peach", inStock: true },
      { brand: "Geek Galaxy", puffCount: "15K Puffs", flavor: "California Cherry", inStock: true },
      // Geek Galaxy 25K
      { brand: "Geek Galaxy", puffCount: "25K Puffs", flavor: "Miami Mint", inStock: true },
      { brand: "Geek Galaxy", puffCount: "25K Puffs", flavor: "Spearmint", inStock: true },
      { brand: "Geek Galaxy", puffCount: "25K Puffs", flavor: "Tropical Burst", inStock: true },
      { brand: "Geek Galaxy", puffCount: "25K Puffs", flavor: "Cherry Lemonade", inStock: true },
      { brand: "Geek Galaxy", puffCount: "25K Puffs", flavor: "Grape Colada", inStock: true },
      { brand: "Geek Galaxy", puffCount: "25K Puffs", flavor: "Peach Perfect Slush", inStock: true },
      { brand: "Geek Galaxy", puffCount: "25K Puffs", flavor: "Wild Cherry Slush", inStock: true },
      { brand: "Geek Galaxy", puffCount: "25K Puffs", flavor: "Pina Colada Slush", inStock: true },
      { brand: "Geek Galaxy", puffCount: "25K Puffs", flavor: "Strawberry Bubble Gum", inStock: true },
      { brand: "Geek Galaxy", puffCount: "25K Puffs", flavor: "Special Grape Ice", inStock: true },
      // Posh Plus 1.5K
      { brand: "Posh", puffCount: "1.5K Puffs", flavor: "Watermelon Ice", inStock: true },
      { brand: "Posh", puffCount: "1.5K Puffs", flavor: "Mint", inStock: true },
      { brand: "Posh", puffCount: "1.5K Puffs", flavor: "Peach Pineapple Orange Ice", inStock: true },
      { brand: "Posh", puffCount: "1.5K Puffs", flavor: "Cherry Frost", inStock: true },
      { brand: "Posh", puffCount: "1.5K Puffs", flavor: "Apple", inStock: true },
      { brand: "Posh", puffCount: "1.5K Puffs", flavor: "Grape", inStock: true },
      { brand: "Posh", puffCount: "1.5K Puffs", flavor: "Strawberry", inStock: true },
      { brand: "Posh", puffCount: "1.5K Puffs", flavor: "Watermelon", inStock: true },
      // Posh Pro Plus 3K
      { brand: "Posh", puffCount: "3K Puffs", flavor: "Mango Strawberry Ice", inStock: true },
      { brand: "Posh", puffCount: "3K Puffs", flavor: "Berry Melon", inStock: true },
      { brand: "Posh", puffCount: "3K Puffs", flavor: "Blue Raspberry Ice", inStock: true },
      { brand: "Posh", puffCount: "3K Puffs", flavor: "Spearmint", inStock: true },
      // Posh Max 5.2K
      { brand: "Posh", puffCount: "5.2K Puffs", flavor: "Kiwi Strawberry Ice", inStock: true },
      { brand: "Posh", puffCount: "5.2K Puffs", flavor: "Mint Ice", inStock: true },
      { brand: "Posh", puffCount: "5.2K Puffs", flavor: "Razz Mataz", inStock: true },
      { brand: "Posh", puffCount: "5.2K Puffs", flavor: "Grape Ice", inStock: true },
      { brand: "Posh", puffCount: "5.2K Puffs", flavor: "Strawberry Ice", inStock: true },
      { brand: "Posh", puffCount: "5.2K Puffs", flavor: "Jugo De Mango", inStock: true },
      { brand: "Posh", puffCount: "5.2K Puffs", flavor: "Melon Gooseberry", inStock: true },
      { brand: "Posh", puffCount: "5.2K Puffs", flavor: "Blue Raspberry", inStock: true },
      // Posh Xtron 10K
      { brand: "Posh", puffCount: "10K Puffs", flavor: "Mix Berries", inStock: true },
      { brand: "Posh", puffCount: "10K Puffs", flavor: "Coconut Banana", inStock: true },
      // Posh Plus 20K
      { brand: "Posh", puffCount: "20K Puffs", flavor: "Kiwi Peach", inStock: true },
      { brand: "Posh", puffCount: "20K Puffs", flavor: "Mexican Mango", inStock: true },
      { brand: "Posh", puffCount: "20K Puffs", flavor: "Grape Lemonade", inStock: true },
      { brand: "Posh", puffCount: "20K Puffs", flavor: "Dragon Melon", inStock: true },
      { brand: "Posh", puffCount: "20K Puffs", flavor: "Jo Jo", inStock: true },
      { brand: "Posh", puffCount: "20K Puffs", flavor: "Pina Colada", inStock: true },
      { brand: "Posh", puffCount: "20K Puffs", flavor: "Dragon Melon Dream", inStock: true },
      // Mr Fog Switch 15K - new flavor variant
      { brand: "Mr Fog Switch", puffCount: "15K Puffs", flavor: "Kiwi Strawberry Ice", inStock: true },
    ];

    // Add IDs to each flavor
    const flavorsWithIds = newFlavors.map((flavor, index) => ({
      id: nextId + index,
      ...flavor,
      isBestseller: false,
    }));

    // Insert all
    const result = await collection.insertMany(flavorsWithIds);
    console.log(`✅ Added ${result.insertedCount} new flavors!`);
    console.log(`New items IDs: ${nextId} to ${nextId + newFlavors.length - 1}`);
    
    // Force flush to DB
    await db.collection("menu_items").findOne({});
    console.log("Data persisted to database");
    
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

await addFlavors();
