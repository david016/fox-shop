import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const db = new Low(new JSONFile("db.json"), { products: [], changes: [] });

await db.read();

export default db;
