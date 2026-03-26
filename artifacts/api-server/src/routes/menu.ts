import { Router, type IRouter } from "express";
import { getCollection, connect, getNextId, MenuItemDoc } from "../lib/mongo";
import { z } from "zod";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin1234";

router.get("/items", async (req, res) => {
  try {
    const { brand, puffCount, inStockOnly, search } = req.query as Record<string, string>;
    await connect();
    const col = getCollection<MenuItemDoc>("menu_items");

    const filter: any = {};
    if (brand) filter.brand = brand;
    if (puffCount) filter.puffCount = puffCount;
    if (inStockOnly === "true") filter.inStock = true;
    if (search) filter.flavor = { $regex: search, $options: "i" };

    const items = await col.find(filter).sort({ brand: 1, puffCount: 1, flavor: 1 }).toArray();
    res.json({ items });
  } catch (err) {
    req.log.error({ err }, "Failed to get menu items");
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

router.post("/items", async (req, res) => {
  try {
    const schema = z.object({
      brand: z.string(),
      puffCount: z.string(),
      flavor: z.string(),
      inStock: z.boolean().optional(),
      isBestseller: z.boolean().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

    await connect();
    const col = getCollection<MenuItemDoc>("menu_items");
    const id = await getNextId();
    const doc: MenuItemDoc = { id, ...parsed.data } as MenuItemDoc;
    const r = await col.insertOne(doc);
    const created = await col.findOne({ _id: r.insertedId });
    res.status(201).json(created);
  } catch (err) {
    req.log.error({ err }, "Failed to create menu item");
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

router.put("/items/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const updateSchema = z.object({
      brand: z.string().optional(),
      puffCount: z.string().optional(),
      flavor: z.string().optional(),
      inStock: z.boolean().optional(),
      isBestseller: z.boolean().optional(),
    });
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

    await connect();
    const col = getCollection<MenuItemDoc>("menu_items");
    const resUpdate = await col.findOneAndUpdate({ id }, { $set: parsed.data }, { returnDocument: "after" });
    const item = resUpdate.value;
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    req.log.error({ err }, "Failed to update menu item");
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

router.delete("/items/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    await connect();
    const col = getCollection("menu_items");
    await col.deleteOne({ id });
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete menu item");
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

router.get("/brands", async (req, res) => {
  try {
    await connect();
    const col = getCollection<MenuItemDoc>("menu_items");
    const brands = await col.distinct("brand");
    brands.sort();
    res.json({ brands });
  } catch (err) {
    req.log.error({ err }, "Failed to get brands");
    res.status(500).json({ error: "Failed to fetch brands" });
  }
});

router.get("/puff-counts", async (req, res) => {
  try {
    await connect();
    const col = getCollection<MenuItemDoc>("menu_items");
    const puffCounts = await col.distinct("puffCount");
    puffCounts.sort();
    res.json({ puffCounts });
  } catch (err) {
    req.log.error({ err }, "Failed to get puff counts");
    res.status(500).json({ error: "Failed to fetch puff counts" });
  }
});

export default router;
