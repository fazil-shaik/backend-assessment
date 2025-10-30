# Lead Intent Scoring Backend (Gemini + Node.js)

### Features
- Upload Offer (`/offer`)
- Upload Leads CSV (`/leads/upload`)
- Run scoring (`/score`)
- View results (`/results`)
- Export as CSV (`/results/export`)

### Run Locally
```bash
npm install
cp .env.example .env   # add GEMINI_API_KEY
npm start

```
### Example usage:
# Add offer
curl -X POST http://localhost:3000/offer \
 -H "Content-Type: application/json" \
 -d '{"name":"AI Outreach","value_props":["24/7 outreach"],"ideal_use_cases":["B2B SaaS"]}'

# Upload leads
curl -X POST http://localhost:3000/leads/upload -F "file=@leads.csv"

# Run scoring
curl -X POST http://localhost:3000/score

# Get results
curl http://localhost:3000/results
