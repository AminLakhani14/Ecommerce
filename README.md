# AG Store frontend

React + TypeScript, compiled with Vite. Use Node.js **26.12.0** (Current), pinned in `.nvmrc` and `.node-version`. With fnm, run `fnm install` and `fnm use` in this directory.

```sh
npm ci
npm run dev
```

The frontend opens at **http://localhost:3000** and uses the deployed API at **https://ag-store-ecommerce-backend.onrender.com** for API requests and uploaded images. `npm start` is an alias for the Vite development server.

The development proxy also forwards relative `/api` and `/uploads` requests to the deployed API. Copy `.env.example` to `.env.local` to customize:

- `VITE_PROXY_TARGET`: backend destination for the development proxy.
- `VITE_API_URL`: public API origin, including uploaded images and Axios requests. The project `.env` configures the deployed Render backend for development and production builds. Leave empty to use the development proxy or a same-origin production API.

To use a local backend instead, set `VITE_API_URL=` and `VITE_PROXY_TARGET=http://localhost:5000` in `.env.local`. Restart Vite after changing environment values.

Vite exposes `VITE_` values in the browser bundle; use them only for public configuration. Set production values before building. The old Create React App `WDS_SOCKET_PORT`, `DANGEROUSLY_DISABLE_HOST_CHECK`, and `PORT` variables are no longer used. Change the dev port with `npm run dev -- --port 3001`.

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

`npm run build` runs strict TypeScript checks and writes production assets to **dist/**. `npm run preview` serves that output locally; it does not proxy requests to the backend. `npm test` runs Vitest with React Testing Library and jsdom. Use `npm run test:watch` for watch mode.

Deploy the contents of `dist/`, replacing the old Create React App `build/` publish directory. Configure SPA fallback routing to `index.html` for client-side routes. When hosting the API separately, set `VITE_API_URL` to its HTTPS origin and allow the frontend origin in the backend's CORS configuration (`FRONTEND_URL`). When using a same-origin production API, configure the hosting server to forward `/api` and `/uploads` to the backend.

The root `index.html` is the Vite entry point. Static assets remain in `public/`; application source files use `.ts` and `.tsx`.
