import type { SpriteCoords } from "../../types";

const SHEET_URLS: Record<string, string> = {
  monsters: "/32rogues/monsters.png",
  rogues:   "/32rogues/rogues.png",
};

const SHEET_COLS: Record<string, number> = {
  monsters: 12,
  rogues:   7,
};

const TILE = 32;

interface Props {
  sprite: SpriteCoords;
  scale?: number;
  flip?: boolean;
}

export default function Sprite({ sprite, scale = 4, flip = false }: Props) {
  const { sheet, row, col } = sprite;
  const size = TILE * scale;
  const sheetCols = SHEET_COLS[sheet];
  const sheetWidth  = sheetCols * TILE * scale;
  const bgX = -(col * size);
  const bgY = -(row * size);

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${SHEET_URLS[sheet]})`,
        backgroundSize: `${sheetWidth}px auto`,
        backgroundPosition: `${bgX}px ${bgY}px`,
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    />
  );
}
