# Expense Tracker Pro

A modern, full-featured personal finance dashboard built with React, Vite, and Tailwind CSS. Track expenses, visualize spending patterns, generate monthly reports, and export/import data — all persisted locally in your browser.


## Features

- **Dashboard** — Summary cards for total expenses, monthly spending, top category, and transaction count
- **Expense CRUD** — Add, edit, delete expenses with validation and confirmation dialogs
- **Categories** — 9 default categories with color-coded badges
- **Filtering & Search** — Search by title, filter by category/month/year, sort by date/amount/category
- **Monthly Reports** — Total spent, category breakdown, average daily spending, largest expense
- **Charts** — Pie, line, bar, and area charts powered by Recharts
- **Local Storage** — All data persists in browser localStorage
- **Dark Mode** — Toggle between light and dark themes
- **CSV Export/Import** — Backup and restore your expense data
- **Responsive Design** — Optimized for desktop, tablet, and mobile

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 6 | Build tool & dev server |
| Tailwind CSS 3 | Styling |
| Recharts 2 | Data visualization |
| localStorage | Data persistence |


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- npm 9+ (comes with Node.js)

### Installation

1. **Clone or navigate to the project directory:**

   ```bash
   cd "Expense Tracker"
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. Open the URL shown in the terminal (typically `http://localhost:5173`).

### Tailwind CSS Setup

Tailwind is pre-configured in this project. If setting up from scratch, these are the steps used:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure `tailwind.config.js`:

```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: { extend: {} },
  plugins: [],
};
```

Add Tailwind directives to `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Build for Production

```bash
npm run build
```

Output is written to the `dist/` folder.

Preview the production build locally:

```bash
npm run preview
```

## Deploy to Azure Static Web Apps

### Option 1: Azure Portal (Recommended for first deploy)

1. **Push your code to GitHub.**

2. **Create an Azure Static Web App:**
   - Go to [Azure Portal](https://portal.azure.com)
   - Click **Create a resource** → **Static Web App**
   - Select your subscription and resource group
   - Connect your GitHub repository
   - Set build details:
     - **App location:** `/`
     - **Api location:** *(leave empty)*
     - **Output location:** `dist`
   - Azure will auto-generate a GitHub Actions workflow

3. **Update the workflow** (if needed) to match `.github/workflows/azure-static-web-apps.yml` in this repo.

4. On push to `main`, GitHub Actions builds and deploys automatically.

### Option 2: Azure CLI

```bash
# Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Build the project
npm run build

# Deploy locally (requires deployment token from Azure Portal)
swa deploy ./dist --deployment-token <YOUR_DEPLOYMENT_TOKEN>
```

### Option 3: Manual Deploy via Azure Portal

1. Run `npm run build`
2. In Azure Portal, open your Static Web App
3. Go to **Overview** → download the deployment token
4. Use the SWA CLI or upload `dist/` contents

### SPA Routing

The included `staticwebapp.config.json` configures fallback routing so all paths serve `index.html` — required for single-page applications.

```json
{
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

### Environment Variables

This app stores all data in browser localStorage — no backend or API keys required. No environment variables are needed for deployment.

## CSV Import Format

Import CSV files with these columns:

```csv
id,title,amount,category,date,notes
abc123,Grocery Shopping,85.50,Food,2026-06-01,Weekly groceries
```

Required columns: `title`, `amount`, `category`, `date`. The `id` and `notes` columns are optional.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 👨‍💻 Author

**Mohamed Dilshad KP**

- GitHub: https://github.com/Dilshad-01
- LinkedIn: https://www.linkedin.com/in/mdilshadkp
- Repository: https://github.com/Dilshad-01/memoraid-system-monitor.git
- Website: www.dilshadkp.cloud

If you found this project helpful, consider giving it a ⭐ on GitHub.

