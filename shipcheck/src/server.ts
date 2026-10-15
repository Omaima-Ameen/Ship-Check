
import express from "express";
import healthRouter from "./routes/health";
import scanRouter from "./routes/scan";
import historyRouter from "./routes/history";

const app = express();
app.use(express.static("public"));
const PORT = 3000;

app.use(express.json({ limit: "10kb" }));

app.use("/api/health", healthRouter);
app.use("/api/scan", scanRouter);
app.use("/api/history", historyRouter);

console.log("server file loaded!!");
app.listen(PORT, () => {
  console.log(`ShipCheck running at http://localhost:${PORT}`);
});
