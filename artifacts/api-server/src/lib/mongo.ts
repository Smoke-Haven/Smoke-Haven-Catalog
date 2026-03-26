import { MongoClient, Db, Collection, Document } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

const getMongoUri = () => process.env.DATABASE_URL || "mongodb://localhost:27017/vapedb";

export async function connect() {
  if (client && db) return { client, db };
  const uri = getMongoUri();
  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  return { client, db };
}

export function getCollection<T extends Document = Document>(name: string): Collection<T> {
  if (!db) throw new Error("MongoDB not connected. Call connect() first.");
  return db.collection<T>(name);
}

export async function disconnect() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

export type CounterDoc = {
  _id: string;
  seq: number;
};

export type MenuItemDoc = {
  _id?: any;
  id?: number; // keep numeric id for compatibility with routes using numeric ids
  brand: string;
  puffCount: string;
  flavor: string;
  inStock: boolean;
  isBestseller: boolean;
};

export async function ensureSeedData(seeds: Array<[string, string, string, boolean, boolean]>) {
  const { db } = await connect();
  const col = db!.collection<MenuItemDoc>("menu_items");

  // Ensure numeric id counter via a counters collection
  const counters = db!.collection<CounterDoc>("counters");
  const counter = await counters.findOne({ _id: "menu_items" } as any);
  if (!counter) {
    await counters.insertOne({ _id: "menu_items", seq: 1 });
  }

  const count = await col.countDocuments();
  if (count === 0) {
    const docs: MenuItemDoc[] = [];
    let seq = (await counters.findOne({ _id: "menu_items" } as any))?.seq ?? 1;
    for (const [brand, puffCount, flavor, inStock, isBestseller] of seeds) {
      docs.push({ id: seq++, brand, puffCount, flavor, inStock, isBestseller });
    }
    if (docs.length > 0) {
      await col.insertMany(docs);
      await counters.updateOne({ _id: "menu_items" } as any, { $set: { seq } });
    }
  }
}

export async function getNextId(): Promise<number> {
  const { db } = await connect();
  const counters = db!.collection<CounterDoc>("counters");
  const res = await counters.findOneAndUpdate(
    { _id: "menu_items" } as any,
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true },
  );
  return res.value?.seq ?? 1;
}
