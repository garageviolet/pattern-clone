# Pattern Clone

A Vue 3 implementation of the Pattern learning platform interface.

## Overview

This project recreates the core functionality of Pattern (pattern.swarma.org) using modern web technologies. Built with Vue 3 and TypeScript, it demonstrates practical API integration and component architecture.

## Quick Start

```bash
npm install
npm run dev
```

## Technology

- Vue 3 with Composition API and TypeScript
- Vite for build tooling
- Ant Design Vue component library
- Pinia for state management
- Axios for HTTP requests

## Development

The proxy configuration in `vite.config.ts` handles CORS by routing requests to:
- `pattern.swarma.org` for main API endpoints
- `api.swarma.org` for learning path data

### Build Commands

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run preview  # Preview production build locally
```

## Implementation Notes

The application uses Vue 3's `<script setup>` syntax for component composition. State management is handled through Pinia stores, and routing is configured with Vue Router.


All API integrations maintain compatibility with the original Pattern platform endpoints.

https://github.com/user-attachments/assets/530893b3-26a8-44e5-a777-b0ff7fcbcadc

## Reference

Original platform: https://pattern.swarma.org
