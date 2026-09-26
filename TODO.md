# TODO - Fix /admin not opening

- [x] Confirm what happens for `/admin` (404 vs blank vs stays on Home) and whether app is served via `vite dev` or `vite preview` / nginx.
- [x] Update `frontend/vite.config.js` to enable SPA history fallback so `/admin` serves `index.html`.

- [x] Re-test direct navigation to `/admin`.
- [x] (If still failing) adjust production hosting config (nginx/apache) to route all non-asset requests to `index.html`.
- [x] Record results.

Result: `/admin` now redirects to `/admin/login` for signed-out visitors and to `/admin/dashboard` for authenticated admins.

