
import { Router } from "express";
import { scanWebsite } from "../scanner/websiteScanner";
import { saveScan } from "../db/database";

const router = Router();

router.post("/", async (req, res) => {
  const { url } = req.body ?? {};

  if (typeof url !== "string" || !url.trim()) {
    res.status(400).json({ error: "Please provide a website URL." });
    return;
  }

  try {
    const report = await scanWebsite(url);
    const saved = await saveScan(report);

    res.json(saved);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The scan failed.";

    res.status(400).json({ error: message });
  }
});

export default router;
