import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/vapedb';
const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db();
  
  const result = await db.collection('menu_items').deleteMany({ brand: 'Geek Galaxy' });
  
  console.log(`Deleted ${result.deletedCount} Geek Galaxy items`);
  console.log('Geek Galaxy section removed successfully');
} catch (err) {
  console.error('Error removing Geek Galaxy:', err);
  process.exit(1);
} finally {
  await client.close();
  process.exit(0);
}
