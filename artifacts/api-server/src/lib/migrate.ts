import { ensureSeedData, connect } from "./mongo";
import { logger } from "./logger";

const SEED_ITEMS: Array<[string, string, string, boolean, boolean]> = [
  ['Tesla Bar', '40K Puffs', 'Black Cherry', false, false],
  ['Tesla Bar', '40K Puffs', 'Grape Blow Pop', true, false],
  ['Tesla Bar', '40K Puffs', 'Grape Pear', true, false],
  ['Tesla Bar', '40K Puffs', 'Strawberry Ice', true, false],
  ['Tesla Bar', '40K Puffs', 'Strawberry Kiwi', true, false],
  ['North', '5K Puffs', 'Blueberry Mint', true, false],
  ['North', '5K Puffs', 'Mango Freeze', true, false],
  ['North', '5K Puffs', 'Mighty Mint', true, false],
  ['North', '5K Puffs', 'Peach Berry', true, false],
  ['North', '5K Puffs', 'Pineapple Passionfruit', true, false],
  ['North', '5K Puffs', 'Pink Lemonade', true, false],
  ['North', '5K Puffs', 'Strawmelon', true, false],
  ['North', '15K Puffs', 'Blueberry Watermelon', true, false],
  ['North', '15K Puffs', 'Blue Slushie', true, false],
  ['North', '15K Puffs', 'Grape Twist', true, false],
  ['North', '15K Puffs', 'Mexican Mango', true, false],
  ['North', '15K Puffs', 'Mighty Mint', true, false],
  ['North', '15K Puffs', 'Strawberry Mango', false, false],
  ['North', '15K Puffs', 'Watermelon Ice', true, false],
  ['Escobar', '2.5K Puffs', 'Blood Orange Tangerine', true, false],
  ['Escobar', '2.5K Puffs', 'Blueberry Papaya Strawberry', true, false],
  ['Escobar', '2.5K Puffs', 'Wild Strawberry', true, false],
  ['Al Fakher', 'Own Bar', 'Blueberry Gum', true, false],
  ['Al Fakher', 'Own Bar', 'Blueberry Mint', true, false],
  ['Al Fakher', 'Own Bar', 'Cherry Ice', true, false],
  ['Al Fakher', 'Own Bar', 'Peach Ice', true, false],
  ['Hookah Lit', 'Standard', 'Blueberry Ice', false, false],
  ['Hookah Lit', 'Standard', 'Lucid Dream', false, false],
  ['Hookah Lit', 'Pro', 'Blackberry Mint', true, false],
  ['Hookah Lit', 'Pro', 'Fucking Fab', false, false],
  ['Hookah Lit', 'Pro', 'Mango Freeze', true, false],
  ['Hookah Lit', 'Pro', 'Strawberry Ice', false, false],
  ['Hookah Lit', 'Pro', 'Sweet Passionfruit', true, false],
  ['Hookah Lit', 'Pro', 'Two Apples', true, false],
  ['Breeze', '2K Puffs', 'Blueberry Watermelon', true, false],
  ['Breeze', '2K Puffs', 'Cherry Cola', false, false],
  ['Breeze', '2K Puffs', 'Grape', true, false],
  ['Breeze', '2K Puffs', 'Mint', true, false],
  ['Breeze', '2K Puffs', 'Peach Mango', true, false],
  ['Breeze', '2K Puffs', 'Pineapple Coconut', true, false],
  ['Breeze', '2K Puffs', 'Spearmint', true, false],
  ['Breeze', '2K Puffs', 'Strawberry Banana', true, false],
  ['Breeze', '2K Puffs', 'Strawberry Kiwi', true, false],
  ['Breeze', '2K Puffs', 'Strawberry Peach Mint', true, false],
  ['Breeze', '2K Puffs', 'Vanilla Tobacco', true, false],
  ['Breeze', '6K Puffs', 'Lemon Cola', true, false],
  ['Breeze', '6K Puffs', 'Mango', true, false],
  ['Breeze', '6K Puffs', 'Mint', true, false],
  ['Breeze', '6K Puffs', 'Strawberry Mint', true, false],
  ['Mr Fog Switch', '15K Puffs', 'Blueberry Myst', true, false],
  ['Mr Fog Switch', '15K Puffs', 'Cherry Lemon Ice', true, false],
  ['Mr Fog Switch', '15K Puffs', 'Grape Pomegranate Ice', false, false],
  ['Mr Fog Switch', '15K Puffs', 'Gum Mint', false, false],
  ['Mr Fog Switch', '15K Puffs', 'Nasty Tropic', true, false],
  ['Mr Fog Switch', '15K Puffs', 'Tutti Frutti', true, false],
  ['Mr Fog Switch', '15K Puffs', 'White Peach Slushy', false, false],
  ['Mr Fog Switch', '15K Puffs', 'Wild Strawberry Ice', false, false],
];

export async function runMigrations() {
  try {
    logger.info("Running database migrations (Mongo)...");
    const { db } = await connect();
    
    // Check if data already exists
    const existingCount = await db!.collection("menu_items").countDocuments({});
    
    if (existingCount === 0) {
      // Only seed initial data if collection is empty
      logger.info("Collection is empty, seeding initial data...");
      await ensureSeedData(SEED_ITEMS);
      logger.info("Database migrations complete - seeded initial data.");
    } else {
      logger.info(`Database already has ${existingCount} items, skipping seed.`);
    }
  } catch (err) {
    logger.error({ err }, "Database migration failed");
    throw err;
  }
}

