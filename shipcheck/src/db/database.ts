import { readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { ScanReport } from "../scanner/websiteScanner";


export type SavedScan = {
  id: string;
  url: string;
  statusCode: number;
  scannedAt: string;
  findings: {
    id: string;
    title: string;
    status: "pass" | "warning";
    details: string;
    fix: string;
  }[];
};

const historyPath = path.join(process.cwd(), "shipcheck-history.json");
const tempPath =  `${historyPath}.tmp`;

async function readHistory(): Promise<SavedScan[]>{
  try {
    const content = await readFile(historyPath, "utf8");
    return JSON.parse(content) as SavedScan[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
  }
  throw error;
}
}

let writeQueue = Promise.resolve();

export function saveScan(
  report: Omit<SavedScan, "id">
): Promise<SavedScan>{
 const operation = writeQueue.then(async () => {
  const history = await readHistory();

  const saved: SavedScan = {
    ...report,
    id: `${Date.now()} - ${Math.random().toString(36).slice(2, 8)}`,
  };
  history.unshift(saved);

  await writeFile(
    tempPath,
    JSON.stringify(history.slice(0, 100), null, 2),
    "utf8"
  );

  await rename(tempPath, historyPath);

  return saved;
 });

 writeQueue = operation.then(
  () => undefined,
  () => undefined
 );

 return operation;
}

export async function getRecentScans(): Promise<SavedScan[]>{
  return (await readHistory()).slice(0, 10);
}


export function deleteScan(id: string): Promise<boolean> {
  const operation = writeQueue.then(async () => {
    const history = await readHistory();
    const updatedHistory = history.filter((scan) => scan.id !== id);

    if (updatedHistory.length === history.length) {
      return false;
    }

    await writeFile(
      tempPath,
      JSON.stringify(updatedHistory, null, 2),
      "utf8"
    );

    await rename(tempPath, historyPath);
    return true;
  });

  writeQueue = operation.then(
    () => undefined,
    () => undefined
  );

  return operation;
}
