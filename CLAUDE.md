# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Turn-based RPG battle game. The server delivers monster configurations and drives monster AI; the client renders a battle arena where a hero fights through 5 progressively harder monsters.

## Commands

### Server (`/server`)
```bash
npm run dev      # ts-node-dev with auto-reload (port 3000)
npm run build    # tsc → dist/
npm start        # run compiled dist/index.js
```

### Client (`/client`)
```bash
npm run dev      # Vite HMR dev server
npm run build    # tsc + vite build → dist/
npm run lint     # ESLint on .ts/.tsx
npm run preview  # preview production build
```

## Architecture

### Data Flow
1. React app boots with `RunConfigContext` and `PlayerContext` wrapping the tree
2. Player hits Start → `fetchConfig()` calls `GET /api/run-config`
3. Server returns `RunConfig` (5 monsters hardcoded in `server/src/data/monsters.ts`)
4. `App.tsx` routes between `MainMenu` and `BattleScreen`
5. Player picks a move → `useBattle.takeTurn(move)` runs the full round client-side, then calls `GET /api/monster-move` for the monster's response

### Server Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /api/run-config` | Returns full `RunConfig` (all 5 monsters, stats, moves, sprites). Called once at run start. |
| `GET /api/monster-move` | Returns the monster's chosen move. Query params: `monsterId`, `monsterCurrentHp`, `heroCurrentHp`, `monsterModifiers` (JSON). |

Monster AI in `server/src/routes/monsterMove.ts` uses weighted random selection — each move gets a score based on HP percentage and active modifiers (e.g. heal moves score higher when HP < 30%, buffs are penalized if already active).

### Battle Engine (`client/src/hooks/useBattle.ts`)

All combat math lives here. Key functions:

- `applyModifiers(base, modifiers)` — sums active buff/debuff deltas onto base stats
- `resolveMove(move, attackerStats, defenderStats)` — returns `MoveResult` (HP deltas + new modifier arrays)
- `tickModifiers(modifiers)` — decrements `turnsLeft`, prunes expired entries
- `takeTurn(playerMove)` — async; runs one full round: player acts → check win → fetch monster move → monster acts → check loss → back to `player_turn`

**Damage formulas (additive, not multiplicative):**
- Physical: `Math.max(0, attacker.attack + baseValue - defender.defense)`
- Magic: `attacker.magic + baseValue` (bypasses defense)
- Heal: `caster.magic + baseValue` restored to caster
- Drain: deals magic damage and heals caster for the same amount

Stat modifiers (buffs/debuffs) last 2 turns. `buff_*` effects add a positive delta to the caster's modifier list; `debuff_*` add a negative delta to the target's.

### Client State
- `RunConfigContext` — fetched monster configs (loaded once on game start)
- `PlayerContext` — hero stats, level, XP, learned/equipped moves; exposes `gainXp`, `learnMove`, `equipMove`, `unequipMove`
- `useBattle` hook — owns all in-battle state (HP, modifiers, phase)

### Sprites
Sprites are 32×32 px tiles rendered via `Sprite.tsx`, scaled 4× (128×128) in the UI.
- `public/32rogues/rogues.png` — player sprites (7 columns)
- `public/32rogues/monsters.png` — monster sprites (12 columns)

Coordinates stored in `client/src/data/sprites.ts` (player) and on each `Monster` object from the API.

### Shared Types
Both `server/src/types.ts` and `client/src/types.ts` define the domain model. Keep them in sync manually — there is no shared package.

Key types: `Monster`, `Move`, `Stats`, `SpriteCoords`, `StatModifier`, `MoveResult`, `BattleState` (phase: `player_turn | monster_turn | won | lost`).

Move effects: `damage | heal | drain | buff_attack | buff_defense | buff_magic | debuff_attack | debuff_defense | debuff_magic`.
