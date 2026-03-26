import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/vapedb';
const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db();
  
  const menuResult = await db.collection('menu_items').deleteMany({});
  const counterResult = await db.collection('counters').deleteMany({});
  
  console.log(`Deleted ${menuResult.deletedCount} menu items`);
  console.log(`Deleted ${counterResult.deletedCount} counters`);
  console.log('Database cleared successfully');
} catch (err) {
  console.error('Error clearing database:', err);
  process.exit(1);
} finally {
  await client.close();
  process.exit(0);
}
