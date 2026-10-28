# Fotonary

A Pictionary-style drawing game built with React Native, Expo and TypeScript. Configure teams and players, draw a word against the clock, and track scores and round results on a shared device.

[Play the web demo](https://fotonarygame--i6ap4h0tmo.expo.app/)

## Features

- Team and player configuration, adjustable round duration and target score.
- Drawing canvas with paths rendered using React Native SVG.
- Words with difficulty categories and point values.
- Timed rounds with pause and resume controls.
- Score updates and in-memory round history.

## Run locally

Use Node.js 22.18+ (required for the tests' native TypeScript support) and npm.

```sh
npm ci --legacy-peer-deps
npm run dev
```

The pinned Lucide dependency declares support through React 18 while this app uses React 19. The installation command above bypasses that existing peer dependency conflict; runtime compatibility still needs validation.

Open the Expo development server and choose a supported target. To export the web app:

```sh
npm run build:web
```

The export is written to `dist/`.

## Architecture and decisions

- `app/`: Expo Router routes and navigation.
- `components/`: game, configuration, results and drawing interfaces.
- `contexts/GameContext.tsx`: React context that exposes game state and actions to the interface.
- `contexts/gameReducer.ts`: pure state transitions, separated from React so game rules can be tested without rendering screens.
- `types/game.ts`: shared models for teams, words, settings and round results.
- `data/`: word data.

Context and `useReducer` keep the shared-device game state in one place without adding a state management dependency. Actions use a discriminated union so TypeScript checks the payload for each operation. The current turn rule visits all players on one team before moving to the next team.

## Validation

```sh
npm test
npm run typecheck
```

The tests cover successful and missed rounds, score deductions, turn rotation with unequal team sizes, pause/resume, and resetting a game with custom teams. They use Node's built-in test runner and do not require a separate testing framework. These are logic tests; they do not validate touch input or device rendering.

## Scope and limitations

Game state is held in memory and is reset when the app reloads. This repository demonstrates a client application; it does not implement a Java/Spring Boot backend, database persistence or online multiplayer. The published demo is deployed separately and may differ from the latest source changes.

## AI-assisted development

The repository's history includes a rename from `bolt-expo-starter`. That identifies a starter origin, but does not establish how much code was generated or which decisions were made by the author.

During this maintenance pass, Codex assisted with extracting and typing the reducer, adding regression tests, fixing the active team on reset, and writing this documentation. An interview walkthrough should distinguish this assistance from the author's original work and explain the decisions and validation behind both.

## Verification for this maintenance pass

All six reducer tests passed on Node.js 26.12.1. Full application type checking and web export could not be completed: dependency installation ran out of disk space. The incomplete local installation was removed. No mobile or browser interaction tests were performed for these changes.
