# CLAUDE.md - DerModel Frontend

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (runs TypeScript compile and Vite build)
- `npm run lint` - Run ESLint on codebase
- `npm run preview` - Preview production build locally

## Code Style Guidelines
- **Imports**: Group imports by type (React, libraries, local components)
- **Components**: Use functional components with TypeScript FC type (`const Component: FC = () => {}`)
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Types**: Use explicit typing with TypeScript, avoid `any`
- **State Management**: Prefer React hooks (useState, useRef, useEffect)
- **Error Handling**: Use try/catch blocks for async operations
- **React Three Fiber**: Use for 3D rendering with Three.js
- **File Structure**: Components in src/components, services in src/services
- **Formatting**: Follow ESLint rules defined in eslint.config.js
- **Cleanup**: Always cleanup resources in useEffect return functions