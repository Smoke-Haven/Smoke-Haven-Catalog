import { connect } from "./mongo";
import { logger } from "./logger";

export async function runMigrations() {
  try {
    logger.info("Running database migrations (Mongo)...");
    const { db } = await connect();
    
    // Get count of existing items
    const existingCount = await db!.collection("menu_items").countDocuments({});
    logger.info(`Database has ${existingCount} menu items. Using existing data.`);
    
  } catch (err) {
    logger.error({ err }, "Database migration failed");
    throw err;
  }
}

