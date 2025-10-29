import express, { json } from "express";
import multer, { memoryStorage } from "multer";
import { parseCSV } from "./utils";
import { scoreLeads } from "./scoringService";
import { setOffer, setLeads, getOffer, getLeads, setResults, getResults } from "./storage";
import csvStringify from "csv-stringify";
require("dotenv").config();

const app = express();
app.use(json());
const upload = multer({ storage: memoryStorage() });

// POST /offer
app.post("/offer", (req, res) => {
  const offer = req.body;
  if (!offer.name) return res.status(400).json({ error: "Offer name required" });
  setOffer(offer);
  res.json({ message: "Offer saved", offer });
});

// POST /leads/upload
app.post("/leads/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "File missing" });
  const leads = await parseCSV(req.file.buffer);
  setLeads(leads);
  res.json({ message: `Uploaded ${leads.length} leads` });
});

// POST /score
app.post("/score", async (req, res) => {
  const offer = getOffer();
  const leads = getLeads();
  if (!offer) return res.status(400).json({ error: "No offer yet" });
  if (!leads.length) return res.status(400).json({ error: "No leads uploaded" });

  const results = await scoreLeads(leads, offer);
  setResults(results);
  res.json({ count: results.length, results });
});

// GET /results
app.get("/results", (req, res) => {
  const results = getResults();
  if (!results.length) return res.status(404).json({ error: "No results yet" });
  res.json(results);
});

// GET /results/export
app.get("/results/export", (req, res) => {
  const results = getResults();
  if (!results.length) return res.status(404).json({ error: "No results yet" });
  const header = ["name", "role", "company", "industry", "location", "intent", "score", "reasoning"];
  const rows = results.map((r) => header.map((h) => r[h]));
  csvStringify([header, ...rows], (err, csv) => {
    if (err) return res.status(500).json({ error: err.message });
    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
