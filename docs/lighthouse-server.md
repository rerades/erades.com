# Lighthouse CI Server - Local Configuration

This document explains how to configure and use the Lighthouse CI Server locally to monitor your website's performance.

## 🚀 Quick Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Build the project

```bash
pnpm build
```

### 3. Run Lighthouse (mobile + desktop in a single build)

```bash
pnpm lhci:server:up       # make sure the server is up
pnpm lhci:ci:both         # runs 2 collects (mobile and desktop additive) and 1 upload
```

## 📊 Results

Results are automatically uploaded to the local LHCI server and persisted in the SQLite database: `db/lighthouse/lhci.db`. You can view them at `http://localhost:9001`.

## 🐳 Lighthouse CI Server with Docker

Based on the official LHCI Server [documentation](https://googlechrome.github.io/lighthouse-ci/docs/server.html):

### Structure and persistence

- The SQLite database is persisted in `db/lighthouse/` (under version control).
- Uses the `patrickhulce/lhci-server` image and mounts the volume at `/data`.

File `docker-compose.lhci.yml`:

```yaml
version: "3.8"
services:
  lhci-server:
    image: patrickhulce/lhci-server
    container_name: lhci-server
    ports:
      - "9001:9001"
    volumes:
      - ./db/lighthouse:/data
    restart: unless-stopped
```

Useful scripts in `package.json`:

```json
{
  "scripts": {
    "lhci:server:up": "docker compose -f docker-compose.lhci.yml up -d",
    "lhci:server:down": "docker compose -f docker-compose.lhci.yml down",
    "lhci:server:logs": "docker compose -f docker-compose.lhci.yml logs -f",
    "lhci:server:ps": "docker compose -f docker-compose.lhci.yml ps"
  }
}
```

### Steps to start the server

1. Create database directory if it doesn't exist: `mkdir -p db/lighthouse`
2. Start the server: `pnpm lhci:server:up`
3. Open `http://localhost:9001` in your browser

No authentication or firewall rules, accessible locally.

### Initialize the first project (persistent)

When you visit `http://localhost:9001/app/projects` you'll see the message to run the wizard. To persist the configuration in `db/lighthouse/lhci.db` use:

```bash
pnpm lhci:wizard:db
```

This command runs the LHCI wizard pointing to the same SQLite database persisted by Docker.

Alternative with Docker (uses the server container):

```bash
docker exec -it lhci-server node /usr/src/lhci/node_modules/.bin/lhci wizard \
  --storage.storageMethod=sql \
  --storage.sqlDialect=sqlite \
  --storage.sqlDatabasePath=/data/lhci.db
```

Both methods write to `db/lighthouse/lhci.db`, leaving tokens and project configured permanently.

### Run audits and upload automatically to the server

With the current configuration, it's recommended to run two `collect` (mobile and desktop with `--additive`) and a single `upload` per commit hash:

```bash
pnpm lhci:server:up  # make sure the server is running
pnpm lhci:ci:both    # 2 collects (one mobile, one desktop additive) + 1 upload
```

Notes:

- The server rejects duplicate uploads for the same hash.
- Desktop is distinguished in the dashboard using `?device=desktop` in URLs from `lighthouserc.desktop.cjs`.

## 🔧 Available Scripts

### Lighthouse CI

- `pnpm lhci:ci:both` - Runs mobile + desktop (additive) and performs a single upload
- `pnpm lhci:ci:mobile` - (optional) Mobile only
- `pnpm lhci:ci:desktop` - (optional) Desktop only

## 📁 File Structure

```
├── lighthouserc.cjs           # Configuration for mobile (base URLs)
├── lighthouserc.desktop.cjs   # Configuration for desktop (emulation + ?device=desktop)
├── db/
│   └── lighthouse/
│       └── lhci.db            # Persistent LHCI server database
└── docs/
    └── lighthouse-server.md   # This documentation
```

## ⚙️ Configuration

### Lighthouse CI Configuration

The configuration files contain:

- **lighthouserc.cjs**: Configuration for mobile tests (default preset)
- **lighthouserc.desktop.cjs**: Configuration for desktop (screen emulation, `formFactor: desktop` and URLs with `?device=desktop`)
- **Test URLs**: Main pages of the site
- **Budgets**: Performance limits
- **Assertions**: Quality thresholds

## 📈 Monitored Metrics

### Core Web Vitals

- **First Contentful Paint (FCP)**: < 1500ms
- **Largest Contentful Paint (LCP)**: < 2000ms
- **Total Blocking Time (TBT)**: < 150ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Categories

- **Performance**: Minimum 90%
- **Accessibility**: Minimum 95%
- **SEO**: Minimum 95%

### Resources

- **Scripts**: Maximum 300KB, 20 files
- **Stylesheets**: Maximum 120KB, 8 files
- **Images**: Maximum 800KB, 40 files
- **Fonts**: Maximum 400KB, 8 files
- **Third-party**: Maximum 150KB, 15 files

## 🔍 Results Analysis

### Generated Reports

Results are saved in `metrics/lighthouse/` with:

- **HTML Reports**: Complete visualization of results
- **JSON Data**: Structured information for analysis
- **Metrics**: Scores by category and Core Web Vitals

### Interpretation

- **Performance**: Performance score (0-100)
- **Accessibility**: Accessibility score (0-100)
- **SEO**: SEO score (0-100)
- **Best Practices**: Best practices score (0-100)

## 🛠️ Troubleshooting

### Build errors

```bash
# Clear cache
rm -rf dist/ .astro/

# Reinstall dependencies
pnpm install

# Rebuild
pnpm build
```

### Lighthouse CI issues

```bash
# Clear previous results
rm -rf metrics/lighthouse/

# Reinstall Lighthouse dependencies
pnpm install @lhci/cli
```

## 🔄 CI/CD Integration

To integrate with GitHub Actions, add this job (single upload per commit):

```yaml
- name: Lighthouse CI
  run: |
    pnpm build
    pnpm lhci:server:up
    pnpm lhci:ci:both
```

## 📚 Additional Resources

- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Lighthouse Scoring](https://web.dev/performance-scoring/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Performance Budgets](https://web.dev/performance-budgets-101/)
