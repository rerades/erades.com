# CI/CD Pipeline

This directory contains the GitHub Actions configuration for the erades.com project.

## Workflows

### 1. CI (`ci.yml`)

The main workflow that runs on every push and pull request:

- **Lint**: Verifies code with ESLint (timeout: 10min)
- **Unit Tests**: Runs unit tests with Vitest and coverage (timeout: 15min)
- **E2E Tests**: Runs end-to-end tests with Playwright in container (timeout: 30min)
- **Visual Tests**: Runs visual regression tests in container (timeout: 20min)
- **Build**: Builds the application (timeout: 15min)

**Features:**

- Concurrency to automatically cancel previous runs
- Local buildx cache to optimize Docker image construction
- "Everything inside container" strategy for E2E and visual tests

### 2. Update Visual Snapshots (`update-snapshots.yml`)

Manual workflow to update visual regression snapshots:

- Can be executed manually from GitHub Actions
- Allows choosing between "enhanced" or "basic" environment
- Automatically creates a PR with updated snapshots
- Uses the same local buildx cache as the main CI (timeout: 30min)

### 3. Security (`security.yml`)

Security and dependency scanning:

- Runs `pnpm audit` weekly
- Dependency review on PRs
- Automatic vulnerability scanning

### 4. Auto Merge (`automerge.yml`)

Automatic workflow for PR merging:

- Runs when the "automerge" label is added
- Waits for all checks to pass before merging
- Uses squash merge as the default method

### 5. Label Auto Merge (`label-automerge.yml`)

Workflow that automatically labels PRs for auto-merge:

- Runs when CI passes successfully
- Adds the "automerge" label to PRs targeting master

## Configuration

### Required Secrets

For deployment, you need to configure these secrets in your repository:

- `DEPLOY_KEY`: SSH key for the server
- `DEPLOY_HOST`: Server hostname
- `DEPLOY_PATH`: Path on the server
- `SNYK_TOKEN`: Snyk token (optional)
- `CODECOV_TOKEN`: Codecov token for coverage (optional)

### Branch Configuration

The project uses `master` as the main branch. All workflows are configured to:

- Run on pushes to `master`
- Run on pull requests targeting `master`
- Deploy automatically only from `master`

### Dependabot Configuration

The `dependabot.yml` file is configured to:

- Update npm dependencies weekly
- Update GitHub Actions weekly
- Ignore major updates of critical packages
- Automatically assign PRs to @rerades

## Container Strategy

### Node Jobs vs Docker Jobs

**Node Jobs** (lint, test, build):

- Use pnpm cache on the host
- Install dependencies locally
- Run on GitHub runner

**Docker Jobs** (E2E, Visual):

- Build `erades-com-e2e` image with local buildx cache
- Run tests inside the container
- Use named volumes for persistence

### Optimized Cache

- **pnpm cache**: For Node jobs (lint, test, build)
- **Local buildx cache**: For Docker image construction in `/tmp/.buildx-cache`
- **Docker volumes**: For browsers, node_modules and pnpm store

## Artifacts

The workflows generate these artifacts:

- `playwright-report`: HTML reports of E2E tests
- `visual-test-results`: Visual regression test results
- `build-output`: Application build

## Troubleshooting

### Visual Tests Fail

If visual regression tests fail:

1. Run the "Update Visual Snapshots" workflow manually
2. Review the changes in the generated PR
3. Accept the changes if they are correct

### E2E Tests Fail

If E2E tests fail:

1. Verify that the application builds correctly
2. Review Docker container logs
3. Confirm that webServer is configured with `--host 0.0.0.0`

### Build Fails

If the build fails:

1. Verify that all dependencies are installed
2. Review linting logs
3. Ensure TypeScript compiles correctly

### Buildx Cache Not Working

If the buildx cache is not working:

1. Verify that the `/tmp/.buildx-cache` directory has write permissions
2. Confirm that the runner has sufficient disk space
3. Review Docker build logs

### Timeouts

If jobs fail due to timeout:

- **Lint**: 10 minutes (usually sufficient)
- **Unit Tests**: 15 minutes (includes coverage)
- **Visual Tests**: 20 minutes (build + tests)
- **E2E Tests**: 30 minutes (build + tests)
- **Build**: 15 minutes (application build)
- **Update Snapshots**: 30 minutes (build + tests + PR)

## Implemented Optimizations

- **Concurrency**: Prevents infinite queues by canceling previous runs
- **Local buildx cache**: Reduces Docker image construction time
- **Timeouts**: Prevents zombie jobs and excessive resource usage
- **Named volumes**: Consistency between local and CI
- **Unified strategy**: Everything inside container for E2E/visual tests
