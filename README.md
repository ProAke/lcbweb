# LCB Web

Nuxt 3 website and content administration for Laemchabang Interautotire. The public site is in Thai. This repository includes starter content and AI-generated placeholder photography; it does **not** contain a complete migration of the old website or verified current Cockpit promotions.

## Local preview

Requirements: Node.js 20+ (Node 22 recommended).

```sh
npm install
npm run dev
```

With no `DATABASE_URL`, the public site shows a read-only preview from `server/utils/content.js`. Admin login requires MariaDB; no default admin or password is created. This preview is not a production data store.

## MariaDB setup

Create an empty MariaDB database and a restricted database user. Copy `.env.example` to `.env` and configure `DATABASE_URL`, `DATA_DIR`, and `COOKIE_SECURE`. Do not commit credentials.

```sh
npm run db:init
ADMIN_USERNAME=admin ADMIN_PASSWORD='a-long-unique-password' npm run db:admin
npm run dev
```

Open `/admin` to sign in. Admins can add admin/editor accounts; both roles can edit content, while only admins can manage users. `db:init` creates tables and inserts starter data without overwriting existing records. Review and replace it before launch. Protect the initial admin password and remove it from shell history/environment after use.

The upload directory defaults to `.data/uploads`; `DATA_DIR` should point to a persistent directory outside ephemeral application releases. JPEG, PNG and WebP are accepted (maximum 5 MB). Back up both MariaDB and this directory. Test restores regularly.

## Production

```sh
npm run build
HOST=0.0.0.0 PORT=3000 node .output/server/index.mjs
```

Use HTTPS, set `COOKIE_SECURE=true`, configure a trusted reverse proxy, protect the admin route, and set `DATABASE_URL` and `DATA_DIR` on the server. The in-process login limiter is suitable only for a single process; use a shared rate limiter at the proxy for multiple instances. Keep uploaded storage outside the web root. The placeholder privacy/terms text, contact details, stock, brand permissions and promotions require company approval before launch. TirePoint+ integration, payment, customer account, bookings, and complete legacy migration are not implemented.

For the product brief and outstanding decisions see [docs/website-plan-th.md](docs/website-plan-th.md).

## Reference data and imports

The read-only preview includes 10 explicitly labelled Cockpit reference products; they are not a branch inventory or price list. To stage these or supported CSV/JSON exports into an existing database, see [the import guide](docs/data-import-th.md). Imports default to draft and never overwrite an existing `(type, slug)`. Office authentication and a full legacy migration are not included. `data/legacy-products-page-1.csv` is an unverified snapshot of one legacy page with remote image links, not a complete export.
