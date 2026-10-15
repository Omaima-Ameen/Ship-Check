import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json({
        status: "ok",
        app: "ShipCheck",
        message: "Health Check Successful"
    });
});

export default router;