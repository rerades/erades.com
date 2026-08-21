# Area 73 - Multilingual Blog

A modern, multilingual blog built with Astro, TypeScript, and Tailwind CSS v4. This project features advanced search capabilities, comprehensive testing, and excellent performance optimization.

## 🌟 Features

- **Multilingual Support**: Full i18n with Spanish (es) and English (en) locales
- **Advanced Search**: FlexSearch-powered search with real-time results
- **Performance Optimized**: 100/100 Lighthouse performance scores
- **SEO Friendly**: Canonical URLs, OpenGraph data, and sitemap support
- **Content Collections**: Type-safe content management with Astro's content collections
- **Comprehensive Testing**: Unit tests, E2E tests, and visual regression testing
- **Modern Tech Stack**: Astro 7, TypeScript, Tailwind CSS v4, Vitest, Playwright
- **Server-Side Rendering**: Fast, SEO-friendly SSR with Node adapter
- **Code Highlighting**: Syntax highlighting with Expressive Code

## 🚀 Tech Stack

- **Framework**: Astro 7.2.2
- **Styling**: Tailwind CSS v4.1.12
- **Language**: TypeScript 5.9.2
- **Testing**: Vitest 3.2.4, Playwright 1.54.2
- **Search**: FlexSearch 0.8.205
- **Deployment**: Node.js adapter (standalone mode)

## 📁 Project Structure

```
src/
├── components/          # Reusable Astro components
├── content/
│   └── blog/
│       ├── en/         # English blog posts
│       └── es/         # Spanish blog posts
├── i18n/               # Internationalization
├── layouts/            # Page layouts
├── pages/              # Route pages
│   └── [lang]/         # Language-specific routes
├── styles/             # Global styles
├── test/               # Test utilities
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🧞 Commands

| Command                                   | Action                                                      |
| ----------------------------------------- | ----------------------------------------------------------- |
| `pnpm dev`                                | Start development server at `localhost:4321`                |
| `pnpm build`                              | Build for production (includes FlexSearch index generation) |
| `pnpm preview`                            | Preview production build locally                            |
| `pnpm test:unit`                          | Run unit tests                                              |
| `pnpm test:unit:watch`                    | Run unit tests in watch mode                                |
| `pnpm coverage`                           | Run unit tests with coverage report                         |
| `pnpm test:e2e`                           | Run end-to-end tests (Playwright starts the server itself)  |
| `pnpm test:visual`                        | Run visual regression tests (needs a server on :4321)       |
| `pnpm test:visual:update`                 | Update visual baselines (CI is authoritative, see docs)     |
| `pnpm lint`                               | Lint code with ESLint                                       |
| `pnpm lint:fix`                           | Fix linting issues automatically                            |
| `pnpm translate:es-en`                    | Translate Spanish posts to English                          |
| `pnpm translate:en-es`                    | Translate English posts to Spanish                          |

## 🎯 Key Features

### Multilingual Blog

- Content organized by language (`en/`, `es/`)
- Automatic language detection and routing
- SEO-optimized with proper hreflang tags

### Advanced Search

- Real-time search with FlexSearch
- Search across both languages
- Automatic search index generation during build

### Comprehensive Testing

- **Unit Tests**: Vitest with happy-dom for component testing
- **E2E Tests**: Playwright for full user journey testing in Docker containers
- **Visual Regression**: Automated visual testing with snapshots
- **Coverage**: Code coverage reporting with V8

### Performance & SEO

- Server-side rendering for optimal performance
- Optimized images with Sharp
- Sitemap generation with i18n support
- RSS feed support
- Core Web Vitals optimization

### Development Experience

- TypeScript for type safety
- ESLint for code quality
- Hot module replacement
- Comprehensive error handling

## 🚀 CI/CD Pipeline

This project includes a comprehensive CI/CD pipeline with GitHub Actions optimized for speed and reliability:

### Automated Workflows

- **CI**: Runs on every push and PR with linting, unit tests, E2E tests, visual tests, and build
- **Security**: Weekly security scans and dependency reviews
- **Visual Snapshots**: Manual workflow to update visual regression snapshots
- **Dependabot**: Automated dependency updates with smart filtering

### Container Strategy

The CI/CD pipeline uses a hybrid approach for optimal performance:

**Jobs Node** (lint, test, build):

- Use pnpm cache on GitHub runners
- Install dependencies locally
- Fast execution for simple tasks

**Jobs Docker** (E2E, Visual):

- Build optimized `erades-com-e2e` image with buildx cache
- Execute tests inside containers for consistency
- Use named volumes for persistence

### Quality Gates

- ✅ Linting with ESLint (zero warnings)
- ✅ Unit tests with Vitest (coverage reporting)
- ✅ E2E tests with Playwright in containers
- ✅ Visual regression tests with snapshots
- ✅ Security scans with pnpm audit
- ✅ Build verification
- ✅ Automatic deployment to production (master branch only)

### Optimizations

- **Concurrency**: Prevents infinite queues by canceling previous runs
- **Buildx Local Cache**: Local cache for faster Docker image builds
- **Timeouts**: Prevents zombie jobs and resource waste
- **Named Volumes**: Consistency between local and CI environments

### Local Development

All CI checks can be run locally:

```bash
# Linting
pnpm lint

# Unit tests
pnpm test

# Unit tests with coverage
pnpm coverage

# E2E tests
pnpm test:e2e

# Visual tests (needs `pnpm build && pnpm start` running)
pnpm test:visual

# Build
pnpm build
```

For more details, see [`.github/README.md`](.github/README.md).

## 🌐 Content Categories

The blog covers various topics including:

- **Functional Programming**: Monads, functors, combinators, transducers
- **JavaScript Patterns**: Method chaining, lexical scope, IIFE patterns
- **Experiments**: Interactive demos and experiments
- **AI Insights**: AI-related takeaways and observations

## 🔧 Configuration

### Environment Variables

Create a `.env` file for translation features:

```
OPENAI_API_KEY=your_openai_api_key
```

### Build Process

The build process includes:

1. FlexSearch index generation for search functionality
2. Astro build with SSR output
3. Static asset optimization

## 📊 Testing Strategy

- **Unit Tests**: Component and utility function testing with Vitest
- **E2E Tests**: Full user journey testing across languages in Docker containers
- **Visual Regression**: Automated visual testing for UI consistency with snapshots
- **Performance**: Lighthouse CI integration for performance monitoring

## 🚀 Deployment

The project is configured for Node.js deployment with:

- Standalone mode for optimal performance
- Server-side rendering for SEO
- Automatic sitemap generation
- RSS feed generation

## RSS Feeds

Este sitio web incluye múltiples feeds RSS para facilitar la suscripción al contenido:

### Feeds Disponibles

- **RSS Español** (`/rss.xml`) - Solo posts en español
- **RSS English** (`/en/rss.xml`) - Solo posts en inglés
- **RSS Combinado** (`/feed.xml`) - Todos los posts (español e inglés)

### Características

- ✅ Filtrado automático de posts en draft
- ✅ Ordenamiento por fecha de publicación (más reciente primero)
- ✅ Metadatos completos (fechas, categorías, tags)
- ✅ Presentación visual mejorada con XSL
- ✅ Soporte multiidioma
- ✅ Enlaces corregidos para estructura de rutas

### Cómo Suscribirse

1. Copia la URL del feed que prefieras
2. Añádela a tu lector RSS favorito
3. ¡Listo! Recibirás notificaciones de nuevos posts

### Lectores RSS Recomendados

- **Web**: Feedly, Inoreader, NewsBlur
- **Desktop**: NetNewsWire (macOS), RSS Guard (Windows/Linux)
- **Mobile**: Feedly, Inoreader, NetNewsWire (iOS)

## 📝 Contributing

1. Follow TypeScript strict mode
2. Write tests for new features
3. Maintain visual regression snapshots
4. Follow the established component patterns
5. Use proper i18n for all user-facing text
6. Ensure all CI checks pass before submitting PRs

## 📄 License

This project is based on the Astro Blog starter template and enhanced with multilingual support and advanced features.
