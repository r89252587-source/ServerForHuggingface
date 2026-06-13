# FrameKarts Store Matcher — Vercel Deployment

## Deploy to Vercel

1. Install Vercel CLI:
   ```
   npm i -g vercel
   ```

2. Deploy:
   ```
   vercel
   ```

3. Add your environment variable in Vercel dashboard:
   - Key: `HF_API_KEY`
   - Value: your Hugging Face API key

## API Usage

**Endpoint:** `POST /match-store`

**Request body:**
```json
{ "userLocation": "Beur" }
```

**Response:**
```json
{ "store": { "id": 4, "name": "Anishabad" } }
```

## Use in n8n

- URL: `https://your-app.vercel.app/match-store`
- Method: POST
- Body (JSON):
```json
{ "userLocation": "{{ $json.userLocation }}" }
```
