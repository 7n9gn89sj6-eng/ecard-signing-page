import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Get all signatures from KV
    try {
      const raw = await kv.lrange("ecard:signatures", 0, -1);
      const signatures = raw.map((item) => JSON.parse(item));
      res.status(200).json(signatures);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to load signatures" });
    }
  } else if (req.method === "POST") {
    const { name, message } = req.body || {};
    if (!name || !message) {
      res.status(400).json({ error: "Name and message are required" });
      return;
    }

    const entry = {
      name,
      message,
      createdAt: Date.now()
    };

    try {
      await kv.rpush("ecard:signatures", JSON.stringify(entry));
      res.status(201).json(entry);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to save signature" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end("Method Not Allowed");
  }
}
