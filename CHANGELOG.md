# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2026-05-04

### Added

- CHANGELOG publicado e release v1.0.1 criada no GitHub.

### Fixed

- Build de produção validado (Vite + Vitest, 600+ módulos).

## [1.0.0] - 2025-05-01

### Added

- Vue 3 + Vuetify 4 frontend for AI metrics dashboard
- Dashboard module with real-time metrics overview (`AiDashboard.vue`)
- `AiStatCard` component for individual metric display
- Incidents integration: incident list and detail views linked to AI metrics
- Pinia store for AI metrics state management (`aiMetricsStore`)
- Utility formatters for metric values and timestamps (`aiMetricsFormatters`)
- Vitest unit test suite for store, formatters, and components
- CI pipeline via GitHub Actions (`.github/workflows/ci.yml`): Node 20, `npm test` (Vitest), `npm run build`
- Vite production build configuration
- `.env.example` with required environment variables documented
- `BUNDLE_SUMMARY.md` describing project architecture

[Unreleased]: https://github.com/ericson-j-santos/ai-metrics-vue-vuetify/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/ericson-j-santos/ai-metrics-vue-vuetify/releases/tag/v1.0.0
