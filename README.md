## Demo video

[▶ Watch demo](demo.mov)

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
4. `App.tsx` routes between `MainMenu`, `MapScreen`, `BattleScreen`, and `RunCompleteScreen`; tracks `monsterIndex` (0–4) and `clearedCount` (0–5)
5. Player selects the current encounter on the map → `BattleScreen` receives `monsterIndex`; encounters before `clearedCount` show "Cleared", after show "Locked"
6. Win → `onWin` advances `clearedCount` only if `monsterIndex === clearedCount` (first-time clear); at 5 → `RunCompleteScreen`; otherwise back to map. Cleared encounters show a "Replay" button — replays still award XP and moves but don't re-advance `clearedCount`. Loss → "Try Again" resets the battle, no progression change
7. Player picks a move → `useBattle.takeTurn(move)` runs the full round client-side, then calls `GET /api/monster-move` for the monster's response

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
- `takeTurn(playerMove)` — async; runs one full round: player acts → check win → fetch monster move (overlapped with a 500 ms animation pause via `Promise.all`) → monster acts → check loss → back to `player_turn`
- `lastAction: LastAction` — `{ role: 'hero'|'monster', move, key }` set at the start of each actor's action, cleared 500 ms after it resolves; `BattleScreen` reads this to drive move animations
- `log: LogEntry[]` — appended after every `resolveMove` call with the raw HP deltas; cleared on `reset()`; read by `BattleLog` to display the combat history
- On win, `BattleState.wonMove` is set to a randomly picked move from the monster's moveset; `BattleScreen` picks this up via a `useEffect` to call `learnMove` + `gainXp(100)`

**Damage formulas (additive, not multiplicative):**
- Physical: `Math.max(0, attacker.attack + baseValue - defender.defense)`
- Magic: `attacker.magic + baseValue` (bypasses defense)
- Heal: `caster.magic + baseValue` restored to caster
- Drain: deals magic damage and heals caster for the same amount
- Self-damage: `baseValue` flat HP loss to the caster (used by Dark Pact — no stat scaling)

Stat modifiers (buffs/debuffs) last 2 turns. `buff_*` effects add a positive delta to the caster's modifier list; `debuff_*` add a negative delta to the target's.

### Screens
- `MainMenu` — start button; triggers `fetchConfig()`, resets `clearedCount` to 0, navigates to `MapScreen`
- `MapScreen` — shows all 5 encounters as cards gated by `clearedCount` (Cleared / Fight / Locked); move management below (Equipped section with Unequip buttons, Move Pool with Equip buttons, max 4 equipped)
- `BattleScreen` — takes `monsterIndex` + `onWin` props; win overlay has Continue (`onWin`), loss overlay has Try Again (`reset`)
- `RunCompleteScreen` — shown after beating monster 5; Return to Menu resets `clearedCount` and goes back to `MainMenu`

### Client State
- `RunConfigContext` — fetched monster configs (loaded once on game start)
- `PlayerContext` — hero stats, level, XP, learned/equipped moves; exposes `gainXp`, `learnMove`, `equipMove`, `unequipMove`
- `useBattle` hook — owns all in-battle state (HP, modifiers, phase, wonMove)

### Battle Log (`client/src/components/battle/BattleLog.tsx`)

Fixed-height (`h-32`) scrollable panel rendered between the combatants and move selection in `BattleScreen`. Shows one row per action: actor label (Hero in yellow, Monster in red), move name, and a formatted outcome string derived from `LogEntry`. Auto-scrolls to the latest entry via a sentinel `<div>` and `useEffect` on `entries.length`. Shows "No actions yet" when empty.

`formatOutcome` maps effects + raw HP deltas to readable strings:
- `damage` → `−N dmg`, `heal` → `+N HP`, `drain` → `−N dmg, +N HP`, `self_damage` → `−N HP (self)`
- `buff_*/debuff_*` → `+ATK / −DEF / +MAG` etc.

### Move Animations (`client/src/components/battle/MoveAnimation.tsx`)

`MoveAnimation` renders a CSS-only overlay absolutely positioned over a combatant sprite. `AnimKind` maps to:

| Kind | Trigger condition | Visual |
|---|---|---|
| `slash` | physical `damage` on target | 3 staggered red diagonal lines |
| `magic` | magic `damage` on target | purple orb burst + sparkle particles |
| `heal` | `heal` or `drain` on caster | green `+` signs floating up |
| `drain` | `drain` on target | purple orbs rising up |
| `buff` | `buff_*` on caster | gold `↑` arrows rising |
| `debuff` | `debuff_*` on target | red `↓` arrows falling |

`BattleScreen` derives which `AnimKind` to show on each `Combatant` from `useBattle`'s `lastAction`. The `key` field on `lastAction` increments each action so React remounts `MoveAnimation` and CSS animations replay from the start. Priority when a move has multiple effects: drain > damage > heal > buff > debuff.

### Sprites
Sprites are 32×32 px tiles rendered via `Sprite.tsx`, scaled 4× (128×128) in the UI.
- `public/32rogues/rogues.png` — player sprites (7 columns)
- `public/32rogues/monsters.png` — monster sprites (12 columns)

Coordinates stored in `client/src/data/sprites.ts` (player) and on each `Monster` object from the API.

### Shared Types
Both `server/src/types.ts` and `client/src/types.ts` define the domain model. Keep them in sync manually — there is no shared package.

Key types: `Monster`, `Move`, `Stats`, `SpriteCoords`, `StatModifier`, `MoveResult`, `BattleState` (phase: `player_turn | monster_turn | won | lost`; `wonMove: Move | null` — set on win), `LogEntry` (`role`, `moveName`, `effects`, `defenderHpDelta`, `attackerHpDelta`).

Move effects: `damage | heal | drain | self_damage | buff_attack | buff_defense | buff_magic | debuff_attack | debuff_defense | debuff_magic`.

