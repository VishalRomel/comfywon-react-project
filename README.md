# ComfyWon React Landing Page

This is a full React project using:

- React
- Vite
- Tailwind CSS
- Framer Motion

## How to run

Open the project folder in VS Code, then run:

```bash
npm install
npm run dev
```

Then open the local URL Vite shows in the terminal, usually:

```text
http://localhost:5173
```

## Main files

```text
src/main.jsx       # React entry point
src/App.jsx        # Main ComfyWon landing page component
src/index.css      # Tailwind CSS import and basic global CSS
vite.config.js     # Vite + React + Tailwind setup
package.json       # Project dependencies and scripts
```

## Notes

The design uses inline SVG icons, so you do not need `lucide-react` for this version. The only animation package needed is `framer-motion`.
