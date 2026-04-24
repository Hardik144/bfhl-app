# BFHL Full Stack Engineering Challenge

SRM Round 1 — Node Tree Explorer  
Built with **Node.js + Express** (backend) and **Vanilla HTML/CSS/JS** (frontend).

---

## Project Structure

```
bfhl-app/
├── backend/
│   ├── index.js        ← Express API (POST /bfhl)
│   └── package.json
├── frontend/
│   └── index.html      ← Single-page frontend
├── .gitignore
└── README.md
```

---

## ⚙️ Setup

### 1. Update your identity in `backend/index.js`

Open `backend/index.js` and replace these at the top:

```js
const USER_ID = "yourname_ddmmyyyy";           // e.g. johndoe_17091999
const EMAIL_ID = "your.email@srmist.edu.in";
const COLLEGE_ROLL_NUMBER = "RA2111003010001";
```

### 2. Install & run the backend locally

```bash
cd backend
npm install
npm start
# Server runs on http://localhost:3001
```

### 3. Open the frontend

Just open `frontend/index.html` in your browser.  
Set the API Base URL to `http://localhost:3001` (default).

---

## 🚀 Deploying

### Backend → Render (free)

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Copy your Render URL (e.g. `https://bfhl-api.onrender.com`)

### Frontend → Netlify (free)

1. Go to [netlify.com](https://netlify.com) → Add new site → Deploy manually
2. Drag & drop the `frontend/` folder
3. Done — you'll get a URL like `https://bfhl-explorer.netlify.app`
4. In the frontend, update the default API URL to your Render URL

---

## 📦 GitHub Setup

### First time

```bash
# In the bfhl-app folder
git init
git add .
git commit -m "Initial commit: BFHL Full Stack Challenge"

# Create a new PUBLIC repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/bfhl-challenge.git
git branch -M main
git push -u origin main
```

### Updates

```bash
git add .
git commit -m "Update identity fields"
git push
```

---

## API Reference

**POST** `/bfhl`

```json
{
  "data": ["A->B", "A->C", "B->D", "hello", "1->2"]
}
```

Response includes: `user_id`, `email_id`, `college_roll_number`, `hierarchies`, `invalid_entries`, `duplicate_edges`, `summary`.

---

## Notes

- CORS is enabled globally — evaluator can call from any origin
- All edge cases handled: invalid format, self-loops, duplicates, cycles, multi-parent (diamond), pure cycles
- Response time well under 3s for 50 nodes
