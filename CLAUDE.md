# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
WebSnack is a collection of small web applications, games, and tools that can be deployed to any static hosting service. It uses Vite as the build tool with multi-page support.

## Architecture
```
WebSnack/
├── apps/                 # All applications live here, one subdirectory per app
│   ├── demo/            # Demo example app
│   ├── game-2048/       # 2048 game app
│   └── [app-name]/      # New apps should follow the naming convention: [type]-[name]
│                        # Types: game-, tool-, app-
├── shared/               # Shared resources across all apps
│   ├── components/      # Reusable UI components
│   ├── utils/           # Utility functions (storage, common helpers)
│   ├── styles/          # Global and shared styles
│   └── assets/          # Shared images, icons, etc.
├── public/               # Static assets copied directly to build output
├── docs/                 # Documentation
└── index.html            # Home page with app navigation
```

## Key Features
- **Multi-page Vite setup**: Automatically detects all apps in the `apps/` directory
- **Shared utilities**: Common functions available to all apps via `@shared` alias
- **GitHub Pages ready**: Pre-configured GitHub Actions for automatic deployment
- **Relative path configuration**: Works on any static hosting platform without path changes

## Common Commands

### Development
```bash
# Start development server on http://localhost:5173
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build locally
npm run preview
```

### Adding New Apps
1. Create a new directory under `apps/` following naming convention: `[type]-[name]`
2. Add `index.html` as the entry point (required)
3. Add `main.js` and `style.css` as needed
4. Add a link to the new app in the root `index.html` navigation
5. All shared utilities are available via `@shared/utils/` import alias

### Deployment
- **GitHub Pages**: Auto-deploys on push to main branch via `.github/workflows/deploy.yml`
- **Vercel/Netlify**: Connect repo, set build command to `npm run build`, output directory to `dist`
- **Any static host**: Upload the `dist/` directory after running `npm run build`

## Important Conventions
- App directory naming: `game-xxx` for games, `tool-xxx` for tools, `app-xxx` for applications
- All links use relative paths to ensure compatibility with any hosting environment
- Shared code goes in `shared/`, app-specific code stays in the app's directory
- Commit messages follow conventional commits: `feat: add xxx`, `fix: xxx issue`, `docs: update xxx`

## Important Files
- `vite.config.js`: Vite configuration with multi-page setup and import aliases
- `.github/workflows/deploy.yml`: GitHub Actions deployment workflow
- `shared/utils/storage.js`: Local storage utilities used by all apps
- `shared/utils/common.js`: Common utility functions
