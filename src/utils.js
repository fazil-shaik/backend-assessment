import { parse } from "csv-parse";

export function parseCSV(buffer)  {     return new Promise((resolve, reject) => {
    parse(buffer, { columns: true, skip_empty_lines: true, trim: true }, (err, records) => {
      if (err) reject(err);
      else resolve(records);
    });
  });     }

export function roleScore(role = "") {
  const r = role.toLowerCase();
  if (r.includes("ceo") || r.includes("head") || r.includes("founder") || r.includes("director")) return 20;
  if (r.includes("manager") || r.includes("lead")) return 10;
  return 0;
}

export function industryScore(leadIndustry = "", icps = []) {
  const lead = leadIndustry.toLowerCase();
  const matches = icps.map((i) => i.toLowerCase());
  if (matches.includes(lead)) return 20;
  if (matches.some((m) => lead.includes(m))) return 10;
  return 0;
}

export function completenessScore(lead) {
  const fields = ["name", "role", "company", "industry", "location", "linkedin_bio"];
  return fields.every((f) => lead[f]) ? 10 : 0;
}
