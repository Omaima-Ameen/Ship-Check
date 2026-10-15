
import { Router } from "express";
import { getRecentScans } from "../db/database";
import { deleteScan } from "../db/database";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const scans = await getRecentScans();
    res.json(scans);
  } catch {
    res.status(500).json({
      error: "Could not load scan history.",
    });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await deleteScan(id);

    if (!deleted) {
      return res.status(404).json({
        error: "Scan not found.",
      });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Delete scan error:", error);

    return res.status(500).json({
      error: "Could not delete the scan.",
    });
  }
});


export default router;
