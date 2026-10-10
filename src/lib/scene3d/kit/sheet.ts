import { BoxGeometry, CanvasTexture, Mesh, MeshStandardMaterial, SRGBColorSpace } from 'three';
import type { RGB } from '@/lib/tokens';
import type { Palette } from '../types';

/**
 * A sheet of paper for the document scenes: a thin slab whose face carries ruled
 * "text" — bars of varying length, a heading block, a table — drawn to a small
 * canvas. Bars only: a scene never contains words.
 */
const W = 256;
const H = 362; // A-series proportions
const css = (c: RGB, a = 1) => `rgba(${c.r},${c.g},${c.b},${a})`;
const mix = (a: RGB, b: RGB, t: number): RGB => ({
  r: Math.round(a.r + (b.r - a.r) * t),
  g: Math.round(a.g + (b.g - a.g) * t),
  b: Math.round(a.b + (b.b - a.b) * t),
});

export type SheetLayout = 'text' | 'form' | 'table';

function drawFace(ctx: CanvasRenderingContext2D, palette: Palette, layout: SheetLayout, rng: () => number): void {
  const { bg, text, brand, accent, light } = palette;
  /* Paper has to stand off the page in both themes: lighter than a dark page, and a
     clear step darker than a pale one (the scene's lights lift it back up). */
  const paper = light ? mix(bg, text, 0.16) : mix(bg, text, 0.11);
  const ink = mix(paper, text, light ? 0.72 : 0.5);
  ctx.fillStyle = css(paper);
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = css(ink, light ? 0.5 : 0.35);
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, W - 2, H - 2);

  const bar = (x: number, y: number, w: number, h: number, colour: string) => {
    ctx.fillStyle = colour;
    ctx.fillRect(x, y, w, h);
  };
  bar(24, 26, 92, 12, css(brand, 0.9)); // heading
  bar(24, 46, 150, 5, css(ink, 0.7));

  if (layout === 'table') {
    for (let row = 0; row < 9; row++) {
      const y = 78 + row * 28;
      bar(24, y, W - 48, 1, css(ink, 0.5));
      bar(24, y + 10, 46 + rng() * 30, 6, css(ink, 0.75));
      bar(120, y + 10, 30 + rng() * 24, 6, css(ink, 0.55));
      bar(190, y + 10, 26 + rng() * 16, 6, css(row % 3 === 1 ? accent : ink, row % 3 === 1 ? 0.9 : 0.55));
    }
  } else if (layout === 'form') {
    for (let row = 0; row < 6; row++) {
      const y = 78 + row * 44;
      bar(24, y, 54 + rng() * 26, 5, css(ink, 0.6));
      ctx.strokeStyle = css(ink, 0.55);
      ctx.lineWidth = 1;
      ctx.strokeRect(24.5, y + 10.5, W - 49, 20);
      bar(32, y + 17, 60 + rng() * 90, 6, css(row === 2 ? accent : ink, row === 2 ? 0.95 : 0.8));
    }
  } else {
    let y = 76;
    for (let para = 0; para < 4; para++) {
      const lines = 3 + Math.floor(rng() * 3);
      for (let i = 0; i < lines; i++) {
        const last = i === lines - 1;
        bar(24, y, (W - 48) * (last ? 0.35 + rng() * 0.4 : 0.86 + rng() * 0.14), 5, css(ink, 0.72));
        y += 13;
      }
      y += 12;
    }
  }
}

export interface Sheet {
  mesh: Mesh<BoxGeometry, MeshStandardMaterial[]>;
  /** Redraw the face for a new theme. */
  setTheme(palette: Palette): void;
  /** Width and height in world units. */
  width: number;
  height: number;
}

/** A sheet `height` world units tall, lying in its own XY plane, face towards +Z. */
export function createSheet(palette: Palette, rng: () => number, layout: SheetLayout = 'text', height = 1.5): Sheet {
  const width = (height * W) / H;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  /* The layout is fixed for the life of the sheet: replay the same random draws on a redraw. */
  const draws = Array.from({ length: 64 }, () => rng());
  const paint = (p: Palette) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let i = 0;
    drawFace(ctx, p, layout, () => draws[i++ % draws.length]);
    texture.needsUpdate = true;
  };
  const face = new MeshStandardMaterial({ map: texture, roughness: 0.62, metalness: 0.05 });
  const edge = new MeshStandardMaterial({ roughness: 0.7, metalness: 0.05 });
  // BoxGeometry material order: +x, -x, +y, -y, +z (the face), -z
  const mesh = new Mesh(new BoxGeometry(width, height, 0.012), [edge, edge, edge, edge, face, edge]);
  const setTheme = (p: Palette) => {
    paint(p);
    const paper = p.light ? mix(p.bg, p.text, 0.3) : mix(p.bg, p.text, 0.16);
    edge.color.setRGB(paper.r / 255, paper.g / 255, paper.b / 255, SRGBColorSpace);
  };
  setTheme(palette);
  return { mesh, setTheme, width, height };
}
